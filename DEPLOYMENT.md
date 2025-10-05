# 🚀 Deployment Guide

This guide covers deploying the Interview Voice Bot to production using Vercel (frontend) and Railway (backend).

## Prerequisites

- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Railway account (free at [railway.app](https://railway.app))
- Groq API key ([console.groq.com](https://console.groq.com))

## 📦 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Groq API key ready
- [ ] All environment variables documented
- [ ] Local testing completed
- [ ] No sensitive data in code

## 🎨 Frontend Deployment (Vercel)

### Option 1: Vercel Dashboard (Recommended)

1. **Connect GitHub Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Choose the `frontend` directory as root

2. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_API_URL` = (leave empty for now)
   - Click "Deploy"

4. **Update Backend URL**
   - After backend is deployed, return to Vercel
   - Go to Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` with your Railway backend URL
   - Example: `https://your-app.railway.app`
   - Redeploy: Deployments → Three dots → Redeploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# For production
vercel --prod
```

Follow prompts and add environment variables when asked.

### Vercel Configuration

The `frontend/vercel.json` file is already configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["bom1"]
}
```

## 🐍 Backend Deployment (Railway)

### Step-by-Step Deployment

1. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Service**
   - Railway will auto-detect Python
   - Set **Root Directory**: `backend`
   - Railway automatically uses `requirements.txt`

3. **Add Environment Variables**
   - Click your service
   - Go to "Variables" tab
   - Add:
     ```
     GROQ_API_KEY=your_actual_groq_api_key_here
     HUME_API_KEY=your_actual_hume_api_key_here
     PORT=8000
     ```

4. **Configure Start Command**
   - Go to "Settings" tab
   - Under "Start Command", add:
     ```
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

5. **Deploy**
   - Railway will auto-deploy
   - Wait for deployment to complete
   - Copy your public URL (e.g., `your-app.railway.app`)

6. **Enable Public Networking**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the public URL

### Railway Configuration

The `backend/railway.json` file is already configured:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Alternative: Render

If you prefer Render over Railway:

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   ```
   Name: interview-bot-backend
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Add environment variables:
   - `GROQ_API_KEY`
   - `HUME_API_KEY`
6. Deploy

## 🔗 Connect Frontend and Backend

### Update CORS in Backend

If you get CORS errors, update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push changes and Railway will auto-redeploy.

### Update Frontend Environment Variable

1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Edit `NEXT_PUBLIC_API_URL`:
   ```
   https://your-backend.railway.app
   ```
5. Redeploy from Deployments tab

## 🧪 Testing Deployment

### Test Backend

```bash
# Health check
curl https://your-backend.railway.app/health

# Test chat endpoint
curl -X POST https://your-backend.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### Test Frontend

1. Open your Vercel URL
2. Click "Start Voice Interview"
3. Try voice input or text input
4. Test quick action buttons
5. Check browser console for errors

## 🔒 Security Best Practices

### Backend
- ✅ Never commit `.env` file
- ✅ Use environment variables for API keys
- ✅ Enable CORS only for specific domains
- ✅ Use HTTPS in production
- ✅ Monitor Railway logs for errors

### Frontend
- ✅ Never expose backend API keys
- ✅ Use `NEXT_PUBLIC_` prefix only for client-side variables
- ✅ Validate user inputs
- ✅ Monitor Vercel deployment logs

## 📊 Monitoring and Logs

### Railway Logs

```bash
# View logs in dashboard
Railway Dashboard → Your Service → "Logs" tab

# Or use Railway CLI
railway logs
```

### Vercel Logs

```bash
# View in dashboard
Vercel Dashboard → Your Project → "Logs" tab

# Or use Vercel CLI
vercel logs
```

## 🐛 Troubleshooting

### Issue: "Failed to fetch" error

**Solution**: Check CORS settings and ensure backend URL is correct

```javascript
// In VoiceBot.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
console.log('API URL:', API_URL) // Debug
```

### Issue: "GROQ_API_KEY not found" or "HUME_API_KEY not found"

**Solution**: Add environment variables in Railway dashboard (both GROQ_API_KEY and HUME_API_KEY)

### Issue: Build fails on Vercel

**Solution**: Check Node.js version in `package.json`:
```json
"engines": {
  "node": ">=18.0.0"
}
```

### Issue: Backend timeout

**Solution**: Railway free tier has timeouts. Upgrade or use Render.

### Issue: Voice not working

**Solution**: HTTPS required for Web Speech API. Local dev uses HTTP, production needs HTTPS (Vercel provides this automatically).

## 💰 Cost Estimation

### Free Tier Limits

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- ✅ Perfect for this project

**Railway Free Trial:**
- $5 credit/month
- ~500 hours runtime
- ✅ Sufficient for demo

**Groq API:**
- Free tier: 30 requests/minute
- ✅ Great for interviews

**Total Monthly Cost: $0** (within free tiers)

## 🚀 Going Live

### Final Checklist

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Test voice recognition
- [ ] Test all quick actions
- [ ] Test resume download
- [ ] Check mobile responsiveness
- [ ] Review logs for errors
- [ ] Share URL for testing

### Submission URL

Your final submission URL will be:
```
https://your-project-name.vercel.app
```

## 📈 Post-Deployment

### Monitor Performance

1. **Vercel Analytics** (optional)
   - Enable in Vercel dashboard
   - Track page views and performance

2. **Railway Metrics**
   - Monitor memory and CPU usage
   - Check response times

### Update Code

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Both Vercel and Railway auto-deploy on push to main branch
```

## 🆘 Support

If you encounter issues:

1. Check logs (Vercel + Railway dashboards)
2. Review environment variables
3. Test API endpoints directly
4. Check browser console for frontend errors
5. Verify CORS configuration

---

**Deployment Complete!** 🎉

Your AI Voice Interview Bot is now live and ready to impress the 100x team!
