# Configuration Guide

This document describes all configuration options for the Interview Voice Bot.

## Backend Configuration

### Environment Variables

Create `backend/.env` file:

```bash
# Required: Groq API Key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx

# Optional: Server Configuration
HOST=0.0.0.0
PORT=8000
```

### Getting Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

**Free Tier Limits:**
- 14,400 requests per day
- 30 requests per minute
- Sufficient for assessment and demos

### CORS Configuration

In `backend/main.py`, update allowed origins for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-production-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### LLM Model Configuration

Current model: `llama-3.1-70b-versatile`

To change model, edit `backend/main.py` line 57:

```python
completion = groq_client.chat.completions.create(
    model="llama-3.1-70b-versatile",  # Change this
    messages=messages,
    temperature=0.7,  # Adjust creativity (0.0-1.0)
    max_tokens=500,   # Adjust response length
)
```

Available Groq models:
- `llama-3.1-70b-versatile` (recommended, balanced)
- `llama-3.1-8b-instant` (faster, less capable)
- `mixtral-8x7b-32768` (alternative option)
- `gemma-7b-it` (lightweight)

### System Prompt Customization

Edit the `SYSTEM_PROMPT` variable in `backend/main.py` (starting line 27) to customize the bot's personality and information.

## Frontend Configuration

### Environment Variables

Create `frontend/.env.local` file (optional):

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production:
# NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

If not set, defaults to `http://localhost:8000` (hardcoded in `VoiceBot.tsx`).

### API Endpoint Configuration

To change the backend URL, edit `frontend/src/components/VoiceBot.tsx` line 64:

```typescript
const response = await axios.post('http://localhost:8000/chat', {
  messages: [...messages, userMessage],
})
```

For environment variable approach:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const response = await axios.post(`${API_URL}/chat`, {
  messages: [...messages, userMessage],
})
```

### Speech Recognition Configuration

In `frontend/src/components/VoiceBot.tsx`, speech recognition settings (lines 30-33):

```typescript
recognitionRef.current.continuous = false  // Set true for continuous listening
recognitionRef.current.interimResults = true  // Show real-time transcription
recognitionRef.current.lang = 'en-US'  // Change language
```

Supported languages:
- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Spanish
- `fr-FR` - French
- `de-DE` - German
- And many more...

### Speech Synthesis Configuration

In `frontend/src/components/VoiceBot.tsx`, text-to-speech settings (lines 110-112):

```typescript
utterance.lang = 'en-US'  // Voice language
utterance.rate = 1.0      // Speed: 0.1 to 10 (1.0 is normal)
utterance.pitch = 1.0     // Pitch: 0 to 2 (1.0 is normal)
```

To select a specific voice:

```typescript
const voices = window.speechSynthesis.getVoices()
utterance.voice = voices.find(voice => voice.name === 'Google US English') || voices[0]
```

### UI Customization

#### Colors

Edit `frontend/tailwind.config.js` to change the color scheme:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Main color
    600: '#0284c7',  // Hover color
    // Add more shades as needed
  },
}
```

#### Layout

Edit `frontend/src/components/VoiceBot.tsx`:
- Line 145: Chat window height (`h-96` = 24rem)
- Line 179: Message max width (`max-w-xs lg:max-w-md`)
- Line 232: Button sizes (`p-6` for padding)

## Development Configuration

### Hot Reload Settings

Backend (uvicorn):
```bash
uvicorn main:app --reload --reload-delay 2
```

Frontend (Next.js):
```bash
npm run dev -- --turbo  # Enable Turbo mode
```

### Debug Mode

Enable verbose logging in backend by adding to `main.py`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Enable React strict mode in `frontend/next.config.js`:
```javascript
const nextConfig = {
  reactStrictMode: true,  // Already enabled
}
```

## Production Configuration

### Backend

1. Disable auto-reload:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

2. Use production-grade server:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

Add to `requirements.txt`:
```
gunicorn==21.2.0
```

3. Enable logging:
```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Frontend

1. Build for production:
```bash
npm run build
```

2. Optimize images and assets
3. Enable compression in Next.js config
4. Set up CDN for static assets

### Security Settings

#### Backend
- Use HTTPS in production
- Set secure CORS origins
- Implement rate limiting
- Add API authentication if needed
- Store API keys in secure environment variables

#### Frontend
- Enable Content Security Policy
- Use environment variables for configuration
- Never commit API keys to version control
- Implement proper error handling

## Performance Tuning

### Backend Optimization

1. Enable caching:
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_cached_response(message: str):
    # Cache frequent responses
    pass
```

2. Implement connection pooling
3. Use async operations for I/O

### Frontend Optimization

1. Lazy load components
2. Implement request debouncing
3. Cache API responses
4. Optimize re-renders

## Monitoring

### Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

### Frontend Performance

Use Chrome DevTools:
- Network tab: Check API response times
- Performance tab: Monitor render times
- Console: Watch for errors

## Troubleshooting Configuration Issues

### Groq API Key Invalid
- Verify key format (starts with `gsk_`)
- Check key hasn't expired
- Ensure .env file is in correct location
- Restart backend after changing .env

### CORS Errors
- Add frontend URL to allowed origins
- Check protocol (http vs https)
- Verify port numbers match

### Speech API Not Working
- Check browser compatibility
- Ensure HTTPS in production
- Verify microphone permissions
- Test in incognito mode

## Example Configurations

### Local Development
```bash
# backend/.env
GROQ_API_KEY=gsk_your_key_here
```

### Production
```bash
# Backend environment variables
GROQ_API_KEY=gsk_your_key_here
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production

# Frontend environment variables
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Advanced Configuration

### Custom Error Messages

Edit `frontend/src/components/VoiceBot.tsx` lines 77-78:

```typescript
setError('Failed to get response from server. Please ensure the backend is running.')
```

### Request Timeout

Add timeout to axios requests:

```typescript
const response = await axios.post('http://localhost:8000/chat', {
  messages: [...messages, userMessage],
}, {
  timeout: 30000  // 30 seconds
})
```

### Retry Logic

Implement retry mechanism for failed requests:

```typescript
const maxRetries = 3
let attempt = 0

while (attempt < maxRetries) {
  try {
    const response = await axios.post(...)
    break
  } catch (error) {
    attempt++
    if (attempt === maxRetries) throw error
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
```

## Configuration Checklist

Before deployment:
- [ ] Groq API key set and tested
- [ ] CORS origins updated for production
- [ ] Frontend API URL points to production backend
- [ ] HTTPS enabled (required for Web Speech API)
- [ ] Error messages customized
- [ ] System prompt personalized
- [ ] Logging configured
- [ ] Performance optimizations applied
- [ ] Security measures implemented
- [ ] Browser compatibility verified

