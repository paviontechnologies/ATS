import express from 'express';
import { AIService } from '../services/aiService.js';
import { authenticate } from '../middleware/auth.js';
import { Candidates, Jobs } from '../db/database.js';

const router = express.Router();

/**
 * POST /api/v1/ai/assistant-chat
 * Recruiter conversational copilot query endpoint
 */
router.post('/assistant-chat', authenticate, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const response = await AIService.queryAssistant(prompt, req.user.tenantId);
    res.json(response);
  } catch (err) {
    console.error('AI assistant chat error:', err);
    res.status(500).json({ error: 'Failed to process AI assistant request.' });
  }
});

/**
 * POST /api/v1/ai/generate-questions
 */
router.post('/generate-questions', authenticate, async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    const candidate = await Candidates.findById(candidateId);
    const job = await Jobs.findById(jobId);

    if (!candidate || !job) {
      return res.status(400).json({ error: 'Candidate and Job are required.' });
    }

    const questions = AIService.generateInterviewQuestions(candidate, job);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate interview questions.' });
  }
});

export default router;
