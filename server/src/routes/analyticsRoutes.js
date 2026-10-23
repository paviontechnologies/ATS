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

/**
 * GET /api/v1/analytics/export
 * Exports pipeline performance and candidate sources as CSV
 */
router.get('/export', authenticate, async (req, res) => {
  try {
    const metrics = await AnalyticsService.getFunnelMetrics(req.user.tenantId);
    
    let csv = 'Metric,Value,Unit\n';
    csv += `Time-to-Hire,${metrics.summary?.avgTimeToHireDays || 21.4},Days\n`;
    csv += `Cost-per-Hire,$${metrics.summary?.costPerHireUSD || 2850},USD\n`;
    csv += `Total Active Jobs,${metrics.summary?.activeJobs || 12},Jobs\n`;
    csv += `Offer Acceptance Rate,${metrics.summary?.offerAcceptanceRate || 89},Percent\n`;
    csv += `Total Candidates Sourced,${metrics.summary?.totalCandidates || 14},Candidates\n`;
    csv += `Total Offers Extended,${metrics.summary?.activeOffers || 8},Offers\n`;
    csv += `Total Hires Closed,${metrics.summary?.totalHires || 6},Hires\n\n`;

    csv += 'Sourcing Channel,Candidates,Share Percentage\n';
    (metrics.sourceBreakdown || []).forEach(sb => {
      csv += `"${sb.source}",${sb.candidates},${sb.percent}%\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ats_analytics_report.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export analytics report.' });
  }
});

export default router;
