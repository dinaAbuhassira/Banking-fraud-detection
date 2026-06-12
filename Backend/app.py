from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import sqlite3

app = Flask(__name__)
CORS(app)

model = joblib.load("fraud_model.pkl")

def init_db():
    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer TEXT,
            amount REAL,
            hour INTEGER,
            is_international INTEGER,
            location TEXT,
            status TEXT,
            risk_score REAL,
            date TEXT DEFAULT CURRENT_DATE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id INTEGER,
            customer TEXT,
            amount REAL,
            location TEXT,
            risk_score REAL,
            severity TEXT,
            status TEXT DEFAULT 'Pending',
            date TEXT DEFAULT CURRENT_DATE
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    """)

    cursor.execute("""
        INSERT OR IGNORE INTO users (email, password, role)
        VALUES ('admin@gmail.com', 'admin123', 'ADMIN')
    """)

    conn.commit()
    conn.close()
init_db()

@app.route("/")
def home():
    return jsonify({"message": "Fraud Detection Backend is running"})

@app.route("/transactions", methods=["GET"])
def get_transactions():
    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    transactions = []
    for row in rows:
        transactions.append({
            "id": f"#{row[0]}",
            "customer": row[1],
            "amount": f"${row[2]}",
            "hour": row[3],
            "is_international": row[4],
            "location": row[5],
            "status": row[6],
            "risk_score": row[7],
            "date": row[8]
        })

    return jsonify(transactions)

@app.route("/alerts", methods=["GET"])
def get_alerts():
    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    alerts = []
    for row in rows:
        alerts.append({
            "id": row[0],
            "transaction_id": row[1],
            "customer": row[2],
            "amount": f"${row[3]}",
            "location": row[4],
            "riskScore": row[5],
            "severity": row[6],
            "status": row[7],
            "date": row[8]
        })
        

    return jsonify(alerts)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    customer = data.get("customer", "Unknown Customer")
    amount = float(data.get("amount"))
    hour = int(data.get("hour"))
    is_international = int(data.get("is_international"))

    input_data = pd.DataFrame([{
        "amount": amount,
        "hour": hour,
        "is_international": is_international
    }])

    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]

    status = "FRAUD" if prediction == 1 else "SAFE"
    risk_score = round(probability * 100, 2)
    location = "International" if is_international == 1 else "Local"

    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO transactions
        (customer, amount, hour, is_international, location, status, risk_score)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (customer, amount, hour, is_international, location, status, risk_score))

    transaction_id = cursor.lastrowid

    if status == "FRAUD":
        severity = "HIGH" if risk_score >= 80 else "MEDIUM"

        cursor.execute("""
            INSERT INTO alerts
            (transaction_id, customer, amount, location, risk_score, severity)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (transaction_id, customer, amount, location, risk_score, severity))

    conn.commit()
    conn.close()

    return jsonify({
        "transaction_id": transaction_id,
        "fraud": bool(prediction),
        "status": status,
        "risk_score": risk_score,
        "location": location
    })
@app.route("/alerts/<int:alert_id>", methods=["DELETE"])
def delete_alert(alert_id):
    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM alerts WHERE id = ?", (alert_id,))

    conn.commit()
    conn.close()

    return jsonify({"message": "Alert deleted successfully"})
@app.route("/alerts/<int:alert_id>/safe", methods=["PUT"])
def mark_safe(alert_id):
    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT transaction_id FROM alerts WHERE id = ?",
        (alert_id,)
    )

    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"message": "Alert not found"}), 404

    transaction_id = row[0]

    cursor.execute(
        "UPDATE transactions SET status = 'SAFE' WHERE id = ?",
        (transaction_id,)
    )

    cursor.execute(
        "DELETE FROM alerts WHERE id = ?",
        (alert_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Transaction marked as SAFE"})
@app.route("/alerts/<int:alert_id>/block", methods=["PUT"])
def block_transaction(alert_id):
    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT transaction_id FROM alerts WHERE id = ?",
        (alert_id,)
    )

    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"message": "Alert not found"}), 404

    transaction_id = row[0]

    cursor.execute(
        "UPDATE transactions SET status = 'BLOCKED' WHERE id = ?",
        (transaction_id,)
    )

    cursor.execute(
        "DELETE FROM alerts WHERE id = ?",
        (alert_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Transaction blocked successfully"})
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    conn = sqlite3.connect("fraud.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, email, role FROM users WHERE email = ? AND password = ?",
        (email, password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user[0],
                "email": user[1],
                "role": user[2]
            }
        })

    return jsonify({
        "success": False,
        "message": "Invalid email or password"
    }), 401
if __name__ == "__main__":
    app.run(debug=True)