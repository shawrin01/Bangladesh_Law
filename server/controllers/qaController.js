const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// In-memory history store (replaced by MongoDB if connected)
const inMemoryHistory = [];

// Detect language: Bengali or English
const detectLanguage = (text) => {
  const bengaliPattern = /[\u0980-\u09FF]/;
  return bengaliPattern.test(text) ? 'bn' : 'en';
};

// System prompt for Bangladesh Law domain
const getSystemPrompt = (language) => {
  if (language === 'bn') {
    return `আপনি বাংলাদেশের আইন বিশেষজ্ঞ একজন AI সহকারী। আপনার নাম "আইন সহায়ক"। 
আপনি শুধুমাত্র বাংলাদেশের আইন, বিচার ব্যবস্থা, সংবিধান, আদালত প্রক্রিয়া, নাগরিক অধিকার, ফৌজদারি আইন, পারিবারিক আইন, ভূমি আইন, বাণিজ্যিক আইন এবং সংশ্লিষ্ট বিষয়ে উত্তর দিন।
সর্বদা বাংলায় উত্তর দিন। আপনার উত্তর সুস্পষ্ট, নির্ভরযোগ্য এবং সহজবোধ্য হওয়া উচিত।
গুরুত্বপূর্ণ: আইনি পরামর্শের জন্য সর্বদা একজন যোগ্য আইনজীবীর সাথে পরামর্শ করার পরামর্শ দিন।
যদি প্রশ্নটি বাংলাদেশের আইনের বাইরে হয়, তাহলে বিনয়ের সাথে জানান যে আপনি শুধুমাত্র বাংলাদেশের আইনি বিষয়ে সহায়তা করতে পারেন।`;
  }
  return `You are an AI legal assistant specializing in Bangladesh Law named "Law Assistant".
You answer questions exclusively about Bangladesh's legal system, constitution, court procedures, civil rights, criminal law, family law, land law, commercial law, labor law, and related legal matters.
Always respond in English. Keep answers clear, accurate, and accessible to non-lawyers.
Important: Always recommend consulting a qualified lawyer for specific legal advice.
If a question is outside Bangladesh law domain, politely explain that you specialize only in Bangladesh legal matters.`;
};

// Call Claude API
const callClaudeAPI = async (question, language, conversationHistory) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Anthropic API key not configured');

  const messages = conversationHistory.map(h => ([
    { role: 'user', content: h.question },
    { role: 'assistant', content: h.answer }
  ])).flat();

  messages.push({ role: 'user', content: question });

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: getSystemPrompt(language),
      messages
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    }
  );

  return response.data.content[0].text;
};

// Call Custom Model (Colab/external)
const callCustomModel = async (question, language, conversationHistory) => {
  const customUrl = process.env.CUSTOM_MODEL_URL;
  if (!customUrl) throw new Error('Custom model URL not configured');

  const response = await axios.post(
    `${customUrl}/predict`,
    {
      question,
      language,
      conversation_history: conversationHistory,
      system_prompt: getSystemPrompt(language)
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000 // 60s timeout for model inference
    }
  );

  // Expect { answer: "..." } from your Colab model
  return response.data.answer || response.data.response || response.data.text;
};

// Main QA handler
const askQuestion = async (req, res) => {
  try {
    const { question, sessionId, conversationHistory = [] } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const language = detectLanguage(question.trim());
    const activeModel = process.env.ACTIVE_MODEL || 'claude';
    let answer;
    let modelUsed;

    try {
      if (activeModel === 'custom' && process.env.CUSTOM_MODEL_URL) {
        answer = await callCustomModel(question, language, conversationHistory);
        modelUsed = 'custom';
      } else {
        answer = await callClaudeAPI(question, language, conversationHistory);
        modelUsed = 'claude';
      }
    } catch (modelError) {
      // Fallback to Claude if custom model fails
      if (activeModel === 'custom') {
        console.warn('Custom model failed, falling back to Claude:', modelError.message);
        answer = await callClaudeAPI(question, language, conversationHistory);
        modelUsed = 'claude-fallback';
      } else {
        throw modelError;
      }
    }

    const qaEntry = {
      id: uuidv4(),
      sessionId: sessionId || uuidv4(),
      question: question.trim(),
      answer,
      language,
      modelUsed,
      timestamp: new Date().toISOString()
    };

    // Save to in-memory (MongoDB model can replace this)
    inMemoryHistory.unshift(qaEntry);
    if (inMemoryHistory.length > 500) inMemoryHistory.pop();

    res.json({
      success: true,
      data: qaEntry
    });
  } catch (error) {
    console.error('QA Error:', error.message);
    res.status(500).json({
      error: 'Failed to process question',
      message: error.message
    });
  }
};

const getHistory = (req, res) => {
  const { limit = 20, sessionId } = req.query;
  let history = [...inMemoryHistory];
  if (sessionId) history = history.filter(h => h.sessionId === sessionId);
  res.json({ success: true, data: history.slice(0, parseInt(limit)) });
};

const clearHistory = (req, res) => {
  inMemoryHistory.length = 0;
  res.json({ success: true, message: 'History cleared' });
};

module.exports = { askQuestion, getHistory, clearHistory, detectLanguage };
