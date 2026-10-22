import express from 'express';
import { JobBoardService, SUPPORTED_JOB_BOARDS } from '../services/jobBoardService.js';
import { authenticate } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

/**
 * GET /api/v1/job-boards/boards
 * Lists all integrated external job boards and API capabilities
 */
router.get('/boards', authenticate, (req, res) => {
  res.json(SUPPORTED_JOB_BOARDS);
});

/**
 * GET /api/v1/job-boards/search
 * Aggregates & searches live job listings across Naukri, Indeed, Monster, Dice
 */
router.get('/search', authenticate, async (req, res) => {
  try {
    const { query, location, boards, limit } = req.query;
    const boardList = boards ? (Array.isArray(boards) ? boards : boards.split(',')) : ['naukri', 'indeed', 'monster', 'dice'];
    
    const results = await JobBoardService.searchJobsAcrossBoards({
      query,
      location,
      boards: boardList,
      limit: parseInt(limit || 20)
    });

    res.json(results);
  } catch (err) {
    console.error('Job board search error:', err);
    res.status(500).json({ error: 'Failed to search external job boards.' });
  }
});

/**
 * POST /api/v1/job-boards/post
 * 1-Click Cross-Post requirement to Naukri.com, Indeed, Monster, and Dice
 */
router.post('/post', authenticate, auditAction('JOB_BOARD_POSTED', 'JobBoard'), async (req, res) => {
  try {
    const { jobId, title, department, location, experienceYears, skills, salaryRange, description, selectedBoards } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Job requirement title is required.' });
    }

    const result = await JobBoardService.postJobToBoards({
      tenantId: req.user.tenantId,
      jobId,
      title,
      department,
      location,
      experienceYears,
      skills,
      salaryRange,
      description,
      selectedBoards
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Job board post error:', err);
    res.status(500).json({ error: err.message || 'Failed to post requirement to job boards.' });
  }
});

/**
 * GET /api/v1/job-boards/postings
 * Retrieves all syndicated job postings across external boards
 */
router.get('/postings', authenticate, async (req, res) => {
  try {
    const postings = await JobBoardService.getPostings(req.user.tenantId);
    res.json(postings);
  } catch (err) {
    console.error('List job board postings error:', err);
    res.status(500).json({ error: 'Failed to fetch job board postings.' });
  }
});

/**
 * POST /api/v1/job-boards/import
 * 1-Click Import an external job into ATS Requisitions
 */
router.post('/import', authenticate, auditAction('JOB_IMPORTED_FROM_BOARD', 'JobBoard'), async (req, res) => {
  try {
    const { externalJob } = req.body;
    if (!externalJob) {
      return res.status(400).json({ error: 'External job details are required for import.' });
    }

    const imported = await JobBoardService.importJobToATS({
      externalJob,
      tenantId: req.user.tenantId,
      userId: req.user.id
    });

    res.status(201).json(imported);
  } catch (err) {
    console.error('Import job error:', err);
    res.status(500).json({ error: err.message || 'Failed to import job to ATS.' });
  }
});

/**
 * GET /api/v1/job-boards/credentials
 * Retrieves API key configurations & connection statuses for all boards
 */
router.get('/credentials', authenticate, async (req, res) => {
  try {
    const creds = await JobBoardService.getCredentials(req.user.tenantId);
    res.json(creds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job board credentials.' });
  }
});

/**
 * POST /api/v1/job-boards/credentials
 * Updates API keys for external boards
 */
router.post('/credentials', authenticate, auditAction('JOB_BOARD_CREDS_UPDATED', 'JobBoard'), async (req, res) => {
  try {
    const { boards } = req.body;
    if (!boards || typeof boards !== 'object') {
      return res.status(400).json({ error: 'Valid boards configuration object is required.' });
    }

    const updated = await JobBoardService.updateCredentials(req.user.tenantId, boards);
    res.json({
      message: 'Job board API credentials updated and securely saved.',
      boards: updated
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update credentials.' });
  }
});

/**
 * POST /api/v1/job-boards/test-connection
 * Tests API connection for a specific board (Naukri, Indeed, Monster, Dice)
 */
router.post('/test-connection', authenticate, async (req, res) => {
  try {
    const { boardKey } = req.body;
    if (!boardKey) {
      return res.status(400).json({ error: 'Board key (naukri, indeed, monster, dice) is required.' });
    }

    const testResult = await JobBoardService.testConnection(boardKey);
    res.json(testResult);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Connection test failed.' });
  }
});

export default router;
