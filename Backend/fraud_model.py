import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("fraud_dataset.csv")

X = data[["amount", "hour", "is_international"]]
y = data["fraud"]

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, "fraud_model.pkl")

print("Model trained and saved successfully")