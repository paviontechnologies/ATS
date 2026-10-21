import express from 'express';
import { VeraHireService } from '../services/verahireService.js';
import { Jobs, Candidates, dbManager } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();
const VeraHireInterviews = dbManager.getCollection('verahireInterviews');

/**
 * GET /api/v1/verahire/rankings/:jobId
 * Retrieves the ranked shortlist for a job (e.g. 94, 89, 86, 81)
 */
router.get('/rankings/:jobId', authenticate, async (req, res) => {
  try {
    const { jobId } = req.params;
    const rankings = await VeraHireService.getRankedShortlist(jobId, req.user.tenantId);
    res.json(rankings);
  } catch (err) {
    console.error('VeraHire rankings error:', err);
    res.status(500).json({ error: 'Failed to retrieve VeraHire rankings.' });
  }
});

/**
 * GET /api/v1/verahire/sessions
 * List all VeraHire voice screening sessions
 */
router.get('/sessions', authenticate, async (req, res) => {
  try {
    let sessions = await VeraHireInterviews.find({});
    if (sessions.length === 0) {
      // Auto-populate for existing jobs
      const jobs = await Jobs.find({}, { limit: 2 });
      for (const job of jobs) {
        await VeraHireService.getRankedShortlist(job._id, req.user.tenantId);
      }
      sessions = await VeraHireInterviews.find({});
    }
    sessions.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch VeraHire sessions.' });
  }
});

/**
 * POST /api/v1/verahire/screen
 * Trigger autonomous first-round voice screening evaluation
 */
router.post('/screen', authenticate, auditAction('VERAHIRE_SCREENING_TRIGGERED', 'VeraHire'), async (req, res) => {
  try {
    let { jobId, candidateId, applicationId, candidateName, jobTitle, responses = [] } = req.body;

    if (!jobId && jobTitle) {
      const allJobs = await Jobs.find({});
      const matchedJob = allJobs.find(j => (j.title || '').toLowerCase().includes(jobTitle.toLowerCase()));
      if (matchedJob) jobId = matchedJob._id;
    }
    if (!jobId) {
      const firstJob = (await Jobs.find({}))[0];
      if (firstJob) jobId = firstJob._id;
    }

    if (!candidateId && candidateName) {
      const allCands = await Candidates.find({});
      const parts = candidateName.toLowerCase().split(' ');
      const matchedCand = allCands.find(c => {
        const full = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
        return parts.some(p => full.includes(p));
      });
      if (matchedCand) candidateId = matchedCand._id;
    }
    if (!candidateId) {
      const firstCand = (await Candidates.find({}))[0];
      if (firstCand) candidateId = firstCand._id;
    }

    if (!jobId || !candidateId) {
      return res.status(400).json({ error: 'Job ID and Candidate ID are required.' });
    }

    const evaluation = await VeraHireService.evaluateScreeningSession({
      tenantId: req.user.tenantId,
      jobId,
      candidateId,
      applicationId,
      responses
    });

    res.json({
      message: 'VeraHire first-round AI screening completed successfully.',
      evaluation,
      session: evaluation
    });
  } catch (err) {
    console.error('VeraHire screen error:', err);
    res.status(500).json({ error: err.message || 'Failed to execute VeraHire screening.' });
  }
});

/**
 * GET /api/v1/verahire/questions/:jobId
 * Generates dynamic voice screening questions
 */
router.get('/questions/:jobId', authenticate, async (req, res) => {
  try {
    const job = await Jobs.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    const questions = VeraHireService.generateScreeningQuestions(job, {});
    const criteria = VeraHireService.extractJobCriteria(job);

    res.json({ criteria, questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate VeraHire questions.' });
  }
});

export default router;
