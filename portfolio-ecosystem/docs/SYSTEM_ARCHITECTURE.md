# Portfolio Ecosystem - System Architecture

## Overview
A complete 3-part system for managing a structural engineer portfolio:
1. **Public Portfolio Website** (Next.js) - Dynamic, content-driven
2. **Admin Panel CMS** (Next.js) - Modern CMS interface
3. **Supabase Backend** - Database + Storage + Auth

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────┬───────────────────────────────────────────────────┤
│   Public Portfolio      │   Admin Panel CMS                                 │
│   (Next.js App)         │   (Next.js App)                                   │
│                         │                                                   │
│   • Landing Page        │   • Authentication                                │
│   • Project Details     │   • Project Management                            │
│   • Dynamic Content     │   • Skills Management                             │
│   • Dark/Light Mode     │   • Profile Management                            │
│                         │   • Media Uploads                                 │
└───────────┬─────────────┴───────────────────────┬───────────────────────────┘
            │                                     │
            │         Supabase Client SDK         │
            │         (@supabase/supabase-js)     │
            │                                     │
            └─────────────────┬───────────────────┘
                              │
┌─────────────────────────────┴──────────────────────────────────────────────┐
│                           SUPABASE BACKEND                                   │
├─────────────────────────┬─────────────────────────┬────────────────────────┤
│      PostgreSQL         │      Supabase Storage   │    Supabase Auth       │
│      Database           │                         │                        │
│                         │                         │                        │
│   • projects table      │   • projects/ bucket    │   • Email/Password     │
│   • skills table        │   • resumes/ bucket     │   • Session mgmt       │
│   • profile table       │   • assets/ bucket      │   • JWT tokens         │
│   • RLS Policies        │                         │                        │
└─────────────────────────┴─────────────────────────┴────────────────────────┘
```

---

## Data Flow

### 1. Public Website Data Flow
```
User visits portfolio
    ↓
Next.js app requests data from Supabase
    ↓
Supabase returns content (projects, skills, profile)
    ↓
Next.js renders dynamic content
    ↓
User sees personalized portfolio
```

### 2. Admin Panel Data Flow
```
Admin logs in
    ↓
Supabase Auth validates credentials
    ↓
Session token stored
    ↓
Admin creates/edits content
    ↓
Data saved to Supabase (DB + Storage)
    ↓
Public website reflects changes immediately
```

---

## Authentication & Security Design

### Authentication Flow
1. **Admin Login**: Email/password via Supabase Auth
2. **Session Management**: JWT tokens with automatic refresh
3. **Protected Routes**: Middleware checks auth state
4. **Role-Based Access**: Single admin role (can be extended)

### Security Measures
1. **Row Level Security (RLS)**: All tables have RLS enabled
2. **Admin-Only Writes**: Only authenticated admins can write
3. **Public Reads**: Portfolio data is publicly readable
4. **Secure Storage**: Signed URLs for private files
5. **CORS Configuration**: Restricted to known origins

### RLS Policies
```sql
-- Projects: Public read, Admin write
-- Skills: Public read, Admin write
-- Profile: Public read, Admin write
```

---

## CMS UX Design Decisions

### Inspired by Modern Tools

| Feature | Sanity | Strapi | Notion | Our Implementation |
|---------|--------|--------|--------|-------------------|
| Sidebar Nav | ✅ | ✅ | ❌ | ✅ Collections-based |
| Form Editing | ✅ | ✅ | ✅ | ✅ Clean, sectioned |
| Media Upload | ✅ | ✅ | ✅ | ✅ Drag & drop |
| Preview | ✅ | ❌ | ❌ | ✅ Optional |
| Draft/Publish | ✅ | ✅ | ❌ | ✅ Status toggle |
| Search/Filter | ✅ | ✅ | ✅ | ✅ Full-text search |

### UX Principles
1. **Minimal Interface**: Clean, distraction-free editing
2. **Contextual Actions**: Actions appear where needed
3. **Immediate Feedback**: Toast notifications for all actions
4. **Keyboard Shortcuts**: Power-user efficiency
5. **Mobile Responsive**: Edit on any device

---

## Database Schema

### Tables

#### 1. projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  overview TEXT,
  tools TEXT[], -- Array of tool names
  project_type TEXT,
  duration TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft', -- draft, published
  cover_image TEXT,
  images TEXT[], -- Array of image URLs
  model_images TEXT[], -- 3D model images
  connection_images TEXT[], -- Connection detail images
  pdfs JSONB[], -- Array of {name, url, size}
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. skills
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. profile
```sql
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  bio TEXT,
  hero_description TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  resume_url TEXT,
  profile_image TEXT,
  social_links JSONB, -- {linkedin, github, etc.}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Storage Buckets

### Structure
```
projects/
  ├── {project-id}/
  │   ├── cover/
  │   ├── gallery/
  │   ├── models/
  │   └── connections/
  
resumes/
  └── resume.pdf
  
assets/
  ├── skills/
  └── profile/
```

### Bucket Configuration
- **projects**: Public read, Admin write
- **resumes**: Public read, Admin write
- **assets**: Public read, Admin write

---

## Component Architecture

### Portfolio App
```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── project/[slug]/
│   │   └── page.tsx          # Project details
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── About.tsx
│   │   └── CTA.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectCarousel.tsx
│   ├── ImageGallery.tsx
│   └── ThemeProvider.tsx
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── utils.ts
└── hooks/
    └── useSupabase.ts
```

### Admin Panel
```
src/
├── app/
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── page.tsx          # Dashboard home
│   │   ├── projects/
│   │   │   ├── page.tsx      # Projects list
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Edit project
│   │   ├── skills/
│   │   │   └── page.tsx      # Skills management
│   │   └── profile/
│   │       └── page.tsx      # Profile editing
│   └── layout.tsx
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileNav.tsx
│   ├── forms/
│   │   ├── ProjectForm.tsx
│   │   ├── SkillForm.tsx
│   │   └── ProfileForm.tsx
│   ├── media/
│   │   ├── ImageUploader.tsx
│   │   ├── PDFUploader.tsx
│   │   └── GalleryManager.tsx
│   └── auth/
│       └── ProtectedRoute.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── hooks/
    ├── useAuth.ts
    └── useSupabase.ts
```

---

## Styling Strategy

### Design Tokens
```css
/* Colors */
--primary: #2563eb;        /* Blue for CTAs */
--background: #ffffff;      /* Light mode */
--background-dark: #0a0a0a; /* Dark mode */
--text: #171717;
--text-muted: #737373;

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif;
--font-heading: 'Inter', system-ui, sans-serif;

/* Spacing */
--section-padding: 4rem;
--container-max: 1280px;

/* Border Radius */
--radius: 0.5rem;
--radius-lg: 1rem;
```

### Tailwind Configuration
- Custom colors for brand identity
- Extended spacing scale
- Animation utilities
- Dark mode class strategy

---

## Animation Strategy

### Portfolio (Rich Animations)
- **Hero**: Fade-in + slide-up on load
- **Skills**: Staggered reveal on scroll
- **Projects**: Smooth carousel transitions
- **Images**: Hover zoom + overlay
- **Scroll**: Section reveal animations

### Admin Panel (Minimal, Professional)
- **Page transitions**: Subtle fade
- **Form interactions**: Input focus states
- **Modals**: Scale + fade
- **Toasts**: Slide-in notifications
- **Loading**: Skeleton screens

---

## Deployment Configuration

### Environment Variables

#### Portfolio App
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### Admin Panel
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= # Server-side only
```

### Cloudflare Pages Setup
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables
5. Enable preview deployments

---

## Performance Optimizations

1. **Image Optimization**: Next.js Image component with lazy loading
2. **Code Splitting**: Route-based splitting
3. **Data Caching**: SWR/React Query for data fetching
4. **Static Generation**: ISR for project pages
5. **Bundle Analysis**: Regular size monitoring

---

## Scalability Considerations

1. **Database**: Index on frequently queried columns
2. **Storage**: CDN for asset delivery
3. **Caching**: Redis for session storage (future)
4. **API Rate Limiting**: Prevent abuse
5. **Monitoring**: Error tracking + analytics

---

## Future Enhancements

1. **Multi-language Support**: i18n for international portfolios
2. **Analytics Dashboard**: View counts, popular projects
3. **Comments System**: Project feedback
4. **Newsletter**: Email subscription
5. **Advanced Search**: Full-text + filters
6. **Version Control**: Content versioning
7. **Collaboration**: Multi-admin support
