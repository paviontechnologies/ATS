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

/**
 * POST /api/v1/admin/users
 * Adds a new team member with specific role
 */
router.post('/users', authenticate, requireRole(['SUPER_ADMIN', 'COMPANY_ADMIN']), auditAction('USER_CREATED', 'User'), async (req, res) => {
  try {
    const { firstName, lastName, email, role = 'RECRUITER', password = 'password123' } = req.body;
    if (!email || !firstName) {
      return res.status(400).json({ error: 'First name and email are required.' });
    }

    const existing = await Users.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists in the company.' });
    }

    const newUser = await Users.insertOne({
      firstName,
      lastName: lastName || '',
      email: email.toLowerCase().trim(),
      role: role.toUpperCase(),
      plainPasswordForDemo: password,
      passwordHash: '$2a$10$jsqFwu1Ko0dSkvtdkDGmaes0KypGkRnMkVQ/s/hmea3Jrp07/Q26O',
      tenantId: req.user.tenantId,
      isActive: true,
      avatarUrl: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80`
    });

    res.status(201).json({
      message: `User ${firstName} ${lastName || ''} successfully added as ${role}.`,
      user: newUser
    });
  } catch (err) {
    console.error('Add user error:', err);
    res.status(500).json({ error: 'Failed to add user.' });
  }
});

/**
 * PATCH /api/v1/admin/users/:id/role
 * Updates role and permissions of an existing user
 */
router.patch('/users/:id/role', authenticate, requireRole(['SUPER_ADMIN', 'COMPANY_ADMIN']), auditAction('USER_ROLE_UPDATED', 'User'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required.' });

    const updated = await Users.updateById(req.params.id, {
      role: role.toUpperCase(),
      updatedAt: new Date().toISOString()
    });

    res.json({ message: 'User role updated successfully.', user: updated.doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

/**
 * GET /api/v1/admin/roles-permissions
 * Returns standard enterprise RBAC matrix
 */
router.get('/roles-permissions', authenticate, (req, res) => {
  const matrix = [
    {
      role: 'ADMIN',
      displayName: 'Company Administrator',
      accessLevel: 'Full Access',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Complete administrative privileges including billing, tenant settings, member invitation, candidate deletion, and global audit logs.',
      permissions: ['settings_manage', 'billing_view', 'users_manage', 'candidate_delete', 'job_delete', 'offer_sign', 'job_approve']
    },
    {
      role: 'RECRUITER',
      displayName: 'Talent Acquisition Partner',
      accessLevel: 'Pipeline & Sourcing',
      badgeColor: 'bg-blue-100 text-blue-800',
      description: 'Candidate pipeline operations, multi-board job posting (Naukri, Indeed, Monster, Dice), resume parsing, calendar scheduling, and candidate communications.',
      permissions: ['job_create', 'candidate_add', 'candidate_move', 'interview_schedule', 'email_send', 'job_syndicate']
    },
    {
      role: 'HIRING_MANAGER',
      displayName: 'Department Hiring Manager',
      accessLevel: 'Requisition & Approval',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Job requisition creation, candidate resume review, interview participation, offer package approval, and hiring decisions.',
      permissions: ['job_requisition_create', 'job_approve', 'candidate_review', 'interview_conduct', 'scorecard_submit', 'offer_create']
    },
    {
      role: 'INTERVIEWER',
      displayName: 'Technical / Cultural Interviewer',
      accessLevel: 'Scorecards & Feedback Only',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'View assigned candidate profiles, conduct interviews via Live Studio, submit frozen 1-5 star scorecards. Cannot delete or publish jobs.',
      permissions: ['assigned_candidate_view', 'scorecard_submit', 'interview_conduct']
    }
  ];
  res.json(matrix);
});

export default router;
