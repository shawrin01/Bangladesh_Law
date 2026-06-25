# 🏛️ Bangladesh Law — আইনি সহায়তা কেন্দ্র

A bilingual (English + বাংলা) AI-powered legal Q&A system for Bangladesh law, built with the MERN stack.

---

## ✨ Features

- **Bilingual**: Auto-detects English or Bengali input and replies in the same language
- **Bangladesh Law Domain**: Constitutional, civil, criminal, family, land, labor, and commercial law
- **Dual Model Support**: Claude AI (default) + your custom Colab model (plug-and-play)
- **Multi-turn Chat**: Context-aware conversation history
- **Clean UI**: Professional, eye-soothing design with Bengali font support
- **MongoDB Ready**: Persistent history storage (or falls back to in-memory)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- An Anthropic API key (get one at https://console.anthropic.com)

### 1. Clone & Install
```bash
git clone <your-repo>
cd bangladesh-law

# Install root deps
npm install

# Install server and client deps
npm run install-all
```

### 2. Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Start Development
```bash
# From root directory — starts both server (port 5000) and client (port 3000)
npm run dev
```

Open http://localhost:3000

---

## 🔗 Connecting Your Colab Model

### Method 1: Via the App UI (Easiest)
1. Start your Bangladesh Law app
2. Click the **model status bar** at the top of the chat
3. Enter your ngrok URL in the "Connect Your Colab Model" section
4. Click **Connect & Switch**

### Method 2: Via Environment Variable
```bash
# In server/.env:
CUSTOM_MODEL_URL=https://your-ngrok-url.ngrok.io
ACTIVE_MODEL=custom
```

### Method 3: Via API Call
```bash
curl -X POST http://localhost:5000/api/model/switch \
  -H "Content-Type: application/json" \
  -d '{"model": "custom", "customUrl": "https://your-ngrok-url.ngrok.io"}'
```

---

## 📓 Colab Setup

Open `Bangladesh_Law_Colab_Integration.ipynb` in Google Colab:

1. **Cell 1**: Load your trained model (replace the placeholder function)
2. **Cell 2**: Flask API server is configured automatically  
3. **Cell 3**: Run to start server + ngrok tunnel — copy the public URL
4. **Cell 4**: Test locally before connecting to the app

### Required API Contract
Your Colab model must expose:
```
POST /predict
Content-Type: application/json

Request:
{
  "question": "...",
  "language": "en" | "bn",
  "conversation_history": [{"question": "...", "answer": "..."}, ...]
}

Response:
{
  "answer": "..."
}
```

---

## 📁 Project Structure

```
bangladesh-law/
├── server/                      # Express.js backend
│   ├── index.js                 # Entry point
│   ├── routes/
│   │   ├── qa.js                # Q&A endpoints
│   │   ├── history.js           # Chat history
│   │   └── model.js             # Model switching
│   ├── controllers/
│   │   └── qaController.js      # Claude + custom model logic
│   └── .env.example
│
├── client/                      # React frontend
│   └── src/
│       ├── App.js
│       ├── components/
│       │   ├── Header.js        # Top navigation
│       │   ├── Sidebar.js       # Sample questions
│       │   ├── ChatInterface.js # Main chat UI
│       │   ├── Message.js       # Q&A message bubble
│       │   ├── TypingIndicator.js
│       │   ├── WelcomeScreen.js # Empty state
│       │   └── ModelStatus.js   # Model switcher panel
│       └── styles/
│           └── variables.css    # Design tokens
│
└── Bangladesh_Law_Colab_Integration.ipynb  # Colab notebook
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/qa/ask` | Ask a legal question |
| GET | `/api/history` | Get conversation history |
| DELETE | `/api/history` | Clear history |
| GET | `/api/model/status` | Get active model info |
| POST | `/api/model/switch` | Switch between Claude/custom |
| GET | `/api/health` | Server health check |

---

## 🌐 Deployment

### Server (Render/Railway/Heroku)
```bash
cd server
# Set environment variables in your platform dashboard
npm start
```

### Client (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the build/ folder
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, plain CSS (no framework)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (optional, in-memory fallback)
- **Default AI**: Anthropic Claude (claude-sonnet-4-6)
- **Custom Model**: Your model via Flask + ngrok
- **Fonts**: Noto Sans Bengali (Google Fonts)
