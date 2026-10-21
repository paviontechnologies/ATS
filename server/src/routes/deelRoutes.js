import express from 'express';
import { DeelService } from '../services/deelService.js';
import { Candidates, Jobs } from '../db/database.js';
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
    let { candidateId, candidateName, name, jobId, jobTitle, role, countryCode, country, workerType, annualSalary, currency, startDate } = req.body;

    if (!candidateId && (candidateName || name)) {
      const searchName = candidateName || name;
      const allCands = await Candidates.find({});
      const parts = searchName.toLowerCase().split(' ');
      const match = allCands.find(c => {
        const full = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
        return parts.some(p => full.includes(p));
      });
      if (match) candidateId = match._id;
    }
    if (!candidateId) {
      const firstCand = (await Candidates.find({}))[0];
      if (firstCand) candidateId = firstCand._id;
    }
    if (!candidateId) {
      return res.status(400).json({ error: 'Candidate ID is required for Deel onboarding.' });
    }

    if (!jobId && (jobTitle || role)) {
      const searchTitle = jobTitle || role;
      const allJobs = await Jobs.find({});
      const match = allJobs.find(j => (j.title || '').toLowerCase().includes(searchTitle.toLowerCase()));
      if (match) jobId = match._id;
    }
    if (!jobId) {
      const firstJob = (await Jobs.find({}))[0];
      if (firstJob) jobId = firstJob._id;
    }

    let cCode = countryCode || 'IN';
    if (!countryCode && country) {
      const c = country.toLowerCase();
      if (c.includes('india')) cCode = 'IN';
      else if (c.includes('united states') || c.includes('usa')) cCode = 'US';
      else if (c.includes('united kingdom') || c.includes('uk')) cCode = 'GB';
      else if (c.includes('germany')) cCode = 'DE';
      else if (c.includes('singapore')) cCode = 'SG';
      else if (c.includes('canada')) cCode = 'CA';
      else if (c.includes('netherlands')) cCode = 'NL';
    }

    const contract = await DeelService.createCompliantContract({
      tenantId: req.user.tenantId,
      candidateId,
      jobId,
      countryCode: cCode,
      workerType: workerType || 'FULL_TIME_EOR',
      annualCompensation: annualSalary || 1800000,
      currency: currency || (cCode === 'IN' ? 'INR' : 'USD'),
      startDate: startDate || new Date().toISOString()
    });

    const worker = await DeelService.onboardToDeelHR({
      tenantId: req.user.tenantId,
      candidateId,
      contractId: contract._id,
      countryCode: cCode,
      workerType: workerType || 'FULL_TIME_EOR'
    });

    res.status(201).json({
      message: `Candidate onboarded successfully to Deel Global EOR (${cCode}).`,
      contract,
      worker
    });
  } catch (err) {
    console.error('Deel onboarding error:', err);
    res.status(500).json({ error: err.message || 'Failed to execute Deel onboarding.' });
  }
});

export default router;
