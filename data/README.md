# Synthetic Test Data & Planted Error Matrix

This folder contains realistic student demographic and enrollment datasets designed for testing the APAAR data pipeline.

## Planted Errors in `students_with_errors.csv`

| Row | Planted Anomaly | Intended Pipeline Behavior |
|-----|-----------------|----------------------------|
| 1   | `INVALID_APAAR` | Caught by `apaarFormat.ts` regex & Verhoeff check |
| 2   | Malformed date `1990-99-99` | Caught by `rules.ts` Date validator |
| 3   | Short phone `12345` | Caught by `rules.ts` 10-digit mobile check |
| 4   | Blank student name | Caught by `rules.ts` non-empty name check |
| 5   | Duplicate APAAR matching Row 4 | Flagged by `exactMatch.ts` duplicate engine |

## Running Synthetic Data Generator

```bash
python generate_synthetic.py
```
