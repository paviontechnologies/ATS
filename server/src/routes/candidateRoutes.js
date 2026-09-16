import express from 'express';
import { Candidates, Applications, Interviews, Scorecards, Communications, Jobs } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/candidates
 * Searches and lists candidates with Boolean keyword and skill filtering
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, skill, minExp, tag } = req.query;
    let filter = { tenantId: req.user.tenantId };

    let candidates = await Candidates.find(filter, { sort: { createdAt: -1 } });

    if (search) {
      const q = search.toLowerCase();
      candidates = candidates.filter(c => 
        (c.firstName && c.firstName.toLowerCase().includes(q)) ||
        (c.lastName && c.lastName.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(q))) ||
        (c.summary && c.summary.toLowerCase().includes(q))
      );
    }

    if (skill) {
      const sk = skill.toLowerCase();
      candidates = candidates.filter(c => c.skills && c.skills.some(s => s.toLowerCase() === sk));
    }

    if (minExp) {
      const exp = parseFloat(minExp);
      candidates = candidates.filter(c => (c.totalExperienceYears || 0) >= exp);
    }

    if (tag) {
      candidates = candidates.filter(c => c.tags && c.tags.includes(tag));
    }

    res.json(candidates);
  } catch (err) {
    console.error('List candidates error:', err);
    res.status(500).json({ error: 'Failed to fetch candidates.' });
  }
});

/**
 * GET /api/v1/candidates/:id
 * 360-degree Candidate Dossier
 */
router.get('/:id', authenticate, auditAction('CANDIDATE_VIEWED', 'Candidate'), async (req, res) => {
  try {
    const candidate = await Candidates.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!candidate) return res.status(404).json({ error: 'Candidate not found.' });

    // Fetch related applications with job details
    const applications = await Applications.find({ candidateId: candidate._id, tenantId: req.user.tenantId });
    const appsWithJobs = await Promise.all(applications.map(async (app) => {
      const job = await Jobs.findById(app.jobId);
      return { ...app, jobTitle: job ? job.title : 'Unknown Job', department: job ? job.departmentId : '' };
    }));

    // Fetch interviews & scorecards
    const interviews = await Interviews.find({ applicationId: { $in: applications.map(a => a._id) } });
    const scorecards = await Scorecards.find({ interviewId: { $in: interviews.map(i => i._id) } });
    const communications = await Communications.find({ candidateId: candidate._id });

    res.json({
      ...candidate,
      applications: appsWithJobs,
      interviews,
      scorecards,
      communications
    });
  } catch (err) {
    console.error('Get candidate dossier error:', err);
    res.status(500).json({ error: 'Failed to retrieve candidate dossier.' });
  }
});

/**
 * POST /api/v1/candidates/upload-resume
 * Ingests resume text/file, extracts structured profile via AI
 */
router.post('/upload-resume', authenticate, auditAction('RESUME_UPLOADED', 'Candidate'), async (req, res) => {
  try {
    const { rawText, filename = 'resume.pdf', jobId } = req.body;
    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({ error: 'Valid resume text content is required for parsing.' });
    }

    // AI Resume Parser
    const parsed = await AIService.parseResumeText(rawText, filename);

    // Create or update candidate
    let candidate = await Candidates.findOne({ email: parsed.email, tenantId: req.user.tenantId });
    if (!candidate) {
      candidate = await Candidates.insertOne({
        tenantId: req.user.tenantId,
        ...parsed,
        source: 'RECRUITER_UPLOAD',
        tags: ['New Application', 'AI Parsed']
      });
    }

    let application = null;
    let matchScore = null;

    if (jobId) {
      const job = await Jobs.findById(jobId);
      if (job) {
        matchScore = AIService.calculateCandidateJobMatch(candidate, job);
        application = await Applications.insertOne({
          tenantId: req.user.tenantId,
          jobId,
          candidateId: candidate._id,
          stageId: 'Screening',
          status: 'ACTIVE',
          aiMatchScore: matchScore,
          stageHistory: [{ fromStage: 'Applied', toStage: 'Screening', changedAt: new Date().toISOString() }]
        });
      }
    }

    res.status(201).json({ candidate, application, matchScore });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ error: 'Failed to process and parse resume.' });
  }
});

/**
 * POST /api/v1/candidates/detect-duplicates
 */
router.post('/detect-duplicates', authenticate, async (req, res) => {
  const { email, phone } = req.body;
  const duplicates = await Candidates.find({
    tenantId: req.user.tenantId,
    $or: [
      { email: (email || '').toLowerCase().trim() },
      { phone: (phone || '').trim() }
    ]
  });

  res.json({
    hasDuplicates: duplicates.length > 0,
    matches: duplicates
  });
});

export default router;
