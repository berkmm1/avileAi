AliveAI v2 - Production-like local demo
=======================================

This package contains a production-minded AliveAI v2 prototype:
- Backend: Express + **MongoDB** + Redis (BullMQ queue) + JWT auth
- Frontend: Vite + React web application (control center dashboard)
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
   - Frontend: http://localhost:5173

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

AI Endpoints
------------
- `POST /ai/assist` (JWT required)
- `GET /ai/quantum-collective-skeleton` (JWT required)
- `GET /ai/v6-benchmark` (JWT required)

`POST /ai/assist` body:
```json
{
  "prompt": "kullanıcı istemi",
  "context": ["isteğe bağlı bağlam satırları"]
}
```

Quantum Collective AI v6
------------------------
Karar alma motoru v6 aşağıdaki genişletmeleri içerir:

1. **Crosstalk ZZ gürültüsü**
   - `H_xt = ξ · Z_i ⊗ Z_{i+1}`
   - Konfigürasyon: `gate=0.008`, `phase=0.004`, `amplitude=0.006`, `crosstalk=0.010`

2. **N-Ajan W-State dolaşıklığı (GHZ→W)**
   - 5 ajan için strict majority: `3/5`

3. **Hiyerarşik mentor protokolü**
   - Score = `0.5*alignment + 0.3*noiseTolerance + 0.2*(1-epsilon)`
   - Tier1(1 lider), Tier2(2 kıdemli), Tier3(2 çırak)

4. **QEC scaffold (3-qubit bit-flip code)**
   - Grover sonrası, ölçüm öncesi sendrom düzeltmesi

5. **4-senaryo benchmark**
   - A: sessiz, B: gürültü, C: gürültü+crosstalk, D: gürültü+crosstalk+QEC

Web UI (Comprehensive)
----------------------
Dashboard artık tek ekranda şunları içerir:
- Video iş yönetimi (oluşturma + listeleme)
- Quantum Assistant (prompt, karar, confidence, mode, majority)
- v6 benchmark paneli
- Quantum Collective mimari paneli (yenilikler, akış, roadmap)

Notes:
- VEO3 client is a stub. Replace `services/veo3Client.js` with real API calls for production.
- Use secure secrets and HTTPS in real deployment.
