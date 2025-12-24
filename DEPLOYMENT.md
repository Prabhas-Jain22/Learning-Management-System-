# Deployment Guide for MERN LMS

This guide covers deploying the MERN LMS application to Vercel (Frontend) and other platforms (Backend).

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub repository (already done ✓)

### Step 1: Connect GitHub to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `Learning-Management-System-`
4. Select "Prabhas-Jain22/Learning-Management-System-"

### Step 2: Configure Project Settings

When Vercel asks for configuration:
- **Framework**: Vite
- **Root Directory**: `./client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL = https://your-backend-api.com
```

(Replace with your actual backend URL)

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

Your frontend will be live at: `https://your-project.vercel.app`

---

## Backend Deployment Options

The backend can be deployed to various platforms. Here are the best options:

### Option 1: Render (Recommended - Free tier available)

#### Step 1: Push Code to GitHub
```bash
git push origin main
```

#### Step 2: Create Render Account
- Go to https://render.com
- Sign up with GitHub

#### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `lms-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `server`

#### Step 4: Add Environment Variables
In Render Dashboard → Environment:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=https://your-frontend.vercel.app
```

#### Step 5: Deploy
Click "Create Web Service" - deployment will start automatically

Your backend will be live at: `https://lms-backend.onrender.com`

---

### Option 2: Railway

1. Go to https://railway.app
2. Click "New Project"
3. Deploy from GitHub repo
4. Select the repository
5. Add environment variables
6. Railway will auto-deploy

---

### Option 3: Heroku (Paid)

1. Go to https://heroku.com
2. Create new app
3. Connect GitHub
4. Add buildpacks: Node.js
5. Set environment variables
6. Deploy

---

## Update Frontend After Backend Deployment

Once your backend is deployed:

1. Update Vercel environment variable:
   ```
   VITE_API_URL = https://your-deployed-backend-url.com
   ```

2. Trigger a redeploy in Vercel

---

## MongoDB Atlas Setup

If using MongoDB Atlas (recommended for cloud):

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Create free cluster
4. Get connection string
5. Update `MONGO_URI` in backend environment variables

---

## Cloudinary Setup

For image/video uploads:

1. Go to https://cloudinary.com
2. Sign up free
3. Get your credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Add to environment variables

---

## Razorpay Setup

For payment processing:

1. Go to https://razorpay.com
2. Create merchant account
3. Get API credentials:
   - Key ID
   - Key Secret
4. Add to environment variables

---

## Final Checklist

Before going live:

- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render/Railway/Heroku
- [ ] MongoDB Atlas database configured
- [ ] Cloudinary account set up
- [ ] Razorpay account configured
- [ ] Environment variables set on both platforms
- [ ] Frontend VITE_API_URL points to deployed backend
- [ ] Backend CLIENT_URL points to deployed frontend
- [ ] Test user registration/login
- [ ] Test video upload
- [ ] Test payment flow

---

## Monitoring & Logs

### Vercel Logs
- Dashboard → Deployments → Click deployment → Logs

### Render Logs
- Dashboard → Service → Logs

### Common Issues

**CORS Errors**: Make sure backend has correct CLIENT_URL in environment

**API Connection Fails**: Verify VITE_API_URL is correct in Vercel

**Database Connection**: Check MongoDB connection string

**Payment Gateway**: Verify Razorpay keys are correct

---

## Post-Deployment

1. Monitor logs for errors
2. Test all features:
   - Authentication
   - Course enrollment
   - Video playback
   - Payments
   - Book management
3. Keep backups of sensitive data
4. Monitor MongoDB usage
5. Set up error monitoring (e.g., Sentry)

---

**Your MERN LMS is now deployed to the cloud!** 🚀
