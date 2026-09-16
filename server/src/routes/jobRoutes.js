import express from 'express';
import { Jobs, Applications } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/jobs
 * Lists jobs for the tenant
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const filter = { tenantId: req.user.tenantId };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.department) {
      filter.departmentId = req.query.department;
    }

    const jobs = await Jobs.find(filter, { sort: { createdAt: -1 } });

    // Attach application counts to each job
    const jobsWithMetrics = await Promise.all(jobs.map(async (job) => {
      const appCount = await Applications.countDocuments({ jobId: job._id, tenantId: req.user.tenantId });
      return {
        ...job,
        applicationCount: appCount
      };
    }));

    res.json(jobsWithMetrics);
  } catch (err) {
    console.error('List jobs error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

/**
 * GET /api/v1/jobs/:id
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const job = await Jobs.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    const applicationCount = await Applications.countDocuments({ jobId: job._id, tenantId: req.user.tenantId });
    res.json({ ...job, applicationCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job details.' });
  }
});

/**
 * POST /api/v1/jobs
 * Creates a job requisition
 */
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'COMPANY_ADMIN', 'RECRUITER', 'HIRING_MANAGER']), auditAction('JOB_CREATED', 'Job'), async (req, res) => {
  try {
    const {
      title,
      departmentId,
      locationId,
      workplaceType,
      employmentType,
      salaryRange,
      minExperienceYears,
      requiredSkills,
      preferredSkills,
      responsibilities,
      requirements,
      descriptionHtml,
      knockoutQuestions,
      status = 'PUBLISHED'
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Job title is required.' });
    }

    const job = await Jobs.insertOne({
      tenantId: req.user.tenantId,
      title,
      departmentId: departmentId || 'Engineering',
      locationId: locationId || 'San Francisco, CA (Remote)',
      workplaceType: workplaceType || 'HYBRID',
      employmentType: employmentType || 'FULL_TIME',
      hiringManagerId: req.user.id,
      recruiterId: req.user.id,
      salaryRange: salaryRange || { min: 120000, max: 160000, currency: 'USD', isPublic: true },
      minExperienceYears: minExperienceYears || 3,
      requiredSkills: requiredSkills || ['JavaScript', 'React', 'Node.js'],
      preferredSkills: preferredSkills || ['TypeScript', 'Docker'],
      responsibilities: responsibilities || ['Build scalable features', 'Collaborate with team'],
      requirements: requirements || ['3+ years software engineering experience'],
      descriptionHtml: descriptionHtml || `<p>We are seeking a talented <strong>${title}</strong> to join our team.</p>`,
      knockoutQuestions: knockoutQuestions || [],
      status,
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null
    });

    res.status(201).json(job);
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

/**
 * POST /api/v1/jobs/generate-ai-jd
 * Generates an enriched job description using AI
 */
router.post('/generate-ai-jd', authenticate, async (req, res) => {
  try {
    const { prompt, title, department } = req.body;
    const enriched = await AIService.generateJobDescription(prompt, title, department);
    res.json(enriched);
  } catch (err) {
    console.error('AI JD Generator error:', err);
    res.status(500).json({ error: 'Failed to generate AI job description.' });
  }
});

/**
 * PATCH /api/v1/jobs/:id/status
 */
router.patch('/:id/status', authenticate, auditAction('JOB_STATUS_UPDATED', 'Job'), async (req, res) => {
  try {
    const { status } = req.body;
    const result = await Jobs.updateOne(
      { _id: req.params.id, tenantId: req.user.tenantId },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );
    if (!result.matchedCount) return res.status(404).json({ error: 'Job not found.' });
    res.json(result.doc);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job status.' });
  }
});

export default router;
