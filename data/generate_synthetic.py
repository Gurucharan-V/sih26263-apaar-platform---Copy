import csv
import random

FIRST_NAMES = ["Aarav", "Vihaan", "Aditya", "Rohan", "Sanya", "Pooja", "Diya", "Ananya", "Kavya", "Rahul"]
LAST_NAMES = ["Sharma", "Verma", "Patil", "Reddy", "Iyer", "Nair", "Gupta", "Malhotra", "Mehta", "Singh"]
PROGRAMMES = ["BTECH-CSE", "BTECH-ECE", "BTECH-MECH", "BTECH-IT", "MCA"]

def generate_apaar_id():
    return "".join(str(random.randint(0, 9)) for _ in range(12))

def create_synthetic_dataset(clean_file, error_file, num_clean=50, num_error=15):
    # 1. Clean dataset
    clean_rows = []
    for i in range(num_clean):
        fname = random.choice(FIRST_NAMES)
        lname = random.choice(LAST_NAMES)
        clean_rows.append({
            "name": f"{fname} {lname}",
            "apaarId": generate_apaar_id(),
            "dateOfBirth": f"{random.randint(2002, 2005)}-0{random.randint(1, 9)}-{random.randint(10, 28)}",
            "gender": random.choice(["male", "female"]),
            "guardianName": f"Rajesh {lname}",
            "email": f"{fname.lower()}.{lname.lower()}{random.randint(10,99)}@gmail.com",
            "contactPhone": f"98{random.randint(10000000, 99999999)}",
            "programmeId": random.choice(PROGRAMMES),
            "enrollmentYear": 2024
        })

    with open(clean_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=clean_rows[0].keys())
        writer.writeheader()
        writer.writerows(clean_rows)

    # 2. Dataset with planted errors
    error_rows = [dict(r) for r in clean_rows[:num_error]]
    # Plant errors
    if len(error_rows) > 0:
        error_rows[0]["apaarId"] = "INVALID_APAAR"  # Invalid APAAR
    if len(error_rows) > 1:
        error_rows[1]["dateOfBirth"] = "2024-99-99"   # Malformed date
    if len(error_rows) > 2:
        error_rows[2]["contactPhone"] = "12345"       # Short phone
    if len(error_rows) > 3:
        error_rows[3]["name"] = ""                    # Blank name
    if len(error_rows) > 4:
        error_rows[4]["apaarId"] = error_rows[3]["apaarId"]  # Intra-batch duplicate

    with open(error_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=error_rows[0].keys())
        writer.writeheader()
        writer.writerows(error_rows)

    print(f"Generated {num_clean} clean rows in {clean_file}")
    print(f"Generated {num_error} error rows in {error_file}")

if __name__ == "__main__":
    create_synthetic_dataset("data/samples/students_clean.csv", "data/samples/students_with_errors.csv")
