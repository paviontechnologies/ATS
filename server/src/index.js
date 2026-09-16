import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { seedDatabase } from './seed.js';
import { requestLogger, logger } from './middleware/logger.js';
import { swaggerSpec, renderSwaggerHtml } from './swagger.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import scorecardRoutes from './routes/scorecardRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import careerRoutes from './routes/careerRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB and ensure seed data
await seedDatabase();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Store io instance for route handlers
app.set('io', io);

// Security & Logging Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(requestLogger);

// Rate Limiter
try {
  const rateLimit = (await import('express-rate-limit')).default;
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false
  }));
} catch (e) {
  // Fallback rate limiting
}

// Swagger / OpenAPI 3.0 Documentation Endpoints
app.get('/api/v1/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

app.get('/api/v1/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(renderSwaggerHtml(swaggerSpec));
});

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Enterprise ATS Core API (JavaScript)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    swaggerDocs: '/api/v1/docs'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/v1/scorecards', scorecardRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/careers', careerRoutes);

// Socket.IO event handler
io.on('connection', (socket) => {
  logger.info(`[WEBSOCKET] Client connected: ${socket.id}`);

  socket.on('join_tenant', (tenantId) => {
    socket.join(`tenant_${tenantId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`[WEBSOCKET] Client disconnected: ${socket.id}`);
  });
});

// Serve frontend static assets if client build exists
const clientDist = path.resolve(__dirname, '../../client/dist');
const clientPublic = path.resolve(__dirname, '../../client/public');

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else if (fs.existsSync(clientPublic)) {
  app.use(express.static(clientPublic));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientPublic, 'index.html'));
  });
}

// Global 404 for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled server exception', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred.'
  });
});

// Start listening
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`=====================================================`);
  logger.info(`🚀 ENTERPRISE ATS RUNNING ON PORT ${PORT}`);
  logger.info(`📡 REST API Base:        http://localhost:${PORT}/api/v1`);
  logger.info(`📚 Swagger OpenAPI UI:   http://localhost:${PORT}/api/v1/docs`);
  logger.info(`🌐 Public Career Portal: http://localhost:${PORT}/careers`);
  logger.info(`📊 Recruiter Cockpit:    http://localhost:${PORT}/app`);
  logger.info(`🩺 Healthcheck:          http://localhost:${PORT}/health`);
  logger.info(`=====================================================`);
});

export default app;
