# VibeUI Deployment Guide

This guide provides step-by-step instructions for deploying VibeUI to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Access to the VibeUI GitHub repository
3. A [Supabase account](https://supabase.com) with the project set up

## Deployment Steps

### 1. Connect your repository to Vercel

1. Log in to your Vercel account
2. Click on "Add New..." > "Project"
3. Select the VibeUI repository from your GitHub account
4. Click "Import"

### 2. Configure Project Settings

1. In the project configuration page, ensure the following settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

2. Expand the "Environment Variables" section and add the following:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL (you can add this after the first deployment)

3. Click "Deploy"

### 3. Post-Deployment Setup

1. After the initial deployment completes, get your Vercel deployment URL
2. Update the `NEXT_PUBLIC_APP_URL` environment variable with this URL
3. Go to your Supabase project settings and add your Vercel URL to the allowed CORS origins

### 4. Verify Edge Functions

1. Check that the Supabase Edge Functions are properly deployed
2. Test the vibe generation functionality on your live site

### 5. Custom Domain (Optional)

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain and follow the DNS configuration instructions

## Troubleshooting

### Edge Function Issues

If you encounter issues with the Edge Functions:

1. Check the Supabase Edge Function logs
2. Ensure your function is deployed correctly
3. Verify the permissions and CORS settings

### Build Failures

If the build fails:

1. Check the build logs for specific errors
2. Verify that all dependencies are properly installed
3. Ensure environment variables are correctly set

## Performance Optimization

Consider implementing the following optimizations for better performance:

1. Enable Vercel's Edge Caching for static assets
2. Implement code splitting for larger components
3. Configure image optimization through Vercel

## Monitoring and Analytics

1. Set up Vercel Analytics to monitor site performance
2. Configure error tracking through Vercel Integrations

For additional support, contact the VibeUI development team. 