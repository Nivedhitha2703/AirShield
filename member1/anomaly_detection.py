import pandas as pd
from sklearn.ensemble import IsolationForest

# Load sensor data
DATA_FILE = "member1/data/sensor_data.csv"

df = pd.read_csv(DATA_FILE)

# Features used for pollution anomaly detection
features = [
    "pm25",
    "pm10",
    "no2",
    "so2",
    "co",
    "temperature",
    "humidity",
    "wind_speed",
    "aqi"
]

X = df[features]

# Create Isolation Forest model
model = IsolationForest(
    n_estimators=200,
    contamination=0.05,
    random_state=42
)

# Train and predict
df["anomaly_prediction"] = model.fit_predict(X)

# Convert Isolation Forest output:
#  1  = normal
# -1  = anomaly
df["status"] = df["anomaly_prediction"].map({
    1: "NORMAL",
    -1: "ANOMALY"
})

# Anomaly score
df["anomaly_score"] = model.decision_function(X)

# Display results
print("\n========== AIRSHIELD ANOMALY DETECTION ==========\n")

print(f"Total sensor readings: {len(df)}")
print(f"Normal readings: {(df['status'] == 'NORMAL').sum()}")
print(f"Anomalies detected: {(df['status'] == 'ANOMALY').sum()}")

print("\nDetected pollution anomalies:\n")

anomalies = df[df["status"] == "ANOMALY"]

print(
    anomalies[
        [
            "sensor_id",
            "latitude",
            "longitude",
            "pm25",
            "pm10",
            "no2",
            "aqi",
            "status",
            "anomaly_score"
        ]
    ].to_string(index=False)
)

# Save results
OUTPUT_FILE = "member1/data/anomaly_results.csv"

df.to_csv(OUTPUT_FILE, index=False)

print(f"\nResults saved to: {OUTPUT_FILE}")