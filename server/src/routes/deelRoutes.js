import express from 'express';
import { DeelService } from '../services/deelService.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/deel/countries
 * Lists supported countries & compliance rules
 */
router.get('/countries', authenticate, (req, res) => {
  res.json(DeelService.getCountries());
});

/**
 * GET /api/v1/deel/workers
 * Lists global workforce records
 */
router.get('/workers', authenticate, async (req, res) => {
  try {
    const workers = await DeelService.getGlobalWorkers(req.user.tenantId);
    res.json(workers);
  } catch (err) {
    console.error('List Deel workers error:', err);
    res.status(500).json({ error: 'Failed to fetch global workers.' });
  }
});

/**
 * POST /api/v1/deel/onboard
 * Provisions candidate into Deel Global EOR and creates contract
 */
router.post('/onboard', authenticate, auditAction('DEEL_EOR_ONBOARD', 'Deel'), async (req, res) => {
  try {
    const { candidateId, jobId, countryCode, workerType, annualSalary, currency, startDate } = req.body;
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required for Deel onboarding.' });
    }

    const contract = await DeelService.createCompliantContract({
      tenantId: req.user.tenantId,
      candidateId,
      jobId,
      countryCode: countryCode || 'IN',
      workerType: workerType || 'FULL_TIME_EOR',
      annualCompensation: annualSalary,
      currency,
      startDate
    });

    const worker = await DeelService.onboardToDeelHR({
      tenantId: req.user.tenantId,
      candidateId,
      contractId: contract._id,
      countryCode: countryCode || 'IN',
      workerType: workerType || 'FULL_TIME_EOR'
    });

    res.status(201).json({
      message: `Candidate onboarded successfully to Deel Global EOR (${countryCode || 'IN'}).`,
      contract,
      worker
    });
  } catch (err) {
    console.error('Deel onboarding error:', err);
    res.status(500).json({ error: err.message || 'Failed to execute Deel onboarding.' });
  }
});

export default router;
