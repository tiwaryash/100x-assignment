# Deployment Guide

This guide covers deploying the Interview Voice Bot to production.

## Frontend Deployment (Vercel)

Vercel is the recommended platform for deploying Next.js applications.

### Steps

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy to Vercel:
```bash
vercel --prod
```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: interview-voice-bot
   - Directory: ./
   - Override settings: No

5. Update the API URL in `src/components/VoiceBot.tsx` to point to your backend URL

### Environment Configuration

After deployment, update the backend URL:
- Go to Vercel dashboard
- Select your project
- Go to Settings > Environment Variables
- Add `NEXT_PUBLIC_API_URL` with your backend URL

## Backend Deployment (Railway)

Railway offers easy deployment for Python applications with environment variable management.

### Steps

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Initialize Railway:
```bash
railway login
railway init
```

4. Deploy:
```bash
railway up
```

5. Set environment variables:
```bash
railway variables set GROQ_API_KEY=your_api_key_here
```

6. Get your deployment URL:
```bash
railway domain
```

### Alternative: Render

1. Create a `render.yaml` in the backend directory:
```yaml
services:
  - type: web
    name: interview-bot-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GROQ_API_KEY
        sync: false
```

2. Connect your GitHub repository to Render
3. Add environment variables in Render dashboard
4. Deploy

## Docker Deployment

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
    
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
```

## Production Checklist

### Backend
- [ ] Set GROQ_API_KEY environment variable
- [ ] Update CORS origins to include production domain
- [ ] Enable HTTPS
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up error tracking (e.g., Sentry)

### Frontend
- [ ] Update API URL to production backend
- [ ] Enable production optimizations
- [ ] Configure CSP headers
- [ ] Set up analytics (optional)
- [ ] Test on target browsers
- [ ] Verify HTTPS is enabled

## Monitoring

### Backend Health Check
```bash
curl https://your-api-domain.com/health
```

Expected response:
```json
{
  "status": "healthy"
}
```

### Frontend Verification
- Test microphone permissions
- Verify speech recognition works
- Test voice synthesis
- Check API connectivity

## Troubleshooting

### CORS Issues
Update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Speech API Not Working
- Ensure site is served over HTTPS
- Check browser compatibility
- Verify microphone permissions

### API Connection Timeout
- Check backend is running and accessible
- Verify firewall rules
- Check environment variables are set correctly

## Cost Estimation

### Groq API
- Free tier: 14,400 requests per day
- Cost per additional request: Check current pricing

### Hosting
- Vercel (Frontend): Free tier available
- Railway (Backend): $5/month starter plan
- Alternative free options: Render, Fly.io

## Scaling Considerations

For production at scale:
1. Implement request caching
2. Add rate limiting per user
3. Use CDN for frontend assets
4. Implement session management
5. Add database for conversation history
6. Set up horizontal scaling for backend

