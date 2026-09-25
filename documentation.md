# 📚 Smart Lux - Project Documentation

Welcome to the official documentation for **Smart Lux** — an intelligent, RAG-powered campus assistant platform designed for Dedan Kimathi University of Technology (DeKUT).

---

## 🏗️ Architecture Overview

Smart Lux is built using a **Vertical-Slice (Feature-Based) Architecture** for clear separation of concerns, scalability, and modular maintenance.

```
Smart-Lux/
├── smart-campus/
│   ├── backend/               # FastAPI Backend (Python)
│   │   ├── app/
│   │   │   ├── core/          # Database, Security, Rate Limiting & Config
│   │   │   ├── features/      # Feature modules (chat, campus, academics, etc.)
│   │   │   │   ├── chat/      # RAG engine, Gemini/Grok AI Service, Embeddings
│   │   │   │   ├── campus/    # Location data & SCIT knowledge ingestion
│   │   │   │   ├── academics/ # Course & school directory services
│   │   │   │   └── health/    # System health diagnostics
│   │   │   └── main.py        # FastAPI app entrypoint
│   │   └── requirements.txt
│   └── frontend/              # React + Vite Frontend (TypeScript + Tailwind)
│       ├── src/
│       │   ├── components/    # Reusable UI, Layouts & Auth components
│       │   ├── pages/         # Page routes (Chat, Map, Explore, Docs, Terms)
│       │   ├── services/      # API client & fetch logic
│       │   └── types/         # TypeScript interface contracts
```

---

## ⚡ Key Features

1. **RAG-Powered Campus Q&A**:
   - Hybrid Sparse (Keyword) + Dense Vector (Cosine Similarity) retrieval.
   - Dual AI Providers: **Google Gemini** (Primary) with **xAI / Grok** fallback.
   - Offline fallback: Structured JSON knowledge context if AI APIs are unreachable.

2. **School of Computing & Information Technology (SCIT) Intelligence**:
   - Automatic query routing for computer science, software engineering, labs (Ada Lovelace, Turing), and SCIT faculty offices.

3. **Interactive Campus Map & Directory**:
   - Visual map layout, building pins, categories, and direct contact details for university departments.

4. **Resilient Error Handling**:
   - Zero-crash API architecture with multi-layer try-except fallbacks.
   - Rate limiting (100 req/min per IP) via `slowapi`.
   - Global validation handlers preventing 422 errors from crashing client connections.

---

## 🚀 Getting Started

### Backend Setup (FastAPI)
```bash
cd smart-campus/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup (React + Vite)
```bash
cd smart-campus/frontend
npm install
npm run dev
```

---

## 🛡️ Security & Compliance
- **Input Sanitization**: HTML tags and malicious injection payloads stripped at Pydantic schema validation layer.
- **CORS Protection**: Restricted to configured origins (`settings.CORS_ORIGINS`).
- **Security Headers**: Custom middleware adding `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Content-Security-Policy`.

---

## 📜 License & Copyright
© 2026 **SMART LUX**. All rights reserved. Dedan Kimathi University of Technology.
