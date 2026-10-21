import express from 'express';
import cors from 'cors';
import http from 'http';
import { dbManager, Companies, Users, AuditLogs } from './db/database.js';
import { mysqlDb } from './db/mysqlAdapter.js';
import { requestLogger, logger } from './middleware/logger.js';
import { TEST_CREDENTIALS } from './seed.js';

const app = express();
const PORT = process.env.ADMIN_PORT || 5001;

// Ensure database initialization
await dbManager.init();
await mysqlDb.init();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Admin OpenAPI 3.0 Documentation Spec
const adminSwaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Enterprise ATS - Dedicated Admin API',
    version: '1.0.0',
    description: 'Fleet-level Administration, Multi-Tenant Provisioning, Audit Compliance, and System Telemetry.'
  },
  servers: [
    { url: `http://localhost:${PORT}/api/v1`, description: 'Admin API Gateway (Port 5001)' }
  ],
  paths: {
    '/admin/tenants': {
      get: { summary: 'List all company tenants across the platform fleet' },
      post: { summary: 'Provision a new corporate tenant' }
    },
    '/admin/users': {
      get: { summary: 'List fleet users and roles across all organizations' },
      post: { summary: 'Create new administrator or recruiter account' }
    },
    '/admin/subscriptions': {
      get: { summary: 'List subscription tiers and license quotas' }
    },
    '/admin/audit-logs': {
      get: { summary: 'Retrieve system security audit trail' }
    },
    '/admin/system-health': {
      get: { summary: 'Real-time database, memory, and service health metrics' }
    },
    '/admin/credentials': {
      get: { summary: 'Retrieve pre-configured test credentials for all 7 platform roles' }
    }
  }
};

// Swagger UI HTML generator
function renderAdminSwaggerHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin API Docs - Enterprise ATS</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #0f172a; font-family: sans-serif; }
    .topbar { display: none !important; }
    .swagger-ui .info .title { color: #f8fafc; }
    .swagger-ui .info { margin: 24px 0; }
    .header-banner {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 16px 24px;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-banner h1 { color: #38bdf8; margin: 0; font-size: 1.25rem; }
    .header-banner span { background: #0369a1; color: #e0f2fe; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header-banner">
    <h1>🛡️ Enterprise ATS — Dedicated Admin API (Port 5001)</h1>
    <span>PORT 5001 ACTIVE</span>
  </div>
  <div id="swagger-ui" style="max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; margin-top: 20px;"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/v1/swagger.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis],
      layout: 'BaseLayout'
    });
  </script>
</body>
</html>`;
}

// Docs endpoints
app.get('/', (req, res) => res.redirect('/api/v1/docs'));
app.get('/api/v1/swagger.json', (req, res) => res.json(adminSwaggerSpec));
app.get('/api/v1/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(renderAdminSwaggerHtml());
});

// Admin Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Enterprise ATS Admin API Gateway',
    port: PORT,
    database: mysqlDb.isNativeMySQL ? 'MySQL (Native Cluster)' : 'MySQL (Relational Engine Active)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    docs: `http://localhost:${PORT}/api/v1/docs`
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Enterprise ATS Admin API Gateway',
    port: PORT,
    database: mysqlDb.isNativeMySQL ? 'MySQL (Native Cluster)' : 'MySQL (Relational Engine Active)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 1. Get Test Credentials (Convenient helper for QA and evaluation)
app.get('/api/v1/admin/credentials', (req, res) => {
  res.json({
    title: 'Pre-configured Test Accounts for Enterprise ATS',
    credentials: TEST_CREDENTIALS.map(c => ({
      role: c.role,
      name: c.name,
      email: c.email,
      password: c.password,
      avatar: c.avatar,
      description: c.description
    }))
  });
});

// 2. Tenants (Companies) Management
app.get('/api/v1/admin/tenants', async (req, res) => {
  try {
    const tenants = await Companies.find({});
    res.json(tenants);
  } catch (err) {
    logger.error('Failed to list tenants:', err);
    res.status(500).json({ error: 'Failed to retrieve tenants' });
  }
});

app.post('/api/v1/admin/tenants', async (req, res) => {
  try {
    const { name, subdomain, branding, settings } = req.body;
    if (!name || !subdomain) {
      return res.status(400).json({ error: 'Tenant name and subdomain are required.' });
    }

    const newTenant = await Companies.insertOne({
      name,
      subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      branding: branding || {
        primaryColor: '#2563EB',
        accentColor: '#10B981',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60'
      },
      settings: settings || {
        timezone: 'UTC',
        currency: 'USD',
        retentionDays: 365
      },
      plan: 'ENTERPRISE',
      status: 'ACTIVE'
    });

    await AuditLogs.insertOne({
      tenantId: newTenant._id,
      action: 'TENANT_PROVISIONED',
      entityType: 'Company',
      entityId: newTenant._id,
      performedBy: 'SUPER_ADMIN',
      timestamp: new Date().toISOString()
    });

    res.status(201).json(newTenant);
  } catch (err) {
    logger.error('Error creating tenant:', err);
    res.status(500).json({ error: 'Failed to create tenant.' });
  }
});

// 3. User Fleet Directory
app.get('/api/v1/admin/users', async (req, res) => {
  try {
    const { tenantId, role } = req.query;
    const filter = {};
    if (tenantId) filter.tenantId = tenantId;
    if (role) filter.role = role;

    const users = await Users.find(filter);
    const sanitized = users.map(u => ({
      id: u._id,
      tenantId: u.tenantId,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      email: u.email,
      role: u.role,
      testPassword: u.plainPasswordForDemo || 'Admin@2026',
      isActive: u.isActive !== false,
      avatarUrl: u.avatarUrl,
      createdAt: u.createdAt
    }));

    res.json(sanitized);
  } catch (err) {
    logger.error('Failed to list admin users:', err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// 4. Subscriptions & Tier Quotas
app.get('/api/v1/admin/subscriptions', async (req, res) => {
  const plans = [
    {
      tier: 'STARTER',
      priceMonthly: 199,
      maxActiveJobs: 5,
      maxRecruiters: 2,
      aiParsingQuota: 250,
      features: ['Basic Pipeline', 'Candidate Sourcing', 'Standard Career Portal']
    },
    {
      tier: 'PROFESSIONAL',
      priceMonthly: 499,
      maxActiveJobs: 25,
      maxRecruiters: 10,
      aiParsingQuota: 1500,
      features: ['AI Resume Scoring', 'Blind Interview Scorecards', 'Calendar Scheduling', 'Custom Careers Site']
    },
    {
      tier: 'ENTERPRISE',
      priceMonthly: 1299,
      maxActiveJobs: -1,
      maxRecruiters: -1,
      aiParsingQuota: -1,
      features: ['Unlimited AI Copilot', 'Multi-Tenant RBAC Fleet', 'Dedicated MySQL DB', 'Custom Webhooks & SSO']
    }
  ];
  res.json({ currentTier: 'ENTERPRISE', status: 'ACTIVE', plans });
});

// 5. System Health & Relational Database Telemetry
app.get('/api/v1/admin/system-health', async (req, res) => {
  const memUsage = process.memoryUsage();
  const tables = Object.keys(mysqlDb.storage || {});

  res.json({
    status: 'OPTIMAL',
    ports: {
      frontend: 3001,
      coreApi: 5000,
      adminApi: PORT
    },
    database: {
      type: 'MySQL Relational Database',
      mode: mysqlDb.isNativeMySQL ? 'MySQL Native Cluster (InnoDB Compatible)' : 'MySQL Relational Engine (InnoDB Compatible)',
      persistedFile: 'data/ats_mysql_storage.json',
      activeTablesCount: tables.length,
      tablesSummary: tables.map(t => ({
        table: t,
        records: Array.isArray(mysqlDb.storage[t]) ? mysqlDb.storage[t].length : 0
      }))
    },
    system: {
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
      heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
      rssMB: Math.round(memUsage.rss / 1024 / 1024)
    },
    timestamp: new Date().toISOString()
  });
});

// 6. Security Audit Trail
app.get('/api/v1/admin/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLogs.find({}, { sort: { createdAt: -1 }, limit: 100 });
    res.json(logs);
  } catch (err) {
    logger.error('Failed to get audit logs:', err);
    res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
});

// Start listening
const server = http.createServer(app);
server.listen(PORT, () => {
  logger.info(`=====================================================`);
  logger.info(`🛡️ ENTERPRISE ATS ADMIN API RUNNING ON PORT ${PORT}`);
  logger.info(`📡 Admin REST API:       http://localhost:${PORT}/api/v1`);
  logger.info(`📚 Admin Swagger Docs:   http://localhost:${PORT}/api/v1/docs`);
  logger.info(`🔑 Pre-configured Users: http://localhost:${PORT}/api/v1/admin/credentials`);
  logger.info(`🩺 System Health:        http://localhost:${PORT}/health`);
  logger.info(`=====================================================`);
});

export default app;
