from rapidfuzz import fuzz

# Mock benchmark records for fuzzy comparison
DATABASE_STUDENTS = [
    {"studentId": "STU-001", "name": "Amitabh Suresh Verma", "institution": "Delhi Tech Univ", "dob": "2003-08-14"},
    {"studentId": "STU-002", "name": "Pooja K. Sharma", "institution": "Anna University", "dob": "2004-03-22"},
    {"studentId": "STU-003", "name": "Rohan Rajesh Patil", "institution": "Pune Institute of Tech", "dob": "2003-11-05"},
]

def find_fuzzy_duplicates(target_name: str, dob: str, threshold: float = 85.0):
    results = []
    for s in DATABASE_STUDENTS:
        # Token sort ratio handles swapped first/last names gracefully
        score = fuzz.token_sort_ratio(target_name.lower(), s["name"].lower())
        if score >= threshold:
            results.append({
                "studentId": s["studentId"],
                "name": s["name"],
                "institution": s["institution"],
                "similarityScore": round(float(score), 2)
            })
    return results
