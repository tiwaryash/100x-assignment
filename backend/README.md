# Interview Voice Bot - Backend

FastAPI backend service for the interview voice bot application.

## Features

- RESTful API endpoints for chat functionality
- Integration with Groq LLM API for natural language responses
- Integration with Hume AI API for empathic, natural text-to-speech
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
HUME_API_KEY=your_hume_api_key_here
HUME_API_KEY_BACKUP=your_backup_hume_api_key_here  # Optional: fallback when primary hits 10k character limit
```

**Getting API Keys:**
- Groq API: Sign up at https://console.groq.com/ (free tier available)
- Hume AI API: Sign up at https://platform.hume.ai/ (free tier: 10,000 characters)
- **Note**: Hume AI free tier has a 10,000 character limit. Configure `HUME_API_KEY_BACKUP` for automatic failover

3. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint with status
- `GET /health` - Health check endpoint
- `POST /chat` - Chat endpoint for conversation with AI
- `POST /tts` - Text-to-speech endpoint using Hume AI (returns audio/mpeg)

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

