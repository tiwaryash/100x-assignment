# Interview Voice Bot - Backend

FastAPI backend service for the interview voice bot application.

## Features

- RESTful API endpoints for chat functionality
- Integration with Groq LLM API (free tier)
- CORS-enabled for frontend communication
- Environment-based configuration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create `.env` file with your Groq API key:
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

3. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Root endpoint with status
- `GET /health` - Health check endpoint
- `POST /chat` - Chat endpoint for conversation

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

