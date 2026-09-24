# Smart Campus Assistant

This repository contains a production-quality prototype for a campus assistant experience focused on university services, campus navigation, announcements, and academic guidance.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + React Router
- Backend: Python + FastAPI

## Project structure

- frontend/: Vite React application
- backend/: FastAPI foundation for API routes, schemas, and services

## Run the frontend

```bash
cd smart-campus/frontend
npm install
npm run dev
```

## Run the backend

```bash
cd smart-campus/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
