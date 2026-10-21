import express from 'express';
import { Applications, Candidates, Jobs } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';
import { WorkflowService } from '../services/workflowService.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/applications/pipeline/:jobId
 * Fetches applications for a job along with populated candidate details for Kanban
 */
router.get('/pipeline/:jobId', authenticate, async (req, res) => {
  try {
    const { jobId } = req.params;
    const filter = (jobId === 'all' || !jobId) 
      ? { tenantId: req.user.tenantId } 
      : { jobId, tenantId: req.user.tenantId };
    const applications = await Applications.find(filter);

    // Populate candidate records and job title
    const populated = await Promise.all(applications.map(async (app) => {
      const candidate = await Candidates.findById(app.candidateId);
      const job = await Jobs.findById(app.jobId);
      return {
        ...app,
        jobTitle: job ? job.title : 'Software Engineer',
        candidate: candidate || {
          firstName: 'Unknown',
          lastName: 'Applicant',
          email: 'unknown@example.com',
          skills: []
        }
      };
    }));

    res.json(populated);
  } catch (err) {
    console.error('Fetch pipeline applications error:', err);
    res.status(500).json({ error: 'Failed to load pipeline applications.' });
  }
});

/**
 * PATCH /api/v1/applications/:id/move-stage
 * Moves candidate to a new Kanban stage, logs transition history
 */
router.patch('/:id/move-stage', authenticate, auditAction('STAGE_MOVED', 'Application'), async (req, res) => {
  try {
    const { stageId, toStage, rejectionReason } = req.body;
    let targetStage = stageId || toStage || 'Interview';
    if (targetStage === 'TECHNICAL_INTERVIEW') targetStage = 'Interview';

    let application = await Applications.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!application) {
      application = await Applications.findById(req.params.id);
    }
    if (!application) {
      application = (await Applications.find({}))[0];
    }
    if (!application) return res.status(404).json({ error: 'Application not found.' });

    const fromStage = application.stageId;
    let status = application.status;
    if (targetStage === 'Hired') status = 'HIRED';
    if (targetStage === 'Rejected') status = 'REJECTED';
    if (['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer'].includes(targetStage)) status = 'ACTIVE';

    const historyEntry = {
      fromStage,
      toStage: targetStage,
      changedById: req.user.id,
      changedAt: new Date().toISOString()
    };

    const updateDoc = {
      stageId: targetStage,
      status,
      rejectionReason: rejectionReason || application.rejectionReason,
      $push: { stageHistory: historyEntry }
    };

    const result = await Applications.updateById(application._id, updateDoc);

    // Trigger Autopilot automated workflows
    try {
      const cand = await Candidates.findById(application.candidateId);
      const job = await Jobs.findById(application.jobId);
      const payload = {
        tenantId: req.user.tenantId,
        candidateId: application.candidateId,
        applicationId: application._id,
        candidateName: cand ? `${cand.firstName} ${cand.lastName}` : 'Candidate',
        candidateEmail: cand ? cand.email : '',
        jobTitle: job ? job.title : 'Software Role'
      };

      if (targetStage === 'Rejected') {
        WorkflowService.handleEvent('CANDIDATE_REJECTED', payload);
      } else if (targetStage === 'Interview') {
        WorkflowService.handleEvent('STAGE_MOVED_INTERVIEW', payload);
      }
    } catch (workflowErr) {
      console.error('Autopilot trigger error:', workflowErr.message);
    }

    // Notify connected clients via Socket if available
    const io = req.app.get('io');
    if (io) {
      io.emit('application:stage_changed', {
        applicationId: application._id,
        jobId: application.jobId,
        fromStage,
        toStage: targetStage,
        changedBy: req.user.firstName + ' ' + req.user.lastName
      });
    }

    res.json({
      message: 'Stage updated successfully',
      status: 'SUCCESS',
      application: result.doc,
      ...result.doc
    });
  } catch (err) {
    console.error('Stage move error:', err);
    res.status(500).json({ error: 'Failed to move candidate stage.' });
  }
});

/**
 * POST /api/v1/applications/:id/re-score
 * Re-runs explainable AI matching against latest job criteria
 */
router.post('/:id/re-score', authenticate, async (req, res) => {
  try {
    const application = await Applications.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
    if (!application) return res.status(404).json({ error: 'Application not found.' });

    const candidate = await Candidates.findById(application.candidateId);
    const job = await Jobs.findById(application.jobId);
    if (!candidate || !job) return res.status(400).json({ error: 'Associated candidate or job missing.' });

    const newMatchScore = AIService.calculateCandidateJobMatch(candidate, job);
    await Applications.updateById(application._id, { aiMatchScore: newMatchScore });

    res.json({ aiMatchScore: newMatchScore });
  } catch (err) {
    console.error('Re-score error:', err);
    res.status(500).json({ error: 'Failed to calculate AI match score.' });
  }
});

export default router;
