# Architecture – APAAR Platform

## High-Level Overview

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   Browser    │───▶│   Nginx      │───▶│   Frontend   │
│   (React)    │    │   Reverse    │    │   Vite SPA   │
└─────────────┘    │   Proxy      │    └──────────────┘
                   │              │
                   │              │───▶┌──────────────┐    ┌────────┐
                   └──────────────┘    │   Backend    │───▶│ Postgres│
                                       │   Express    │    └────────┘
                                       │              │───▶┌────────┐
                                       │              │    │ Redis  │
                                       └──────┬───────┘    └────────┘
                                              │
                                              │───▶┌────────┐
                                              │    │ MinIO  │
                                              │    └────────┘
                                              │
                                       ┌──────▼───────┐
                                       │  Analytics   │
                                       │  FastAPI     │
                                       └──────────────┘
```

## Data Flow: CSV Upload → Validated Records

1. **Upload** – College user uploads CSV via the frontend.
2. **Queue** – Backend stores the file in MinIO, enqueues a BullMQ job.
3. **Parse** – Worker reads file, maps headers via `headerMapper.ts`.
4. **Validate** – Each row is checked against `rules.ts` and `apaarFormat.ts`.
5. **Deduplicate** – Exact match in Postgres; fuzzy match via Analytics service.
6. **Intake Check** – `intakeCalculator.ts` compares totals against AICTE approved intake.
7. **Flag** – Discrepancies and duplicates create Cases for admin review.
8. **Notify** – Alerts sent to relevant stakeholders.

## Security

- **JWT** with short-lived access tokens and refresh tokens.
- **RBAC** middleware enforces `college_admin`, `state_admin`, `super_admin` roles.
- **Audit logging** on every write operation.
- **AES-256-GCM** encryption for PII at rest; HMAC for APAAR ID indexing.
- **Rate limiting** per IP and per user.

## Database

See `prisma/schema.prisma` for the full schema and `docs/er-diagram.png` for the visual ER diagram.

### Key Tables

| Table             | Purpose                                   |
|-------------------|-------------------------------------------|
| `users`           | Platform accounts with roles              |
| `institutions`    | Colleges / universities                   |
| `programmes`      | Courses with AICTE intake limits          |
| `students`        | Core student records (encrypted PII)      |
| `uploads`         | File upload tracking                      |
| `upload_rows`     | Per-row validation results                |
| `cases`           | Flagged duplicates / anomalies            |
| `audit_logs`      | Immutable action trail                    |
| `intake_snapshots`| Periodic intake vs. actual counts         |

## Analytics Micro-service

- **Fuzzy matching** – RapidFuzz (token_sort_ratio, partial_ratio) to find near-duplicate student names.
- **Anomaly detection** – Isolation Forest for detecting outlier enrollment patterns; z-score for statistical flagging.
