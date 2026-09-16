import { jobRepo, candidateRepo, applicationRepo, interviewRepo, scorecardRepo, offerRepo } from '../repositories/domainRepositories.js';
import { AIService } from '../services/aiService.js';
import { CalendarService } from '../services/calendarService.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { queueManager } from '../services/queueService.js';

export class JobController {
  static async listJobs(req, res) {
    const jobs = await jobRepo.find({ tenantId: req.user.tenantId }, { sort: { createdAt: -1 } });
    const withCounts = await Promise.all(jobs.map(async (j) => {
      const count = await applicationRepo.count({ jobId: j._id, tenantId: req.user.tenantId });
      return { ...j, applicationCount: count };
    }));
    res.json(withCounts);
  }

  static async getJob(req, res) {
    const job = await jobRepo.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job requisition not found' });
    const count = await applicationRepo.count({ jobId: job._id });
    res.json({ ...job, applicationCount: count });
  }

  static async createJob(req, res) {
    const body = req.body;
    const job = await jobRepo.create({
      tenantId: req.user.tenantId,
      hiringManagerId: req.user.id,
      recruiterId: req.user.id,
      ...body,
      publishedAt: body.status === 'PUBLISHED' ? new Date().toISOString() : null
    });
    res.status(201).json(job);
  }

  static async generateAIJob(req, res) {
    const { prompt, title, department } = req.body;
    const enriched = await AIService.generateJobDescription(prompt, title, department);
    res.json(enriched);
  }
}

export class CandidateController {
  static async listCandidates(req, res) {
    const { search, skill, minExp } = req.query;
    let candidates = await candidateRepo.searchCandidates(search, req.user.tenantId);

    if (skill) {
      candidates = candidates.filter(c => c.skills && c.skills.some(s => s.toLowerCase() === skill.toLowerCase()));
    }
    if (minExp) {
      candidates = candidates.filter(c => (c.totalExperienceYears || 0) >= parseFloat(minExp));
    }
    res.json(candidates);
  }

  static async getCandidateDossier(req, res) {
    const candidate = await candidateRepo.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const applications = await applicationRepo.find({ candidateId: candidate._id });
    const interviews = await interviewRepo.find({ applicationId: { $in: applications.map(a => a._id) } });
    const scorecards = await scorecardRepo.find({ interviewId: { $in: interviews.map(i => i._id) } });

    res.json({
      ...candidate,
      applications,
      interviews,
      scorecards
    });
  }

  static async uploadResume(req, res) {
    const { rawText, filename = 'resume.pdf', jobId } = req.body;
    if (!rawText || rawText.length < 20) {
      return res.status(400).json({ error: 'Valid resume text content is required' });
    }

    const parsed = await AIService.parseResumeText(rawText, filename);
    let candidate = await candidateRepo.findByEmail(parsed.email, req.user.tenantId);
    if (!candidate) {
      candidate = await candidateRepo.create({
        tenantId: req.user.tenantId,
        ...parsed,
        source: 'RECRUITER_UPLOAD',
        tags: ['New Application', 'AI Parsed']
      });
    }

    let application = null;
    let matchScore = null;

    if (jobId) {
      const job = await jobRepo.findById(jobId);
      if (job) {
        matchScore = AIService.calculateCandidateJobMatch(candidate, job);
        application = await applicationRepo.create({
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
  }
}

export class ApplicationController {
  static async getPipeline(req, res) {
    const { jobId } = req.params;
    const applications = await applicationRepo.findByJob(jobId, req.user.tenantId);
    const populated = await Promise.all(applications.map(async (app) => {
      const candidate = await candidateRepo.findById(app.candidateId);
      return {
        ...app,
        candidate: candidate || { firstName: 'Applicant', lastName: 'Candidate', skills: [] }
      };
    }));
    res.json(populated);
  }

  static async moveStage(req, res) {
    const { stageId } = req.body;
    const app = await applicationRepo.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    let status = app.status;
    if (stageId === 'Hired') status = 'HIRED';
    if (stageId === 'Rejected') status = 'REJECTED';

    const result = await applicationRepo.update(app._id, { stageId, status });

    const io = req.app.get('io');
    if (io) {
      io.emit('application:stage_changed', {
        applicationId: app._id,
        jobId: app.jobId,
        fromStage: app.stageId,
        toStage: stageId,
        changedBy: req.user.firstName + ' ' + req.user.lastName
      });
    }

    res.json(result.doc);
  }
}

export class AnalyticsController {
  static async getFunnel(req, res) {
    const metrics = await AnalyticsService.getFunnelMetrics(req.user.tenantId);
    res.json(metrics);
  }
}
