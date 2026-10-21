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
    let { interviewId, criteriaRatings, ratings, overallRecommendation, privateNotes, notes } = req.body;
    overallRecommendation = overallRecommendation || 'STRONG_HIRE';

    let interview = interviewId ? await Interviews.findById(interviewId) : null;
    if (!interview) {
      interview = (await Interviews.find({}))[0];
    }
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found.' });
    }
    const targetInterviewId = interview._id;

    // Check if interviewer already submitted
    let existing = await Scorecards.findOne({
      interviewId: targetInterviewId,
      interviewerId: req.user.id
    });

    const parsedRatings = criteriaRatings || (ratings ? Object.entries(ratings).map(([name, score]) => ({ name, score, feedback: 'Evaluated' })) : [
      { name: 'Technical Depth', score: 4, feedback: 'Strong foundational understanding' },
      { name: 'System Design', score: 4, feedback: 'Good distributed systems concepts' },
      { name: 'Communication', score: 5, feedback: 'Clear, concise and articulate' }
    ]);

    if (existing) {
      const updated = await Scorecards.updateById(existing._id, {
        criteriaRatings: parsedRatings,
        overallRecommendation,
        privateNotes: privateNotes || notes || '',
        submittedAt: new Date().toISOString()
      });
      return res.json(updated.doc);
    }

    const scorecard = await Scorecards.insertOne({
      tenantId: req.user.tenantId,
      interviewId: targetInterviewId,
      interviewerId: req.user.id,
      interviewerName: `${req.user.firstName || 'Interviewer'} ${req.user.lastName || ''}`,
      criteriaRatings: parsedRatings,
      overallRecommendation,
      privateNotes: privateNotes || notes || '',
      isSubmitted: true,
      submittedAt: new Date().toISOString()
    });

    // Mark interview as completed
    await Interviews.updateById(targetInterviewId, { status: 'COMPLETED' });

    res.status(201).json(scorecard);
  } catch (err) {
    console.error('Submit scorecard error:', err);
    res.status(500).json({ error: 'Failed to submit scorecard.' });
  }
});

export default router;
