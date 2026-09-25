# Smart Campus Assistant

Smart Campus Assistant is a university services platform that helps students and staff find campus information, navigate locations, read announcements, access academic guidance, and ask questions through an AI-powered chat experience.

The repository contains a React web application and a FastAPI backend. Campus and academic directory entries can also link directly to official university websites.

## Features

- AI chat for campus and academic questions
- Campus Directory with location search and campus map
- Academic Information, including schools, departments, registration, and examinations
- Announcements and campus service categories
- Campus knowledge-base storage, document ingestion, chunking, and embeddings
- PostgreSQL-backed backend services
- API rate limiting, CORS configuration, security headers, and input sanitisation
- Responsive frontend with client-side routing

## Technology

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React icons

### Backend

- Python 3.11+
- FastAPI and Uvicorn
- Pydantic Settings
- SQLAlchemy and PostgreSQL
- Google Gemini or Groq-compatible AI provider
- `slowapi` rate limiting
- Pytest and HTTPX

## Repository structure

```text
Smart-Lux/
├── README.md
└── smart-campus/
	├── frontend/
	│   ├── src/
	│   │   ├── components/   # Reusable UI and layout components
	│   │   ├── data/         # Campus, academic, announcement, and service data
	│   │   ├── pages/        # Routed application screens
	│   │   ├── services/     # Frontend API client
	│   │   ├── types/        # Shared TypeScript types
	│   │   └── App.tsx       # Frontend route definitions
	│   └── package.json
	└── backend/
		├── app/
		│   ├── core/         # Configuration, database, and security
		│   ├── features/     # Feature routers, schemas, and services
		│   └── main.py       # FastAPI application entry point
		├── tests/
		└── requirements.txt
```

## Prerequisites

- Node.js and npm
- Python 3.11 or later
- PostgreSQL for knowledge-base and retrieval features
- An AI provider API key for chat responses

## Configuration

Backend settings are loaded from `smart-campus/backend/.env`. The application has local development defaults for most values, but chat and database-backed features require explicit configuration.

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smart_campus
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
AI_MODEL=gemini-2.5-flash
CORS_ORIGINS=["http://localhost:5173"]
RATE_LIMIT=10/minute
```

For Groq-compatible chat, use `AI_PROVIDER=grok` and configure `GROK_API_KEY`, `GROK_MODEL`, and `GROK_BASE_URL` instead.

## Run the application

Open two terminals from the repository root.

### 1. Start the backend

```bash
cd smart-campus/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at `http://localhost:8000`. Interactive API documentation is available at `http://localhost:8000/docs`.

### 2. Start the frontend

```bash
cd smart-campus/frontend
npm install
npm run dev
```

The web application is available at `http://localhost:5173`.

## Frontend routes

| Route | Purpose |
| --- | --- |
| `/` | Home dashboard |
| `/chat` | AI campus assistant |
| `/explore` | Explore campus services and information |
| `/campus` | Campus Directory and location search |
| `/map` | Campus map |
| `/announcements` | Campus announcements |
| `/academics` | Academic Information |
| `/login` | Temporary mock sign-in flow |
| `/profile` | Temporary mock user profile and preferences |

## Backend API

All API routes are prefixed with `/api`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Generate an AI campus response |
| `GET` | `/api/campus` | List campus locations |
| `GET` | `/api/campus/locations/{location_id}` | Get one campus location |
| `GET` | `/api/campus/knowledge` | List knowledge-base items |
| `POST` | `/api/campus/knowledge` | Add a knowledge-base item |
| `POST` | `/api/campus/ingest-document` | Chunk and index a document |
| `GET` | `/api/academics` | Get academic information |
| `GET` | `/api/announcements` | List announcements |

## Development commands

Run these from `smart-campus/frontend`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

Run backend tests from `smart-campus/backend` with the virtual environment activated:

```bash
pytest
```

## Architecture notes

The backend uses a feature-based structure. Each feature generally owns its router, schemas, and service implementation under `backend/app/features/`. The main application registers those routers under the `/api` prefix and applies shared middleware for CORS, security headers, and rate limiting.

Frontend content that is part of the directory and academic experience is kept in `frontend/src/data/`, while reusable presentation components live under `frontend/src/components/`.
