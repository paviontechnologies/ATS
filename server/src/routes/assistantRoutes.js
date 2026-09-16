import express from 'express';
import { runAssistant } from '../services/aiAssistantService.js';
import { executeAtsTool } from '../services/assistantTools.js';

const router = express.Router();

/**
 * Helper to build context from request or fallback
 */
function buildContext(req) {
  const user = req.user || {};
  return {
    orgId: user.tenantId || 'ten_techcorp_global',
    userId: user.id || 'usr_recruiter_01',
    role: user.role || 'RECRUITER',
    userName: user.firstName ? `${user.firstName} ${user.lastName}` : 'Recruiter',
    io: req.app.get('io')
  };
}

/**
 * POST /api/v1/assistant/chat
 * Multi-turn AI assistant chat with tool execution and proactive guidance
 */
router.post('/chat', async (req, res) => {
  try {
    let messages = req.body.messages;
    if (!messages && req.body.message) {
      const hist = Array.isArray(req.body.history) ? req.body.history : [];
      messages = [...hist, { role: 'user', content: req.body.message }];
    }
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array or message string is required.' });
    }

    const ctx = buildContext(req);
    const result = await runAssistant(messages, ctx, ctx.userName);

    const actions = (result.actions || []).map(a => ({
      toolName: a.tool || a.toolName,
      executed: a.ok ?? true,
      summary: a.summary || '',
      link: a.link || null,
      type: a.type || 'action'
    }));

    res.json({
      success: true,
      reply: result.reply,
      message: result.reply,
      actions
    });
  } catch (err) {
    console.error('AI Assistant chat error:', err);
    res.status(500).json({
      success: false,
      reply: 'An error occurred while processing your request. Please try again.',
      message: 'An error occurred while processing your request. Please try again.',
      actions: [],
      error: err.message
    });
  }
});

/**
 * GET /api/v1/assistant/recommendations
 * Real-time proactive recommendations: "What to do" & "What NOT to do"
 */
router.get('/recommendations', async (req, res) => {
  try {
    const ctx = buildContext(req);
    const result = await executeAtsTool('get_proactive_guidance', {}, ctx);
    res.json(result.data);
  } catch (err) {
    console.error('Fetch recommendations error:', err);
    res.status(500).json({ error: 'Failed to compute recommendations.' });
  }
});

/**
 * POST /api/v1/assistant/execute-tool
 * Direct tool execution endpoint
 */
router.post('/execute-tool', async (req, res) => {
  try {
    const { toolName, input } = req.body;
    if (!toolName) {
      return res.status(400).json({ error: 'toolName is required.' });
    }

    const ctx = buildContext(req);
    const result = await executeAtsTool(toolName, input || {}, ctx);
    res.json(result);
  } catch (err) {
    console.error('Direct tool execution error:', err);
    res.status(500).json({ ok: false, summary: err.message });
  }
});

export default router;
