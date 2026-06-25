const express = require('express');
const router = express.Router();

// Get current model status
router.get('/status', (req, res) => {
  res.json({
    activeModel: process.env.ACTIVE_MODEL || 'claude',
    customModelUrl: process.env.CUSTOM_MODEL_URL || null,
    customModelConfigured: !!process.env.CUSTOM_MODEL_URL,
    anthropicConfigured: !!process.env.ANTHROPIC_API_KEY
  });
});

// Switch active model at runtime (useful for testing)
router.post('/switch', (req, res) => {
  const { model, customUrl } = req.body;

  if (!['claude', 'custom'].includes(model)) {
    return res.status(400).json({ error: 'Model must be "claude" or "custom"' });
  }

  if (model === 'custom' && customUrl) {
    process.env.CUSTOM_MODEL_URL = customUrl;
  }

  process.env.ACTIVE_MODEL = model;

  res.json({
    success: true,
    message: `Switched to ${model} model`,
    activeModel: model,
    customModelUrl: process.env.CUSTOM_MODEL_URL || null
  });
});

module.exports = router;
