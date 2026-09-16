import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.CLIENT_PORT || 3001;
const CORE_API_URL = process.env.CORE_API_URL || 'http://127.0.0.1:5000';
const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://127.0.0.1:5001';

const publicDir = path.resolve(__dirname, 'public');

// Robust HTTP forwarder / proxy helper
function proxyRequest(targetBaseUrl, req, res) {
  try {
    const targetUrl = new URL(`${targetBaseUrl}${req.originalUrl.replace(/^\/admin-api/, '/api')}`);
    const bodyData = (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0)
      ? JSON.stringify(req.body)
      : null;

    const reqHeaders = { ...req.headers };
    delete reqHeaders.host;
    delete reqHeaders.connection;
    delete reqHeaders['keep-alive'];
    delete reqHeaders['accept-encoding'];
    delete reqHeaders['content-length'];

    if (bodyData) {
      reqHeaders['content-type'] = 'application/json';
      reqHeaders['content-length'] = Buffer.byteLength(bodyData);
    } else if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      reqHeaders['content-length'] = '0';
    }

    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port,
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers: {
        ...reqHeaders,
        host: `${targetUrl.hostname}:${targetUrl.port}`,
        'x-forwarded-host': req.headers.host || `localhost:${PORT}`
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.status(proxyRes.statusCode);
      for (const [key, value] of Object.entries(proxyRes.headers)) {
        res.setHeader(key, value);
      }
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('[PROXY ERROR]', err.message);
      if (!res.headersSent) {
        res.status(502).json({
          error: 'Gateway / Proxy Error',
          message: `Failed to communicate with backend service: ${err.message}`,
          targetBaseUrl
        });
      }
    });

    if (bodyData) {
      proxyReq.write(bodyData);
    }
    proxyReq.end();
  } catch (err) {
    res.status(502).json({
      error: 'Gateway / Proxy Exception',
      message: err.message
    });
  }
}

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// Forward Core API calls to Port 5000
app.use('/api/v1', (req, res) => {
  proxyRequest(CORE_API_URL, req, res);
});

// Forward Admin API calls to Port 5001
app.use('/admin-api/v1', (req, res) => {
  proxyRequest(ADMIN_API_URL, req, res);
});

// Static assets (no-cache headers so UI updates reflect immediately)
app.use(express.static(publicDir, {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Enterprise ATS Frontend Client Server',
    port: PORT,
    coreApiTarget: CORE_API_URL,
    adminApiTarget: ADMIN_API_URL,
    timestamp: new Date().toISOString()
  });
});

// SPA fallback
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=====================================================`);
  console.log(`🌐 ENTERPRISE ATS FRONTEND RUNNING ON PORT ${PORT}`);
  console.log(`🚀 Client App URL:       http://localhost:${PORT}`);
  console.log(`📡 Core API Target:     ${CORE_API_URL}/api/v1`);
  console.log(`🛡️ Admin API Target:    ${ADMIN_API_URL}/api/v1`);
  console.log(`=====================================================`);
});

export default app;
