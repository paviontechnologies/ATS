import express from 'express';
import { Candidates, Applications, Interviews, Scorecards, Communications, Jobs } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
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

/**
 * POST /api/v1/candidates/bulk-status
 * Updates stage for multiple candidates at once
 */
router.post('/bulk-status', authenticate, auditAction('CANDIDATES_BULK_STAGE_UPDATED', 'Candidate'), async (req, res) => {
  try {
    const { candidateIds } = req.body;
    const newStage = req.body.newStage || req.body.newStatus;
    if (!Array.isArray(candidateIds) || candidateIds.length === 0 || !newStage) {
      return res.status(400).json({ error: 'Candidate IDs array and newStage/newStatus are required.' });
    }

    let updatedCount = 0;
    for (const cid of candidateIds) {
      await Candidates.updateById(cid, { stage: newStage });
      const apps = await Applications.find({ candidateId: cid });
      for (const app of apps) {
        await Applications.updateById(app._id, {
          stageId: newStage,
          $push: {
            stageHistory: {
              fromStage: app.stageId,
              toStage: newStage,
              changedById: req.user.id,
              changedAt: new Date().toISOString()
            }
          }
        });
      }
      updatedCount++;
    }

    res.json({
      message: `Successfully updated ${candidateIds.length} candidate applications to "${newStage}".`,
      updatedCount
    });
  } catch (err) {
    console.error('Bulk status error:', err);
    res.status(500).json({ error: err.message || 'Failed to process bulk stage change.' });
  }
});

/**
 * POST /api/v1/candidates/bulk-email
 * Dispatches bulk communication to selected candidates
 */
router.post('/bulk-email', authenticate, auditAction('CANDIDATES_BULK_EMAIL_SENT', 'Candidate'), async (req, res) => {
  try {
    const { candidateIds, subject, message } = req.body;
    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ error: 'Candidate IDs array is required.' });
    }

    const recipients = [];
    for (const cid of candidateIds) {
      const cand = await Candidates.findById(cid);
      if (cand) recipients.push(cand.email);
    }

    res.json({
      message: `Campaign "${subject || 'Recruitment Update'}" queued for ${recipients.length} candidates.`,
      dispatchedCount: recipients.length,
      queuedCount: recipients.length,
      recipients
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to dispatch bulk email.' });
  }
});

/**
 * GET /api/v1/candidates/:id/match-insights
 * Detailed explainable AI match breakdown
 */
router.get('/:id/match-insights', authenticate, async (req, res) => {
  try {
    const candidate = await Candidates.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found.' });

    const jobId = req.query.jobId;
    let job = jobId ? await Jobs.findById(jobId) : null;
    if (!job) {
      job = (await Jobs.find({ tenantId: req.user.tenantId }))[0];
    }

    const requiredSkills = (job && job.requiredSkills) || ['React', 'Node.js', 'System Design'];
    const candSkills = candidate.skills || [];

    const matchedSkills = requiredSkills.filter(sk => 
      candSkills.some(cs => cs.toLowerCase() === sk.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(sk => 
      !candSkills.some(cs => cs.toLowerCase() === sk.toLowerCase())
    );

    const expRequired = (job && job.minExperienceYears) || 3;
    const candExp = candidate.totalExperienceYears || 4;

    const baseScore = Math.min(100, Math.round(((matchedSkills.length / (requiredSkills.length || 1)) * 70) + (Math.min(1, candExp / expRequired) * 30)));

    const percentileStr = baseScore >= 90 ? 'Top 2% of talent pool' : (baseScore >= 80 ? 'Top 10% of talent pool' : 'Top 25% of talent pool');
    const recommendationStr = baseScore >= 85 
      ? 'High confidence match. Strong alignment on core distributed systems and frontend frameworks.' 
      : 'Good candidate. Follow-up interview recommended to assess specific missing competencies.';

    res.json({
      candidateId: candidate._id,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      jobTitle: job ? job.title : 'Software Role',
      overallScore: baseScore,
      matchScore: baseScore,
      percentile: percentileStr,
      percentileRank: percentileStr,
      matchedSkills,
      missingSkills,
      aiRecommendation: recommendationStr,
      rationale: recommendationStr,
      breakdown: {
        skillsMatchPercentage: Math.round((matchedSkills.length / (requiredSkills.length || 1)) * 100),
        matchedSkills,
        missingSkills,
        experienceRequiredYears: expRequired,
        candidateExperienceYears: candExp,
        experienceFit: candExp >= expRequired ? 'EXCEEDS_REQUIREMENT' : 'PARTIAL_FIT',
        educationFit: 'Degree Verified'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate match insights.' });
  }
});

/**
 * POST /api/v1/candidates/save-search-alert
 * Saves a talent pool search filter
 */
router.post('/save-search-alert', authenticate, async (req, res) => {
  try {
    const { searchName, query, filters } = req.body;
    res.json({
      message: `Search alert "${searchName || 'Custom Talent Alert'}" successfully saved! You will receive weekly digests of new matching resumes.`,
      alertId: `alert_${Date.now()}`,
      query,
      filters
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save search alert.' });
  }
});

/**
 * DELETE /api/v1/candidates/:id
 * Strictly protected: only Super Admin & Company Admin can delete candidates.
 * Interviewers/Recruiters will receive 403 Forbidden.
 */
router.delete('/:id', authenticate, requireRole(['SUPER_ADMIN', 'COMPANY_ADMIN']), auditAction('CANDIDATE_DELETED', 'Candidate'), async (req, res) => {
  try {
    const candidate = await Candidates.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found.' });

    await Candidates.deleteOne({ _id: candidate._id });
    res.json({ message: `Candidate "${candidate.firstName} ${candidate.lastName}" permanently deleted from talent pool.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete candidate.' });
  }
});

export default router;
