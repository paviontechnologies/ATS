import express from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/v1/analytics/funnel
 */
router.get('/funnel', authenticate, async (req, res) => {
  try {
    const metrics = await AnalyticsService.getFunnelMetrics(req.user.tenantId);
    res.json(metrics);
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to compute recruitment analytics.' });
  }
});

export default router;
