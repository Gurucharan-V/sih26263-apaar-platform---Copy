from pydantic import BaseModel
from typing import List, Optional

class FuzzyMatchRequest(BaseModel):
    name: str
    dateOfBirth: str

class CandidateMatch(BaseModel):
    studentId: str
    name: str
    institution: str
    similarityScore: float

class FuzzyMatchResponse(BaseModel):
    matches: List[CandidateMatch]

class AnomalyDetectRequest(BaseModel):
    intake_series: List[int]

class AnomalyItem(BaseModel):
    index: int
    value: int
    is_anomaly: bool
    score: float

class AnomalyDetectResponse(BaseModel):
    anomalies: List[AnomalyItem]
