import express from 'express';
import { Scorecards, Interviews, Applications } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/scorecards/interview/:interviewId
 */
router.get('/interview/:interviewId', authenticate, async (req, res) => {
  try {
    const scorecards = await Scorecards.find({
      interviewId: req.params.interviewId,
      tenantId: req.user.tenantId
    });
    res.json(scorecards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scorecards.' });
  }
});

/**
 * POST /api/v1/scorecards
 * Submits an interview scorecard
 */
router.post('/', authenticate, auditAction('SCORECARD_SUBMITTED', 'Scorecard'), async (req, res) => {
  try {
    const { interviewId, criteriaRatings, overallRecommendation, privateNotes } = req.body;
    if (!interviewId || !overallRecommendation) {
      return res.status(400).json({ error: 'Interview ID and Recommendation are required.' });
    }

    const interview = await Interviews.findById(interviewId);
    if (!interview) return res.status(404).json({ error: 'Interview not found.' });

    // Check if interviewer already submitted
    let existing = await Scorecards.findOne({
      interviewId,
      interviewerId: req.user.id
    });

    if (existing) {
      const updated = await Scorecards.updateById(existing._id, {
        criteriaRatings,
        overallRecommendation,
        privateNotes,
        submittedAt: new Date().toISOString()
      });
      return res.json(updated.doc);
    }

    const scorecard = await Scorecards.insertOne({
      tenantId: req.user.tenantId,
      interviewId,
      interviewerId: req.user.id,
      interviewerName: `${req.user.firstName} ${req.user.lastName}`,
      criteriaRatings: criteriaRatings || [
        { name: 'Technical Depth', score: 4, feedback: 'Strong foundational understanding' },
        { name: 'System Design', score: 4, feedback: 'Good distributed systems concepts' },
        { name: 'Communication', score: 5, feedback: 'Clear, concise and articulate' }
      ],
      overallRecommendation,
      privateNotes: privateNotes || '',
      isSubmitted: true,
      submittedAt: new Date().toISOString()
    });

    // Mark interview as completed
    await Interviews.updateById(interviewId, { status: 'COMPLETED' });

    res.status(201).json(scorecard);
  } catch (err) {
    console.error('Submit scorecard error:', err);
    res.status(500).json({ error: 'Failed to submit scorecard.' });
  }
});

export default router;
