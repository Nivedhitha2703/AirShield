import pandas as pd

# Input from anomaly detection
INPUT_FILE = "member1/data/anomaly_results.csv"

# Output for the next AirShield modules
OUTPUT_FILE = "member1/data/pollution_events.csv"


def classify_risk(row):
    """
    Classify the pollution event based on
    PM2.5, PM10, AQI and anomaly status.
    """

    if row["status"] != "ANOMALY":
        return "LOW"

    if row["aqi"] >= 200 or row["pm25"] >= 150:
        return "CRITICAL"

    if row["aqi"] >= 150 or row["pm25"] >= 100:
        return "HIGH"

    return "MODERATE"


def classify_event(row):
    """
    Identify the primary pollution event.
    """

    if row["pm25"] >= 150:
        return "PM2.5 POLLUTION"

    if row["pm10"] >= 220:
        return "PM10 POLLUTION"

    if row["no2"] >= 70:
        return "NO2 POLLUTION"

    return "GENERAL AIR POLLUTION"


# Load anomaly detection results
df = pd.read_csv(INPUT_FILE)

# Keep only detected anomalies
events = df[df["status"] == "ANOMALY"].copy()

# Determine risk level
events["risk_level"] = events.apply(classify_risk, axis=1)

# Determine pollution event type
events["event_type"] = events.apply(classify_event, axis=1)

# Create a readable location field
events["location"] = (
    events["latitude"].round(5).astype(str)
    + ", "
    + events["longitude"].round(5).astype(str)
)

# Select important information for the AirShield platform
events = events[
    [
        "sensor_id",
        "latitude",
        "longitude",
        "location",
        "pm25",
        "pm10",
        "no2",
        "so2",
        "co",
        "aqi",
        "temperature",
        "humidity",
        "wind_speed",
        "wind_direction",
        "event_type",
        "risk_level",
        "anomaly_score"
    ]
]

# Save pollution events
events.to_csv(OUTPUT_FILE, index=False)

print("\n========== AIRSHIELD DATA FUSION ==========\n")

print(f"Total pollution events: {len(events)}")

print("\nRisk distribution:")
print(events["risk_level"].value_counts())

print("\nDetected events:")

print(
    events[
        [
            "sensor_id",
            "location",
            "event_type",
            "risk_level",
            "pm25",
            "aqi"
        ]
    ].to_string(index=False)
)

print(f"\nPollution events saved to: {OUTPUT_FILE}")