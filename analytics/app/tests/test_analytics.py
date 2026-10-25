from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_fuzzy_match():
    res = client.post("/api/v1/fuzzy-match", json={"name": "Amitav Verma", "dateOfBirth": "2003-08-14"})
    assert res.status_code == 200
    data = res.json()
    assert "matches" in data
    assert len(data["matches"]) > 0
    assert data["matches"][0]["similarityScore"] >= 80

def test_anomaly_detection():
    res = client.post("/api/v1/detect-anomalies", json={"intake_series": [100, 105, 102, 98, 500, 101]})
    assert res.status_code == 200
    items = res.json()["anomalies"]
    assert items[4]["is_anomaly"] is True
