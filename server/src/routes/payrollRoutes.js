import express from 'express';
import { PayrollService } from '../services/payrollService.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * POST /api/v1/payroll/calculate-ctc
 * Computes Indian CTC breakdown (Basic, HRA, PF 12%, ESI, PT, TDS, Net Pay)
 */
router.post('/calculate-ctc', authenticate, (req, res) => {
  try {
    const { annualCTC } = req.body;
    const breakup = PayrollService.calculateCTCBreakup(annualCTC || 1800000);
    res.json(breakup);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate CTC breakdown.' });
  }
});

/**
 * GET /api/v1/payroll/employees
 * Lists active employees synced with RazorpayX
 */
router.get('/employees', authenticate, async (req, res) => {
  try {
    const employees = await PayrollService.getPayrollEmployees(req.user.tenantId);
    res.json(employees);
  } catch (err) {
    console.error('List payroll employees error:', err);
    res.status(500).json({ error: 'Failed to fetch payroll records.' });
  }
});

/**
 * POST /api/v1/payroll/sync-employee
 * Syncs candidate to RazorpayX payroll
 */
router.post('/sync-employee', authenticate, auditAction('RAZORPAYX_EMPLOYEE_SYNCED', 'Payroll'), async (req, res) => {
  try {
    const { candidateId, annualCTC, panNumber } = req.body;
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required.' });
    }

    const record = await PayrollService.syncEmployeeToPayroll({
      tenantId: req.user.tenantId,
      candidateId,
      annualCTC: annualCTC || 1800000,
      panNumber
    });

    res.status(201).json({
      message: 'Employee synced to RazorpayX Payroll with PF UAN & ESI IP numbers.',
      record
    });
  } catch (err) {
    console.error('Sync payroll error:', err);
    res.status(500).json({ error: err.message || 'Failed to sync employee to payroll.' });
  }
});

/**
 * POST /api/v1/payroll/disburse
 * Simulates direct salary disbursement via RazorpayX
 */
router.post('/disburse', authenticate, auditAction('RAZORPAYX_SALARY_DISBURSED', 'Payroll'), async (req, res) => {
  try {
    const { recordId, month } = req.body;
    if (!recordId) {
      return res.status(400).json({ error: 'Payroll Record ID is required.' });
    }

    const result = await PayrollService.disburseSalaryPayout({
      tenantId: req.user.tenantId,
      recordId,
      month: month || 'October 2026'
    });

    res.json(result);
  } catch (err) {
    console.error('Payroll disbursement error:', err);
    res.status(500).json({ error: err.message || 'Disbursement simulation failed.' });
  }
});

export default router;
