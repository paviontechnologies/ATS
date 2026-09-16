import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.resolve(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

let winstonLogger = null;

try {
  const winston = (await import('winston')).default;
  winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
} catch (e) {
  // Built-in fallback structured logger
  winstonLogger = {
    info: (msg, meta = {}) => console.log(`[INFO] ${new Date().toISOString()}: ${msg}`, Object.keys(meta).length ? meta : ''),
    warn: (msg, meta = {}) => console.warn(`[WARN] ${new Date().toISOString()}: ${msg}`, Object.keys(meta).length ? meta : ''),
    error: (msg, meta = {}) => console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`, Object.keys(meta).length ? meta : '')
  };
}

export const logger = winstonLogger;

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      duration
    });
  });
  next();
};
