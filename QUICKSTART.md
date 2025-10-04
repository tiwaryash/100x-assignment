# Quick Start Guide

Get the Interview Voice Bot running in 5 minutes.

## Prerequisites

- Python 3.8+
- Node.js 18+
- Chrome or Edge browser
- Groq API key (free at [console.groq.com](https://console.groq.com))

## Automatic Setup

Run the setup script:

```bash
./setup.sh
```

This will:
- Create Python virtual environment
- Install all dependencies for backend and frontend
- Generate environment file templates

## Manual Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
GROQ_API_KEY=your_actual_api_key_here
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Option 1: Use Helper Scripts

Terminal 1 (Backend):
```bash
./run-backend.sh
```

Terminal 2 (Frontend):
```bash
./run-frontend.sh
```

### Option 2: Manual Start

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Access the Application

Open Chrome or Edge and navigate to:
```
http://localhost:3000
```

## Usage

1. Click the blue microphone button
2. Allow microphone permissions when prompted
3. Speak your interview question
4. Listen to the AI-powered response
5. Continue the conversation naturally

## Sample Questions

- What should I know about your background?
- What is your greatest strength?
- What areas would you like to improve in?
- Tell me about a time you faced a challenge
- Why are you interested in this position?

## Troubleshooting

### Backend won't start
- Check Python version: `python3 --version`
- Verify virtual environment is activated
- Ensure Groq API key is set in `.env`

### Frontend won't start
- Check Node version: `node --version`
- Delete `node_modules` and run `npm install` again
- Clear Next.js cache: `rm -rf .next`

### Speech recognition not working
- Use Chrome or Edge browser
- Check microphone permissions in browser settings
- Ensure you're on `localhost` or `https://`

### Cannot connect to backend
- Verify backend is running on port 8000
- Check firewall settings
- Look for errors in backend terminal

## API Documentation

Once backend is running, visit:
- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Next Steps

- Read the [full README](README.md) for detailed information
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize the system prompt in `backend/main.py`
- Adjust UI styling in `frontend/src/components/VoiceBot.tsx`

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in terminal
3. Consult the full documentation in README.md

