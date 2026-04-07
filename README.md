# School District Evaluator

A web app that helps parents and educators compare US public school districts
using publicly-available NCES data. Pick a state, browse its districts ranked by
a composite quality score, and drill into any district for a breakdown of the
factors driving that score.

![architecture](https://img.shields.io/badge/stack-FastAPI%20%2B%20React%2BTS-blue)

## What it does

- **Pick a state** → fetches every district in that state from the NCES Common
  Core of Data (via the [Urban Institute Education Data Portal][urban]).
- **Ranks districts** by a heuristic 0–100 score combining:
  - Student–teacher ratio (50% weight) — lower is better
  - District size (20%) — mid-size districts (1k–10k) score highest
  - Funding context (30%) — proxied by free/reduced-price lunch rate
- **District detail view** shows enrollment, teacher FTE, schools, grades
  served, and a per-factor score breakdown.

Scores are heuristic — they're a starting point for conversation, not a
verdict. The app is upfront about that in the footer.

[urban]: https://educationdata.urban.org/documentation/

## Stack

- **Backend**: Python 3.11 + FastAPI + httpx, async client over the Urban
  Institute Education Data API with in-memory caching.
- **Frontend**: React 18 + TypeScript + Vite. Single-page, responsive,
  zero runtime dependencies beyond React.
- **Deployment**: Single Docker image (multi-stage build). The FastAPI app
  serves the built SPA from `/` and the JSON API from `/api/*`. One-click
  deployable to Render via the included `render.yaml`.

## Run locally

### Backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -e ".[dev]"
.venv/bin/uvicorn app.main:app --reload --port 8000
```

The backend listens on http://127.0.0.1:8000. Try:

- `GET /api/health`
- `GET /api/states`
- `GET /api/districts?state=DE`
- `GET /api/districts/1000200`

### Frontend (dev mode)

```bash
cd frontend
npm install
npm run dev
```

Vite serves the app on http://127.0.0.1:5173 and proxies `/api/*` to the
backend on port 8000.

### One-process mode (frontend baked into backend)

```bash
cd frontend && npm install && npm run build
rm -rf ../backend/app/static && cp -r dist ../backend/app/static
cd ../backend && .venv/bin/uvicorn app.main:app --port 8000
```

Now http://127.0.0.1:8000 serves the full app — UI and API on one port.

## Run with Docker

```bash
docker build -t school-eval .
docker run --rm -p 8000:8000 school-eval
```

Then open http://localhost:8000.

## Deploy to Render

This repo ships with a `render.yaml` blueprint. From the Render dashboard:

1. New → Blueprint → connect this repo.
2. Render reads `render.yaml`, builds the Dockerfile, and deploys it as a
   web service with a health check at `/api/health`.
3. Free plan works fine — no database, no secrets, no API keys.

## Project layout

```
backend/
  app/
    main.py        # FastAPI routes + SPA mount
    services.py    # Async client for the Urban Institute Education Data API
    scoring.py     # Heuristic district quality scoring
    states.py      # US state -> NCES FIPS lookup
  tests/           # pytest suite (mocked HTTP)
  pyproject.toml
frontend/
  src/
    App.tsx        # Main UI: state picker, district list, detail view
    api.ts         # Typed fetch wrappers
    types.ts       # Shared types
    styles.css     # Single-file dark theme
Dockerfile         # Multi-stage: build SPA → bundle into FastAPI image
render.yaml        # Render Blueprint
```

## Data source & limitations

All data comes from the NCES Common Core of Data, surfaced through the
Urban Institute Education Data Portal (free, public, no API key). The
default year is 2022 — the most recent year with complete coverage at the
time of writing.

The score is a **heuristic** built from a small set of structural signals.
It does not capture test outcomes, teacher experience, special programs,
graduation rates, school climate, or many other factors that matter to
families. Treat it as a starting point.
