import express from 'express';
import { WorkflowService } from '../services/workflowService.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/workflows
 * Lists all active autopilot rules and execution logs
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const rules = await WorkflowService.getRules();
    const logs = await WorkflowService.getLogs(req.user.tenantId);
    res.json({ rules, logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workflows.' });
  }
});

/**
 * POST /api/v1/workflows/toggle
 * Toggle rule on or off
 */
router.post('/toggle', authenticate, auditAction('WORKFLOW_RULE_TOGGLED', 'Workflow'), async (req, res) => {
  try {
    const { ruleId, isEnabled } = req.body;
    const updated = await WorkflowService.toggleRule(ruleId, isEnabled);
    res.json({ message: 'Workflow rule status updated.', rule: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rule status.' });
  }
});

/**
 * POST /api/v1/workflows/trigger
 * Manually trigger an autopilot event simulation
 */
router.post('/trigger', authenticate, auditAction('WORKFLOW_TRIGGERED', 'Workflow'), async (req, res) => {
  try {
    const { eventName, candidateName, candidateEmail, jobTitle, candidateId } = req.body;
    const result = await WorkflowService.handleEvent(eventName, {
      tenantId: req.user.tenantId,
      candidateId,
      candidateName: candidateName || 'Alex Rivera',
      candidateEmail: candidateEmail || 'alex.rivera@example.com',
      jobTitle: jobTitle || 'Senior Full-Stack Engineer'
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to trigger workflow.' });
  }
});

export default router;
