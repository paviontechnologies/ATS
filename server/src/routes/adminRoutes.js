import express from 'express';
import { Companies, AuditLogs, Users } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/admin/company
 */
router.get('/company', authenticate, async (req, res) => {
  const company = await Companies.findById(req.user.tenantId);
  res.json(company);
});

/**
 * PUT /api/v1/admin/company
 */
router.put('/company', authenticate, requireRole(['SUPER_ADMIN', 'COMPANY_ADMIN']), auditAction('COMPANY_SETTINGS_UPDATED', 'Company'), async (req, res) => {
  try {
    const { name, branding, settings } = req.body;
    const updated = await Companies.updateById(req.user.tenantId, {
      name,
      branding,
      settings
    });
    res.json(updated.doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update company profile.' });
  }
});

/**
 * GET /api/v1/admin/audit-logs
 */
router.get('/audit-logs', authenticate, requireRole(['SUPER_ADMIN', 'COMPANY_ADMIN']), async (req, res) => {
  try {
    const logs = await AuditLogs.find({ tenantId: req.user.tenantId }, { sort: { createdAt: -1 }, limit: 100 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

/**
 * GET /api/v1/admin/users
 */
router.get('/users', authenticate, async (req, res) => {
  const users = await Users.find({ tenantId: req.user.tenantId });
  res.json(users);
});

export default router;
