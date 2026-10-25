import numpy as np
from sklearn.ensemble import IsolationForest

def detect_enrollment_anomalies(series: list[int]):
    if len(series) < 5:
        # Fallback to simple z-score for small series
        mean = np.mean(series) if series else 0
        std = np.std(series) if series else 1
        std = std if std != 0 else 1
        return [
            {
                "index": i,
                "value": val,
                "is_anomaly": bool(abs(val - mean) / std > 2.0),
                "score": float(round(abs(val - mean) / std, 2))
            }
            for i, val in enumerate(series)
        ]

    X = np.array(series).reshape(-1, 1)
    clf = IsolationForest(contamination=0.1, random_state=42)
    preds = clf.fit_predict(X)
    scores = clf.decision_function(X)

    return [
        {
            "index": i,
            "value": series[i],
            "is_anomaly": bool(preds[i] == -1),
            "score": float(round(-scores[i], 3))
        }
        for i in range(len(series))
    ]
