AliveAI v2 - Production-like local demo
=======================================

This package contains a production-minded AliveAI v2 prototype:
- Backend: Express + **MongoDB** + Redis (BullMQ queue) + JWT auth
- Frontend: Vite + React demo app with login + dashboard
- Worker: processes video jobs and simulates VEO3 calls
- AI Assistant: Open-source/free provider integration (Ollama + HuggingFace fallback)

> Note: This demo uses MongoDB (NoSQL), not SQL.

Quickstart (Docker)
-------------------
1. Update values inside `backend/.env.example`.
2. Start services:
   `docker compose up --build`
3. Open:
   - Backend API: http://localhost:4000
   - Frontend dev: http://localhost:5173

In Docker mode, `docker-compose.yml` loads environment values from `backend/.env.example` via `env_file`.

Local without Docker
--------------------
1. Start MongoDB & Redis locally.
2. In backend, copy environment file and run:
   - `cp .env.example .env`
   - `npm install && npm run start`
3. In frontend:
   - `npm install && npm run dev`

In local mode, backend reads from `backend/.env` through `dotenv`.

AI Endpoint
-----------
- `POST /ai/assist` (JWT required)
- Body:
  ```json
  {
    "prompt": "kullanıcı istemi",
    "context": ["isteğe bağlı bağlam satırları"]
  }
  ```

The endpoint uses a 5-layer Q#-inspired quantum decision & research mechanism:
1. Intent parsing
2. Research planning
3. Quantum-style branching decision
4. Safety guardrails
5. Verification & confidence scoring

If available, response generation is attempted with:
1. Ollama (open-source local model)
2. HuggingFace Inference API (free tier)
3. Safe fallback text

Notes:
- VEO3 client is a stub. Replace `services/veo3Client.js` with real API calls for production.
- Use secure secrets and HTTPS in real deployment.
