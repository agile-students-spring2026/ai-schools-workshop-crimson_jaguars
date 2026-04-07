# Multi-stage build: compile the React SPA, then bundle into the FastAPI image.

FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS backend
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

COPY backend/pyproject.toml ./
RUN pip install --upgrade pip && pip install fastapi "uvicorn[standard]" httpx

COPY backend/app ./app
COPY --from=frontend /frontend/dist ./app/static

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
