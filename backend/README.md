# Interview Voice Bot - Backend

FastAPI backend service for the interview voice bot application.

## Features

- RESTful API endpoints for chat functionality
- Integration with Groq LLM API for natural language responses
- Integration with ElevenLabs API for high-quality text-to-speech
- CORS-enabled for frontend communication
- Environment-based configuration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file with your API keys:
```bash
# Create .env file with:
GROQ_API_KEY=your_groq_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

**Getting API Keys:**
- Groq API: Sign up at https://console.groq.com/ (free tier available)
- ElevenLabs API: Sign up at https://elevenlabs.io/ (free tier includes 10,000 characters/month)

3. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint with status
- `GET /health` - Health check endpoint
- `POST /chat` - Chat endpoint for conversation with AI
- `POST /tts` - Text-to-speech endpoint using ElevenLabs (returns audio/mpeg)

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

