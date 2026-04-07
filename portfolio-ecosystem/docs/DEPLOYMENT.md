# Deployment Guide

## Overview

This guide covers deploying both the Portfolio Website and Admin Panel to production.

---

## Prerequisites

1. Supabase project created and configured
2. Database schema applied
3. Storage buckets created
4. Admin user created in Supabase Auth

---

## 1. Supabase Configuration

### Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Create New Query
3. Paste contents of `supabase/schema.sql`
4. Run the query

### Storage Buckets

Create three public buckets:
1. `projects` - For project images and PDFs
2. `resumes` - For resume PDF
3. `assets` - For profile image and skill icons

### Authentication

1. Go to Authentication → Settings
2. Enable Email provider
3. Configure email templates (optional)
4. Create your admin user

### CORS Configuration

Add your production domains to:
- Settings → API → CORS

Example:
```
https://your-portfolio.com
https://your-admin.com
```

---

## 2. Portfolio Website Deployment

### Build Configuration

```bash
cd portfolio
npm install
npm run build
```

Output will be in `dist/` folder.

### Environment Variables

Create `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Cloudflare Pages

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Environment variables: Add the two variables above
4. Deploy

### Custom Domain (Optional)

1. Go to Cloudflare Pages → Your Project → Custom Domains
2. Add your domain
3. Follow DNS configuration instructions

---

## 3. Admin Panel Deployment

### Build Configuration

```bash
cd admin-panel
npm install
npm run build
```

Output will be in `dist/` folder.

### Environment Variables

Create `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Cloudflare Pages

1. Connect your GitHub repository (or same repo, different branch)
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Environment variables: Add the two variables above
4. Deploy

### Security Considerations

1. **Protect Admin Panel**:
   - Use a non-obvious URL (e.g., `/admin` not `/dashboard`)
   - Consider Cloudflare Access for additional protection
   - Enable 2FA in Supabase for admin account

2. **Environment Variables**:
   - Never commit `.env` files
   - Use Cloudflare Pages environment variables
   - Rotate keys periodically

---

## 4. Post-Deployment Checklist

### Portfolio Website

- [ ] Homepage loads correctly
- [ ] All sections display (Hero, Skills, Projects, About, CTA)
- [ ] Projects carousel works
- [ ] Project detail pages load
- [ ] Dark/Light mode toggle works
- [ ] Images load correctly
- [ ] Responsive on mobile

### Admin Panel

- [ ] Login page loads
- [ ] Can sign in with admin credentials
- [ ] Dashboard shows stats
- [ ] Can create/edit/delete projects
- [ ] Can upload images
- [ ] Can upload PDFs
- [ ] Can manage skills
- [ ] Can edit profile
- [ ] Changes reflect on portfolio

### Supabase

- [ ] RLS policies working
- [ ] Storage uploads work
- [ ] Auth sessions persist
- [ ] No CORS errors in console

---

## 5. Maintenance

### Regular Tasks

1. **Monitor Supabase usage**:
   - Database size
   - Storage usage
   - Auth users

2. **Backup**:
   - Supabase provides daily backups
   - Consider exporting critical data

3. **Updates**:
   - Keep dependencies updated
   - Monitor security advisories

### Troubleshooting

**Issue**: Images not loading
- Check storage bucket permissions
- Verify CORS settings
- Check image URLs in database

**Issue**: Auth not working
- Verify environment variables
- Check Supabase Auth settings
- Clear browser cache

**Issue**: Changes not reflecting
- Check browser cache
- Verify Supabase connection
- Check RLS policies

---

## 6. Performance Optimization

### Portfolio

1. **Image Optimization**:
   - Use WebP format when possible
   - Implement lazy loading
   - Use appropriate image sizes

2. **Code Splitting**:
   - Already implemented via Vite
   - Consider route-based splitting

3. **Caching**:
   - Enable Cloudflare caching
   - Set appropriate cache headers

### Admin Panel

1. **Debounced Inputs**:
   - Form inputs are already optimized
   - Consider debouncing search

2. **Pagination**:
   - Implement for large datasets
   - Currently loads all data

---

## 7. Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Storage buckets have correct permissions
- [ ] Admin user has strong password
- [ ] 2FA enabled (recommended)
- [ ] Environment variables not in code
- [ ] CORS configured correctly
- [ ] No sensitive data in client bundle

---

## Support

For deployment issues:
1. Check browser console for errors
2. Verify Supabase logs
3. Review Cloudflare Pages logs
4. Check network requests in DevTools

---

## Updates

To update after deployment:

1. Make changes locally
2. Test thoroughly
3. Commit and push
4. Cloudflare Pages auto-deploys
5. Verify changes in production
