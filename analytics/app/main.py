from fastapi import FastAPI
from app.schemas import FuzzyMatchRequest, FuzzyMatchResponse, AnomalyDetectRequest, AnomalyDetectResponse
from app.fuzzy_match import find_fuzzy_duplicates
from app.anomaly import detect_enrollment_anomalies

app = FastAPI(
    title="APAAR Analytics & Fraud Detection Service",
    description="Microservice providing RapidFuzz deduplication and Isolation Forest anomaly analysis for SIH 26263",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "analytics"}

@app.post("/api/v1/fuzzy-match", response_model=FuzzyMatchResponse)
def fuzzy_match(req: FuzzyMatchRequest):
    matches = find_fuzzy_duplicates(req.name, req.dateOfBirth)
    return {"matches": matches}

@app.post("/api/v1/detect-anomalies", response_model=AnomalyDetectResponse)
def detect_anomalies(req: AnomalyDetectRequest):
    results = detect_enrollment_anomalies(req.intake_series)
    return {"anomalies": results}
