# OnlyHockey.com - Deployment Guide

## 🚀 Production Deployment

### Platform: Vercel (Recommended)

OnlyHockey.com is optimized for deployment on Vercel with Next.js.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key

# Optional
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_DOMAIN=onlyhockey.com
```

### 2. Database Setup
- [ ] Supabase production database configured
- [ ] All required tables created
- [ ] Sample content populated
- [ ] Row Level Security (RLS) policies enabled

### 3. Code Quality
- [ ] All TypeScript errors resolved: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production build

---

## 🔧 Vercel Deployment

### Initial Setup

1. **Connect Repository:**
   ```bash
   # Push to GitHub/GitLab
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Choose "Next.js" framework preset

3. **Configure Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all required environment variables
   - Set for Production, Preview, and Development

4. **Deploy:**
   - Vercel will automatically deploy on push to main branch
   - First deployment may take 2-3 minutes

### Custom Domain Setup

1. **Add Domain in Vercel:**
   - Project Settings → Domains
   - Add `onlyhockey.com` and `www.onlyhockey.com`

2. **Configure DNS:**
   ```
   # A Record
   @ → 76.76.19.19

   # CNAME Record  
   www → cname.vercel-dns.com
   ```

3. **SSL Certificate:**
   - Vercel automatically provisions SSL certificates
   - HTTPS will be enforced

---

## 🏗️ Build Configuration

### Next.js Config (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Vercel Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

---

## 📊 Performance Optimization

### 1. Image Optimization
- Use Next.js `Image` component
- Optimize images before upload
- Use WebP format when possible

### 2. Caching Strategy
```typescript
// API Routes - Cache responses
export const revalidate = 300; // 5 minutes

// Static pages - ISR
export const revalidate = 3600; // 1 hour
```

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

---

## 🔍 Monitoring & Analytics

### 1. Vercel Analytics
- Enable in Vercel dashboard
- Monitor Core Web Vitals
- Track page performance

### 2. Google Analytics (Optional)
```typescript
// Add to layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  )
}
```

### 3. Error Monitoring
Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

---

## 🚨 Troubleshooting

### Common Deployment Issues

**1. Build Failures**
```bash
# Check build locally
npm run build

# Common fixes
rm -rf .next node_modules
npm install
npm run build
```

**2. Environment Variable Issues**
- Verify all `NEXT_PUBLIC_*` variables are set
- Check Supabase credentials are correct
- Ensure no trailing spaces in values

**3. Database Connection Issues**
- Verify Supabase URL and keys
- Check database is accessible from Vercel
- Ensure RLS policies allow public access where needed

**4. API Route Timeouts**
- Optimize database queries
- Add proper error handling
- Consider caching for expensive operations

### Debug Commands
```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test production build locally
npm run build && npm start
```

---

## 🔄 CI/CD Pipeline

### Automatic Deployments
- **Main branch** → Production deployment
- **Feature branches** → Preview deployments
- **Pull requests** → Preview deployments with unique URLs

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

---

## 📈 Post-Deployment Checklist

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] API endpoints return data
- [ ] Trivia games function properly
- [ ] Shareables content displays
- [ ] Mobile responsiveness works
- [ ] Dark/light theme toggle works

### Performance Testing
- [ ] Core Web Vitals are good (Lighthouse)
- [ ] Page load times < 3 seconds
- [ ] Images load and display properly
- [ ] No console errors in production

### SEO & Meta
- [ ] Meta tags are correct
- [ ] Open Graph images work
- [ ] Sitemap is accessible
- [ ] robots.txt is configured

---

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Vercel's environment variable system
- Rotate keys regularly

### Database Security
- Enable RLS on all Supabase tables
- Use service role key only for server-side operations
- Validate all user inputs

### API Security
- Implement rate limiting for public APIs
- Validate request parameters
- Use HTTPS everywhere (enforced by Vercel)

---

## 📞 Support

### Deployment Issues
1. Check Vercel deployment logs
2. Verify environment variables
3. Test build locally first
4. Contact development team if needed

### Performance Issues
1. Run Lighthouse audit
2. Check Vercel Analytics
3. Optimize images and queries
4. Consider caching strategies

---

**Deployment Status:** ✅ Ready for production deployment!

**Live URL:** https://onlyhockey.com
