# Demo Script – Aaroh (SIH 26263 APAAR Platform)

## Pre-requisites

- All services running (`docker compose up -d`)
- Seed data loaded (`npx prisma db seed`)
- Sample CSV files ready in `data/samples/`

---

## Scene 1: College Login & Dashboard (2 min)

1. Open `http://localhost:5173`
2. Login as **college admin**: `college@demo.edu` / `password123`
3. Show the **College Dashboard** – upload stats, recent activity
4. Highlight i18n toggle (English ↔ Hindi)

## Scene 2: Bulk Upload with Errors (3 min)

1. Navigate to **Bulk Upload**
2. Upload `students_with_errors.csv`
3. Show real-time progress bar
4. View **Validation Errors** page:
   - Invalid APAAR ID format (row 5)
   - Missing date of birth (row 12)
   - Duplicate APAAR ID (row 23 = row 7)
5. Download error report

## Scene 3: Single Student Entry (1 min)

1. Navigate to **Student Form**
2. Fill in a valid student record
3. Show inline validation (Zod)
4. Submit → success toast

## Scene 4: Admin Portal – Anomaly Review (3 min)

1. Logout → Login as **state admin**: `admin@state.gov.in` / `password123`
2. Show **Admin Dashboard** – charts, KPIs
3. Open **Intake Discrepancies** – highlight college exceeding AICTE intake
4. Open **Case Queue** – review a duplicate case
5. Approve / reject / merge with notes

## Scene 5: Verification & Audit (1 min)

1. Open **Verify Record** – search by APAAR ID
2. Show encrypted PII reveal (with audit log entry)
3. Open **Audit Logs** – filter by action type

## Scene 6: Reports & Analytics (1 min)

1. Show **Reports** page – export to PDF/CSV
2. Highlight anomaly detection flags

---

**Total demo time: ~11 minutes**
