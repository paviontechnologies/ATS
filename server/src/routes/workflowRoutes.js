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

/**
 * POST /api/v1/workflows/rules
 * Creates a custom If-Then automation rule with optional delayed execution
 */
router.post('/rules', authenticate, auditAction('WORKFLOW_RULE_CREATED', 'Workflow'), async (req, res) => {
  try {
    const name = req.body.name;
    const triggerEvent = req.body.triggerEvent || req.body.trigger;
    const actionType = req.body.actionType || req.body.action;
    const delayHours = req.body.delayHours !== undefined ? req.body.delayHours : 24;
    const description = req.body.description;

    if (!name || !triggerEvent || !actionType) {
      return res.status(400).json({ error: 'Rule name, trigger event, and action type are required.' });
    }

    const newRule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      trigger: triggerEvent,
      actionType,
      delayHours: parseInt(delayHours) || 24,
      description: description || `IF ${triggerEvent} THEN execute ${actionType} (Delayed by ${delayHours}h).`,
      isEnabled: true,
      executionCount: 0,
      createdAt: new Date().toISOString()
    };

    const created = await WorkflowService.createRule(newRule);
    res.status(201).json({
      message: `Automation rule "${name}" created successfully and is now active.`,
      rule: created || newRule
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create automation rule.' });
  }
});

export default router;
