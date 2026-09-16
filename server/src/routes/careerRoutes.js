import express from 'express';
import { Jobs, Candidates, Applications, Companies } from '../db/database.js';
import { AIService } from '../services/aiService.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/careers/jobs
 * Public endpoint for candidate career portal
 */
router.get('/jobs', async (req, res) => {
  try {
    const tenant = await Companies.findOne({});
    const tenantId = req.headers['x-tenant-id'] || (tenant ? tenant._id : null);

    const jobs = await Jobs.find(
      { status: 'PUBLISHED', ...(tenantId ? { tenantId } : {}) },
      { sort: { publishedAt: -1 } }
    );

    res.json({
      company: tenant ? { name: tenant.name, branding: tenant.branding } : null,
      jobs: jobs.map(j => ({
        _id: j._id,
        title: j.title,
        department: j.departmentId,
        location: j.locationId,
        workplaceType: j.workplaceType,
        employmentType: j.employmentType,
        salaryRange: j.salaryRange,
        publishedAt: j.publishedAt
      }))
    });
  } catch (err) {
    console.error('Public careers jobs error:', err);
    res.status(500).json({ error: 'Failed to retrieve career postings.' });
  }
});

/**
 * GET /api/v1/careers/jobs/:id
 */
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Jobs.findOne({ _id: req.params.id, status: 'PUBLISHED' });
    if (!job) return res.status(404).json({ error: 'Job not found or no longer active.' });

    const company = await Companies.findById(job.tenantId);

    res.json({
      job,
      company: company ? { name: company.name, branding: company.branding } : null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job posting.' });
  }
});

/**
 * POST /api/v1/careers/apply/:jobId
 * Public application submission with Knockout Screening & AI Parsing
 */
router.post('/apply/:jobId', auditAction('PUBLIC_APPLICATION_SUBMITTED', 'Application'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      resumeText,
      linkedinUrl,
      githubUrl,
      knockoutAnswers = []
    } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ error: 'First name, last name, and email are required.' });
    }

    const job = await Jobs.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job requisition not found.' });

    // 1. Evaluate Knockout Screening Questions
    let disqualified = false;
    const evaluatedAnswers = (job.knockoutQuestions || []).map(q => {
      const candidateAns = knockoutAnswers.find(a => a.questionText === q.questionText);
      const answerVal = candidateAns ? candidateAns.answer : null;
      let passed = true;

      if (q.disqualifyIfWrong && q.correctAnswer !== undefined && candidateAns && answerVal !== null && answerVal !== undefined) {
        if (typeof q.correctAnswer === 'boolean') {
          passed = Boolean(answerVal) === Boolean(q.correctAnswer);
        } else {
          passed = String(answerVal).toLowerCase() === String(q.correctAnswer).toLowerCase();
        }

        if (!passed && q.disqualifyIfWrong) {
          disqualified = true;
        }
      }

      return {
        questionText: q.questionText,
        answer: answerVal,
        passed
      };
    });

    // 2. Parse or extract candidate profile
    let parsedData = {};
    if (resumeText && resumeText.length > 30) {
      parsedData = await AIService.parseResumeText(resumeText);
    }

    // 3. Find or create candidate
    let candidate = await Candidates.findOne({ email: email.toLowerCase().trim(), tenantId: job.tenantId });
    if (!candidate) {
      candidate = await Candidates.insertOne({
        tenantId: job.tenantId,
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        phone: phone || parsedData.phone || '',
        linkedinUrl: linkedinUrl || parsedData.linkedinUrl || '',
        githubUrl: githubUrl || parsedData.githubUrl || '',
        skills: parsedData.skills || ['General Software Engineering'],
        totalExperienceYears: parsedData.totalExperienceYears || 3.0,
        education: parsedData.education || [],
        workHistory: parsedData.workHistory || [],
        summary: parsedData.summary || `Candidate applying for ${job.title}`,
        source: 'CAREER_PAGE',
        tags: ['Inbound Applicant']
      });
    }

    // 4. Calculate AI Match Score
    const matchScore = AIService.calculateCandidateJobMatch(candidate, job);

    // 5. Create Application
    const initialStage = disqualified ? 'Rejected' : 'Applied';
    const initialStatus = disqualified ? 'REJECTED' : 'ACTIVE';

    const application = await Applications.insertOne({
      tenantId: job.tenantId,
      jobId: job._id,
      candidateId: candidate._id,
      stageId: initialStage,
      status: initialStatus,
      rejectionReason: disqualified ? 'Failed mandatory knockout pre-qualification screening' : null,
      knockoutAnswers: evaluatedAnswers,
      aiMatchScore: matchScore,
      stageHistory: [
        { fromStage: 'None', toStage: initialStage, changedAt: new Date().toISOString() }
      ]
    });

    // Notify via WebSockets if io instance is present
    const io = req.app.get('io');
    if (io) {
      io.emit('application:new', {
        jobTitle: job.title,
        candidateName: `${firstName} ${lastName}`,
        matchScore: matchScore.overallScore
      });
    }

    res.status(201).json({
      message: 'Application received successfully!',
      applicationId: application._id,
      status: initialStatus
    });
  } catch (err) {
    console.error('Application submit error:', err);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

export default router;
