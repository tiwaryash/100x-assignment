# 🤖 AI Voice Interview Bot - 100x AI Agent Team

An intelligent voice-powered interview bot built for the 100x AI Agent Team position. This full-stack application uses speech recognition, AI-powered responses, and a beautiful interactive UI to conduct professional interviews.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://your-deployment-url.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-green)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)

## ✨ Features

### Core Functionality
- 🎤 **Voice Recognition** - Real-time speech-to-text using Web Speech API
- 🔊 **Empathic Text-to-Speech** - Natural, emotionally-aware voice using Hume AI
- 🤖 **AI-Powered Responses** - Strategic answers using Groq's Llama 3.3 70B model
- 💬 **Interactive Chat** - Smooth conversational interface with typing indicators

### Standout Features
- ⚡ **Quick Action Buttons** - Fast access to Resume, Projects, Skills, and Contact
- 🎯 **Smart Suggestions** - Context-aware follow-up questions
- 📄 **Interactive Resume** - Downloadable PDF with preview card
- 🚀 **Project Portfolio** - Detailed showcase of key projects
- 💡 **Command System** - Special commands for specific information
- 🎨 **Beautiful Landing Page** - Animated skill showcase and stats

## 🏗️ Architecture

```
100x-assignment/
├── backend/              # FastAPI Backend
│   ├── main.py          # API endpoints and AI logic
│   ├── requirements.txt # Python dependencies
│   └── .env            # Environment variables
├── frontend/            # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Pages and layouts
│   │   └── components/ # React components
│   ├── public/         # Static assets
│   └── .env.local      # Frontend environment variables
└── docs/               # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- Groq API Key (free at [console.groq.com](https://console.groq.com))
- Hume AI API Key (get at [platform.hume.ai](https://platform.hume.ai))

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/tiwaryash/100x-assignment.git
cd 100x-assignment

# Run setup script (sets up both frontend and backend)
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. Create Python virtual environment
2. Install backend dependencies
3. Install frontend dependencies
4. Prompt for Groq API key
5. Create necessary .env files

### Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

#### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
echo "HUME_API_KEY=your_hume_api_key_here" >> .env
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

</details>

### Running the Application

#### Option 1: Use Helper Scripts

```bash
# Terminal 1 - Start Backend
./run-backend.sh

# Terminal 2 - Start Frontend
./run-frontend.sh
```

#### Option 2: Manual Start

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

1. **Landing Page** - See skills, stats, and introduction
2. **Start Interview** - Click "Start Voice Interview"
3. **Voice Interaction** - Click microphone button to speak or type your question
4. **Quick Actions** - Use quick buttons for common queries:
   - 📄 Resume
   - 🚀 Projects
   - 💡 Skills
   - 📧 Contact
5. **Smart Suggestions** - Click suggested follow-up questions
6. **Commands** - Type special commands:
   - `/resume` - View and download resume
   - `/projects` - See project portfolio
   - `/contact` - Get contact information

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Groq API** - LLM inference (Llama 3.3 70B)
- **Python 3.13** - Latest Python features
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Web Speech API** - Browser-native speech recognition
- **Axios** - HTTP client

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Git** - Version control

## 📊 Key Interview Answers

The bot is programmed with strategic, STAR-method answers for:

1. **Life Story** - Passion for AI, from education to building RAG systems
2. **Superpower** - Translating complex business needs into practical AI solutions
3. **Growth Areas** - Agentic workflows, system architecture, product acumen
4. **Misconceptions** - Focused but highly collaborative
5. **Pushing Boundaries** - Building projects outside comfort zone (Rust, RAG systems)

## 🎨 Design Philosophy

- **Navy Blue Color Palette** - Professional and trustworthy
- **Icon-Based UI** - No emojis, clean SVG icons
- **Single-Page Design** - No scrolling required on main views
- **Smooth Animations** - Fade-ins, transitions, and hover effects
- **Responsive Layout** - Works on all devices

## 📝 Environment Variables

### Backend (.env)
```bash
GROQ_API_KEY=your_groq_api_key_here
HUME_API_KEY=your_hume_api_key_here
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update `NEXT_PUBLIC_API_URL` to your deployed backend URL.

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel and Railway.

### Quick Deploy

**Frontend (Vercel):**
```bash
cd frontend
vercel --prod
```

**Backend (Railway):**
1. Push to GitHub
2. Connect repository to Railway
3. Add environment variables:
   - `GROQ_API_KEY`
   - `HUME_API_KEY`
4. Railway auto-deploys

## 🧪 Testing

```bash
# Backend API
curl http://localhost:8000/health

# Full chat test
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is your superpower?"}]}'
```

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [STANDOUT_FEATURES.md](./STANDOUT_FEATURES.md) - Feature showcase
- [backend/README.md](./backend/README.md) - Backend documentation
- [frontend/README.md](./frontend/README.md) - Frontend documentation

## 🎯 Project Highlights

### Technical Achievements
- **2+ Years** in AI Engineering
- **12+ Production Systems** built and deployed
- **15+ Technologies** mastered

### Real Impact
- 65% faster contract review times
- 92% accuracy in AI models
- 99.9% uptime for production systems
- 100+ tenants served on SaaS platform

## 🤝 About

Built by **Yash Tiwary** for the 100x AI Agent Team position.

- 📧 Email: yash.r.tiwary@gmail.com
- 💼 LinkedIn: [linkedin.com/in/yash-tiwary](https://linkedin.com/in/yash-tiwary)
- 🐙 GitHub: [github.com/tiwaryash](https://github.com/tiwaryash)
- 🌐 Website: [yashtiwary.com](https://yashtiwary.com)

## 📄 License

This project is part of the 100x interview process. All rights reserved.

---

**Note**: This is a demonstration project showcasing full-stack development, AI integration, and modern web technologies. The bot responses are based on real experience and achievements.
