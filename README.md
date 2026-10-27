# Aaroh – SIH 26263 APAAR Platform

> **Smart India Hackathon 2024** – Problem Statement 26263  
> **Aaroh**: One-stop platform for APAAR ID data ingestion, validation, deduplication, and anomaly detection for educational institutions across India.

## 🏗️ Architecture

| Service       | Stack                        | Port  |
|---------------|------------------------------|-------|
| **Frontend**  | React + TypeScript + Vite    | 5173  |
| **Backend**   | Node + Express + TypeScript  | 4000  |
| **Analytics** | Python + FastAPI             | 8000  |
| **Database**  | PostgreSQL 15                | 5432  |
| **Cache**     | Redis 7                      | 6379  |
| **Storage**   | MinIO (S3-compatible)        | 9000  |

## 🚀 Quick Start

```bash
# 1. Clone & configure
cp .env.example .env

# 2. Start all services
docker compose up --build -d

# 3. Run database migrations
cd backend && npx prisma migrate deploy && npx prisma db seed

# 4. Open the app
open http://localhost:5173
```

## 📁 Project Structure

```
frontend/      → React SPA (college & admin dashboards)
backend/       → Express REST API + BullMQ workers
analytics/     → FastAPI micro-service (fuzzy matching, anomaly detection)
data/          → Synthetic test data & CSV templates
tests/         → E2E (Playwright) & Postman collections
deploy/        → Nginx config, backup/restore scripts
docs/          → OpenAPI spec, architecture docs, ER diagram
```

## 👥 Team Responsibilities

| Member | Area                                           |
|--------|-------------------------------------------------|
| 1      | DevOps, deployment, API contract                |
| 2      | Frontend – College portal                       |
| 3      | Frontend – Admin portal                         |
| 4      | Backend – API modules, auth, middleware          |
| 5      | Backend – Engine (parser, validation, dedup)     |
| 6      | Database schema, seed data, E2E tests            |

## 📜 License

This project is built for SIH 2024 evaluation purposes.
