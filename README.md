# Notes Taking App

A beautiful, pixel-perfect notes-taking application demonstrating full-stack development with Claude Code and Figma MCP integration.

![Notes App Screenshot](docs/screenshot.png)

## Tech Stack

- **Backend:** Django 5.0 + Django REST Framework
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Database:** SQLite (development) / PostgreSQL (production)

## Features

### Core Features
- **User Authentication** - Login/signup with JWT tokens
- **Notes CRUD** - Create, read, update, delete notes
- **Categories** - Color-coded categories (Random Thoughts, School, Personal)
- **Auto-save** - Notes save automatically with 500ms debounce
- **Category Filtering** - Filter notes by category in sidebar

### Extras 
- **Toast Notifications** - Visual feedback for all actions and errors
- **Keyboard Shortcuts** - Press `Esc` to close note editor
- **Logout Button** - Secure sign-out with token cleanup
- **Mobile Responsive** - Hamburger menu, slide-out sidebar, optimized layouts
- **Error Handling** - Graceful handling of network failures and edge cases

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 20+
- npm or yarn

### Option 1: Run with Docker (Recommended)

```bash
docker-compose up
```

Access the app at http://localhost:3000

### Option 2: Run Locally

#### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

Backend runs at http://localhost:8000

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at http://localhost:3000

## Project Structure

```
turbo.io/
├── backend/
│   ├── config/              # Django project settings
│   ├── apps/
│   │   ├── users/           # Authentication & user management
│   │   └── notes/           # Notes CRUD & categories
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # API client & auth context
│   │   └── types/           # TypeScript types
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Create new user |
| POST | `/api/auth/login/` | Get JWT tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Get current user |
| GET | `/api/categories/` | List user's categories |
| POST | `/api/categories/` | Create category |
| POST | `/api/categories/seed_defaults/` | Seed default categories |
| GET | `/api/notes/` | List notes (filterable by ?category=id) |
| POST | `/api/notes/` | Create note |
| GET | `/api/notes/{id}/` | Get note detail |
| PATCH | `/api/notes/{id}/` | Update note |
| DELETE | `/api/notes/{id}/` | Delete note |

## Design Decisions

### Backend

1. **Custom User Model:** Email-based authentication instead of username for modern UX
2. **JWT Authentication:** Stateless auth that works well with Next.js and allows easy token refresh
3. **ViewSets:** Used DRF ViewSets for consistent CRUD operations with minimal boilerplate
4. **Category Seeding:** Auto-seed default categories on first login for better onboarding

### Frontend

1. **App Router:** Used Next.js 14+ app router for modern React patterns and server components
2. **Route Groups:** Separated auth and dashboard routes with different layouts
3. **Optimistic UI:** Auto-save with debounce (500ms) for seamless editing experience
4. **Design Tokens:** CSS custom properties for consistent theming matching Figma exactly

### Architecture

1. **Separation of Concerns:** Clear separation between API layer, auth context, and UI components
2. **Type Safety:** Full TypeScript coverage for better DX and fewer runtime errors
3. **Reusable Components:** Built a component library (Button, Input, NoteCard, etc.) for consistency

## Development Process

### 1. Planning First
Started by analyzing the requirements and Figma designs before writing any code. Created a detailed implementation plan ([PLAN.md](PLAN.md)) covering architecture, database schema, API endpoints, and phased delivery.

### 2. Figma Integration Setup
To enable the AI to "see" the designs:
- Downloaded Figma desktop app and cloned the design file locally
- Installed the Figma MCP (Model Context Protocol) server for Claude Code
- This allowed Claude to extract exact colors, fonts, spacing, and assets directly from Figma

### 3. Iterative Development
Built the app in phases:
1. Backend setup (Django, models, JWT auth)
2. Frontend setup (Next.js, Tailwind, design tokens)
3. Authentication flow (login/signup pages)
4. Notes CRUD and dashboard
5. Note editor with auto-save
6. QA and polish (toasts, mobile responsive, keyboard shortcuts)

### 4. Testing & Documentation
- Wrote 20 backend tests covering auth and notes
- Created comprehensive documentation
- Prepared demo flow

## AI Tools Used

This project was built with **Claude Code (Opus 4.5)**, Anthropic's AI coding assistant:

### How AI Was Used

| Task | AI Contribution |
|------|-----------------|
| **Planning** | Created detailed implementation plan from requirements |
| **Figma → Code** | Extracted design tokens (colors, fonts, spacing) via Figma MCP |
| **Backend** | Generated Django models, serializers, views, and tests |
| **Frontend** | Built React components, API client, auth context |
| **Styling** | Translated Figma designs to Tailwind CSS pixel-perfect |
| **DevOps** | Created Docker Compose and environment configs |
| **Docs** | Generated README, BEYOND.md, and inline comments |

### Key AI Acceleration Points
- **Figma MCP Integration** - Claude could directly read the Figma file, extracting exact hex colors (#FAF1E3, #957139, etc.) and font families (Inria Serif, Inter) without manual copying
- **Type Safety** - Generated TypeScript types matching the Django models, ensuring frontend-backend consistency
- **Best Practices** - Applied patterns like JWT refresh, debounced auto-save, and proper error handling automatically

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## License

This project serves as a proof of concept demonstrating how AI tools (Claude Code) can be integrated with design systems (Figma MCP) for rapid full-stack development.

---

Built as a technical POC for Claude Code + Figma MCP integration
