
 Plan to implement                                                                                                                                                                                  │
                                                                                                                                                                                                    │
 Notes Taking App - Implementation Plan                                                                                                                                                             │
                                                                                                                                                                                                    │
 Project Overview                                                                                                                                                                                   │
                                                                                                                                                                                                    │
 Build a notes-taking app matching Figma designs, demonstrating rapid full-stack development using Claude Code with Figma MCP integration.                                                                                     │
                                                                                                                                                                                                    │
 Tech Stack: Django REST Framework (backend) + Next.js/React (frontend)                                                                                                                             │
 Timeline: 72 hours                                                                                                                                                                                 │
 Goal: Pixel-perfect implementation with clean, maintainable code                                                                                                                                   │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 Architecture                                                                                                                                                                                       │
                                                                                                                                                                                                    │
 Backend (Django REST Framework)                                                                                                                                                                    │
                                                                                                                                                                                                    │
 backend/                                                                                                                                                                                           │
 ├── config/                 # Django project settings                                                                                                                                              │
 │   ├── settings.py                                                                                                                                                                                │
 │   ├── urls.py                                                                                                                                                                                    │
 │   └── wsgi.py                                                                                                                                                                                    │
 ├── apps/                                                                                                                                                                                          │
 │   ├── users/              # Authentication & user management                                                                                                                                     │
 │   │   ├── models.py       # Custom User model                                                                                                                                                    │
 │   │   ├── serializers.py                                                                                                                                                                         │
 │   │   ├── views.py                                                                                                                                                                               │
 │   │   └── urls.py                                                                                                                                                                                │
 │   ├── notes/              # Notes CRUD                                                                                                                                                           │
 │   │   ├── models.py       # Note, Category models                                                                                                                                                │
 │   │   ├── serializers.py                                                                                                                                                                         │
 │   │   ├── views.py                                                                                                                                                                               │
 │   │   └── urls.py                                                                                                                                                                                │
 │   └── audio/              # Audio transcription (bonus)                                                                                                                                          │
 ├── requirements.txt                                                                                                                                                                               │
 └── manage.py                                                                                                                                                                                      │
                                                                                                                                                                                                    │
 Frontend (Next.js 14 + App Router)                                                                                                                                                                 │
                                                                                                                                                                                                    │
 frontend/                                                                                                                                                                                          │
 ├── src/                                                                                                                                                                                           │
 │   ├── app/                                                                                                                                                                                       │
 │   │   ├── (auth)/                                                                                                                                                                                │
 │   │   │   ├── login/page.tsx                                                                                                                                                                     │
 │   │   │   └── signup/page.tsx                                                                                                                                                                    │
 │   │   ├── (dashboard)/                                                                                                                                                                           │
 │   │   │   ├── page.tsx        # Notes dashboard                                                                                                                                                  │
 │   │   │   └── notes/[id]/page.tsx                                                                                                                                                                │
 │   │   ├── layout.tsx                                                                                                                                                                             │
 │   │   └── globals.css                                                                                                                                                                            │
 │   ├── components/                                                                                                                                                                                │
 │   │   ├── ui/                 # Reusable UI components                                                                                                                                           │
 │   │   ├── notes/              # Note-specific components                                                                                                                                         │
 │   │   └── auth/               # Auth forms                                                                                                                                                       │
 │   ├── lib/                                                                                                                                                                                       │
 │   │   ├── api.ts              # API client                                                                                                                                                       │
 │   │   └── auth.ts             # Auth utilities                                                                                                                                                   │
 │   └── types/                                                                                                                                                                                     │
 ├── tailwind.config.ts                                                                                                                                                                             │
 └── package.json                                                                                                                                                                                   │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 Implementation Phases                                                                                                                                                                              │
                                                                                                                                                                                                    │
 Phase 1: Project Setup                                                                                                                                                                             │
                                                                                                                                                                                                    │
 - Initialize Django project with custom User model                                                                                                                                                 │
 - Initialize Next.js 14 with TypeScript, Tailwind CSS                                                                                                                                              │
 - Configure CORS, JWT authentication                                                                                                                                                               │
 - Set up PostgreSQL (or SQLite for dev)                                                                                                                                                            │
 - Docker Compose for local development                                                                                                                                                             │
                                                                                                                                                                                                    │
 Phase 2: Authentication                                                                                                                                                                            │
                                                                                                                                                                                                    │
 Backend:                                                                                                                                                                                           │
 - Custom User model (email as username)                                                                                                                                                            │
 - JWT token authentication (djangorestframework-simplejwt)                                                                                                                                         │
 - Endpoints: /api/auth/register/, /api/auth/login/, /api/auth/me/                                                                                                                                  │
                                                                                                                                                                                                    │
 Frontend:                                                                                                                                                                                          │
 - Login page with "Yay, You're Back!" design                                                                                                                                                       │
 - Signup page with "Yay, New Friend!" design                                                                                                                                                       │
 - Password visibility toggle                                                                                                                                                                       │
 - Form validation                                                                                                                                                                                  │
 - Auth context/state management                                                                                                                                                                    │
 - Protected route middleware                                                                                                                                                                       │
                                                                                                                                                                                                    │
 Phase 3: Categories                                                                                                                                                                                │
                                                                                                                                                                                                    │
 Backend:                                                                                                                                                                                           │
 - Category model with name, color, user (foreign key)                                                                                                                                              │
 - Pre-seed default categories: Random Thoughts, School, Personal                                                                                                                                   │
 - CRUD endpoints for categories                                                                                                                                                                    │
                                                                                                                                                                                                    │
 Frontend:                                                                                                                                                                                          │
 - Category sidebar component                                                                                                                                                                       │
 - Color-coded category pills                                                                                                                                                                       │
 - Note counts per category                                                                                                                                                                         │
 - Category filtering                                                                                                                                                                               │
                                                                                                                                                                                                    │
 Phase 4: Notes CRUD                                                                                                                                                                                │
                                                                                                                                                                                                    │
 Backend:                                                                                                                                                                                           │
 - Note model: title, content, category, user, created_at, updated_at                                                                                                                               │
 - ViewSet with filtering by category                                                                                                                                                               │
 - Pagination support                                                                                                                                                                               │
                                                                                                                                                                                                    │
 Frontend:                                                                                                                                                                                          │
 - Notes grid (3-column responsive layout)                                                                                                                                                          │
 - Note card component with:                                                                                                                                                                        │
   - Date formatting ("today", "yesterday", "July 15")                                                                                                                                              │
   - Category badge                                                                                                                                                                                 │
   - Title                                                                                                                                                                                          │
   - Content preview (truncated)                                                                                                                                                                    │
   - Category-specific background colors                                                                                                                                                            │
 - Empty state with boba tea illustration                                                                                                                                                           │
 - "+ New Note" button                                                                                                                                                                              │
                                                                                                                                                                                                    │
 Phase 5: Note Editor                                                                                                                                                                               │
                                                                                                                                                                                                    │
 Frontend:                                                                                                                                                                                          │
 - Full-screen note editor view                                                                                                                                                                     │
 - Category dropdown selector                                                                                                                                                                       │
 - Auto-save functionality (debounced)                                                                                                                                                              │
 - "Last Edited" timestamp display                                                                                                                                                                  │
 - Close button to return to dashboard                                                                                                                                                              │
 - Background color based on category                                                                                                                                                               │
                                                                                                                                                                                                    │
 Phase 6: Polish & Extras                                                                                                                                                                           │
                                                                                                                                                                                                    │
 - Responsive design                                                                                                                                                                                │
 - Loading states & skeletons                                                                                                                                                                       │
 - Error handling & toast notifications                                                                                                                                                             │
 - Animations/transitions (subtle)                                                                                                                                                                  │
 - Dark mode (bonus)                                                                                                                                                                                │
                                                                                                                                                                                                    │
 Phase 7: Audio Feature (Bonus - Time Permitting)                                                                                                                                                   │
                                                                                                                                                                                                    │
 - Web Speech API for voice-to-text                                                                                                                                                                 │
 - Audio recording UI                                                                                                                                                                               │
 - Transcription to note content                                                                                                                                                                    │
                                                                                                                                                                                                    │
 Phase 8: Testing & Documentation                                                                                                                                                                   │
                                                                                                                                                                                                    │
 - Backend: pytest with 80%+ coverage                                                                                                                                                               │
 - Frontend: Jest + React Testing Library                                                                                                                                                           │
 - API documentation (DRF spectacular/swagger)                                                                                                                                                      │
 - README with setup instructions                                                                                                                                                                   │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 Design Tokens (from Figma)                                                                                                                                                                         │
                                                                                                                                                                                                    │
 Colors                                                                                                                                                                                             │
                                                                                                                                                                                                    │
 --bg-primary: #F5F0E8;          /* Cream background */                                                                                                                                             │
 --text-primary: #5D4037;         /* Dark brown */                                                                                                                                                  │
 --text-secondary: #8B7355;       /* Lighter brown */                                                                                                                                               │
 --accent: #C4A35A;               /* Golden/button */                                                                                                                                               │
                                                                                                                                                                                                    │
 /* Category Colors */                                                                                                                                                                              │
 --category-random: #F5C4A1;      /* Peach/salmon */                                                                                                                                                │
 --category-school: #F5E6A3;      /* Yellow/cream */                                                                                                                                                │
 --category-personal: #A8D5D8;    /* Teal/mint */                                                                                                                                                   │
                                                                                                                                                                                                    │
 Typography                                                                                                                                                                                         │
                                                                                                                                                                                                    │
 - Headings: Serif font (Playfair Display or similar)                                                                                                                                               │
 - Body: Sans-serif (Inter or system font)                                                                                                                                                          │
                                                                                                                                                                                                    │
 Spacing                                                                                                                                                                                            │
                                                                                                                                                                                                    │
 - Border radius: 12-16px for cards                                                                                                                                                                 │
 - Sidebar width: 256px                                                                                                                                                                             │
 - Grid gap: 16px                                                                                                                                                                                   │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 Database Schema                                                                                                                                                                                    │
                                                                                                                                                                                                    │
 -- Users (extends Django's AbstractUser)                                                                                                                                                           │
 CREATE TABLE users (                                                                                                                                                                               │
   id SERIAL PRIMARY KEY,                                                                                                                                                                           │
   email VARCHAR(255) UNIQUE NOT NULL,                                                                                                                                                              │
   password VARCHAR(255) NOT NULL,                                                                                                                                                                  │
   created_at TIMESTAMP DEFAULT NOW()                                                                                                                                                               │
 );                                                                                                                                                                                                 │
                                                                                                                                                                                                    │
 -- Categories                                                                                                                                                                                      │
 CREATE TABLE categories (                                                                                                                                                                          │
   id SERIAL PRIMARY KEY,                                                                                                                                                                           │
   name VARCHAR(100) NOT NULL,                                                                                                                                                                      │
   color VARCHAR(7) NOT NULL,  -- Hex color                                                                                                                                                         │
   user_id INTEGER REFERENCES users(id),                                                                                                                                                            │
   created_at TIMESTAMP DEFAULT NOW()                                                                                                                                                               │
 );                                                                                                                                                                                                 │
                                                                                                                                                                                                    │
 -- Notes                                                                                                                                                                                           │
 CREATE TABLE notes (                                                                                                                                                                               │
   id SERIAL PRIMARY KEY,                                                                                                                                                                           │
   title VARCHAR(255) NOT NULL,                                                                                                                                                                     │
   content TEXT,                                                                                                                                                                                    │
   category_id INTEGER REFERENCES categories(id),                                                                                                                                                   │
   user_id INTEGER REFERENCES users(id),                                                                                                                                                            │
   created_at TIMESTAMP DEFAULT NOW(),                                                                                                                                                              │
   updated_at TIMESTAMP DEFAULT NOW()                                                                                                                                                               │
 );                                                                                                                                                                                                 │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 API Endpoints                                                                                                                                                                                      │
 ┌────────┬─────────────────────┬─────────────────────────┐                                                                                                                                         │
 │ Method │      Endpoint       │       Description       │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ POST   │ /api/auth/register/ │ Create new user         │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ POST   │ /api/auth/login/    │ Get JWT tokens          │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ POST   │ /api/auth/refresh/  │ Refresh access token    │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ GET    │ /api/auth/me/       │ Get current user        │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ GET    │ /api/categories/    │ List user's categories  │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ POST   │ /api/categories/    │ Create category         │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ GET    │ /api/notes/         │ List notes (filterable) │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ POST   │ /api/notes/         │ Create note             │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ GET    │ /api/notes/{id}/    │ Get note detail         │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ PATCH  │ /api/notes/{id}/    │ Update note             │                                                                                                                                         │
 ├────────┼─────────────────────┼─────────────────────────┤                                                                                                                                         │
 │ DELETE │ /api/notes/{id}/    │ Delete note             │                                                                                                                                         │
 └────────┴─────────────────────┴─────────────────────────┘                                                                                                                                         │
 ---                                                                                                                                                                                                │
 Key Technical Decisions                                                                                                                                                                            │
                                                                                                                                                                                                    │
 1. JWT Authentication - Stateless, works well with Next.js middleware                                                                                                                              │
 2. Next.js App Router - Latest patterns, server components where beneficial                                                                                                                        │
 3. Tailwind CSS - Rapid styling matching Figma precisely                                                                                                                                           │
 4. Auto-save - Debounced PATCH requests (500ms delay)                                                                                                                                              │
 5. Optimistic UI - Instant feedback, rollback on error                                                                                                                                             │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 "Going Beyond" Ideas                                                                                                                                                                               │
                                                                                                                                                                                                    │
 1. Real-time sync - WebSocket for multi-device sync                                                                                                                                                │
 2. Keyboard shortcuts - Cmd+N for new note, Cmd+S to save                                                                                                                                          │
 3. Search functionality - Full-text search across notes                                                                                                                                            │
 4. Note deletion - Soft delete with trash/restore                                                                                                                                                  │
 5. Export - Download notes as markdown/PDF                                                                                                                                                         │
 6. Voice notes - Audio recording with transcription                                                                                                                                                │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 Verification Plan                                                                                                                                                                                  │
                                                                                                                                                                                                    │
 1. Manual Testing:                                                                                                                                                                                 │
   - Complete user flow: signup → create note → edit → filter by category                                                                                                                           │
   - Test all edge cases (empty states, long content, special characters)                                                                                                                           │
   - Cross-browser testing (Chrome, Firefox, Safari)                                                                                                                                                │
 2. Automated Testing:                                                                                                                                                                              │
   - Backend: pytest - models, views, serializers                                                                                                                                                   │
   - Frontend: Jest - components, hooks, API integration                                                                                                                                            │
 3. Visual QA:                                                                                                                                                                                      │
   - Compare each screen against Figma                                                                                                                                                              │
   - Verify colors, spacing, typography match exactly                                                                                                                                               │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 Files to Create/Modify                                                                                                                                                                             │
                                                                                                                                                                                                    │
 Backend                                                                                                                                                                                            │
                                                                                                                                                                                                    │
 - backend/config/settings.py - Django settings                                                                                                                                                     │
 - backend/apps/users/models.py - Custom User model                                                                                                                                                 │
 - backend/apps/users/serializers.py - User serializers                                                                                                                                             │
 - backend/apps/users/views.py - Auth views                                                                                                                                                         │
 - backend/apps/notes/models.py - Note, Category models                                                                                                                                             │
 - backend/apps/notes/serializers.py - Note serializers                                                                                                                                             │
 - backend/apps/notes/views.py - Note ViewSets                                                                                                                                                      │
 - backend/requirements.txt - Dependencies                                                                                                                                                          │
                                                                                                                                                                                                    │
 Frontend                                                                                                                                                                                           │
                                                                                                                                                                                                    │
 - frontend/src/app/(auth)/login/page.tsx - Login page                                                                                                                                              │
 - frontend/src/app/(auth)/signup/page.tsx - Signup page                                                                                                                                            │
 - frontend/src/app/(dashboard)/page.tsx - Dashboard                                                                                                                                                │
 - frontend/src/components/notes/NoteCard.tsx - Note card component                                                                                                                                 │
 - frontend/src/components/notes/NoteEditor.tsx - Note editor                                                                                                                                       │
 - frontend/src/components/notes/CategorySidebar.tsx - Sidebar                                                                                                                                      │
 - frontend/src/lib/api.ts - API client                                                                                                                                                             │
 - frontend/tailwind.config.ts - Design tokens                                                                                                                                                      │
                                                                                                                                                                                                    │
 ---                                                                                                                                                                                                │
 Estimated Breakdown                                                                                                                                                                                │
 ┌────────────┬─────────────────────────────┐                                                                                                                                                       │
 │   Phase    │            Scope            │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Setup      │ Project scaffolding, config │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Auth       │ Login/signup flow           │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Categories │ Sidebar, filtering          │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Notes CRUD │ Cards, grid, API            │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Editor     │ Full editor view            │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Polish     │ Animations, edge cases      │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Testing    │ Unit + integration tests    │                                                                                                                                                       │
 ├────────────┼─────────────────────────────┤                                                                                                                                                       │
 │ Docs       │ README, demo video          │                                                                                                                                                       │
 └────────────┴─────────────────────────────┘                                                                                                                                                       │
                                                             