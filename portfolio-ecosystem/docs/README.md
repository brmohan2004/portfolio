# Portfolio Ecosystem - Complete Documentation

## Overview

A complete 3-part system for managing a structural engineer portfolio:
1. **Public Portfolio Website** - Dynamic Next.js app
2. **Admin Panel CMS** - Modern CMS interface
3. **Supabase Backend** - Database + Storage + Auth

---

## Project Structure

```
portfolio-ecosystem/
├── portfolio/              # Public Portfolio Website
│   ├── src/
│   │   ├── components/     # UI components & sections
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities & Supabase client
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app with routing
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── ...
│
├── admin-panel/            # Admin Panel CMS
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Auth & toast hooks
│   │   ├── lib/            # Utilities & Supabase client
│   │   └── types/          # TypeScript types
│   ├── package.json
│   └── ...
│
├── supabase/
│   └── schema.sql          # Database schema
│
└── docs/
    ├── SYSTEM_ARCHITECTURE.md
    └── DEPLOYMENT.md
```

---

## Quick Start

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Create storage buckets:
   - `projects` (public)
   - `resumes` (public)
   - `assets` (public)
4. Enable Email auth in Authentication settings
5. Create your admin user

### 2. Portfolio Website Setup

```bash
cd portfolio
npm install
```

Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev    # Development
npm run build  # Production build
```

### 3. Admin Panel Setup

```bash
cd admin-panel
npm install
```

Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev    # Development
npm run build  # Production build
```

---

## Features

### Portfolio Website
- Dynamic content from Supabase
- Hero section with profile
- Skills showcase
- Projects carousel with filtering
- Project detail pages with galleries
- PDF downloads
- Dark/Light mode toggle
- Responsive design
- Smooth animations

### Admin Panel CMS
- **Authentication**: Secure login with Supabase Auth
- **Dashboard**: Overview of all content
- **Projects Management**:
  - Create/Edit/Delete projects
  - Upload images (cover, gallery, 3D models, connections)
  - Upload PDFs
  - Draft/Publish workflow
  - Featured toggle
- **Skills Management**:
  - Add/Edit/Delete skills
  - Icon upload
  - Drag-to-reorder (future)
- **Profile Management**:
  - Edit personal info
  - Upload profile image
  - Upload resume
  - Contact details

---

## Database Schema

### Tables

#### profile
- `id` (UUID, PK)
- `name` (text)
- `title` (text)
- `hero_description` (text)
- `bio` (text)
- `email` (text)
- `phone` (text)
- `location` (text)
- `resume_url` (text)
- `profile_image` (text)
- `social_links` (jsonb)
- `hire_me_text` (text)
- `created_at`, `updated_at` (timestamps)

#### skills
- `id` (UUID, PK)
- `name` (text)
- `icon_url` (text)
- `category` (text)
- `sort_order` (int)
- `is_active` (boolean)
- `created_at`, `updated_at` (timestamps)

#### projects
- `id` (UUID, PK)
- `title` (text)
- `slug` (text, unique)
- `description` (text)
- `overview` (text)
- `tools` (text[])
- `project_type` (text)
- `duration` (text)
- `featured` (boolean)
- `status` (text: draft/published)
- `cover_image` (text)
- `images` (text[])
- `model_images` (text[])
- `connection_images` (text[])
- `pdfs` (jsonb)
- `sort_order` (int)
- `created_at`, `updated_at` (timestamps)

---

## Security

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public Read**: Portfolio data is publicly readable
- **Admin Write**: Only authenticated users can write
- **Storage**: Public read, authenticated write

### Authentication Flow

1. Admin logs in with email/password
2. Supabase Auth validates and returns JWT
3. Token stored in memory (secure)
4. All write operations include auth token
5. RLS policies verify token before allowing writes

---

## Deployment

### Cloudflare Pages

1. **Portfolio**:
   - Connect GitHub repo
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: Add Supabase credentials

2. **Admin Panel**:
   - Connect GitHub repo
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: Add Supabase credentials

### Environment Variables

Both apps need:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Customization

### Colors
Edit `tailwind.config.js` in both apps:
```javascript
colors: {
  primary: {
    DEFAULT: '#2563eb',  // Change to your brand color
    dark: '#1d4ed8',
  },
  // ...
}
```

### Content
All content is managed through the Admin Panel. No code changes needed.

---

## Troubleshooting

### Common Issues

1. **CORS errors**: Add your domain to Supabase CORS settings
2. **Auth not working**: Check email confirmation settings
3. **Images not loading**: Verify storage bucket permissions
4. **Build errors**: Ensure all dependencies are installed

### Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com/docs

---

## License

MIT License - Feel free to use for personal or commercial projects.

---

## Credits

Built for Mohan B R - Structural Engineer Portfolio
