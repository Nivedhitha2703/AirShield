import pandas as pd
import numpy as np

# Reproducible results
np.random.seed(42)

# Number of simulated sensor readings
NUM_READINGS = 200

# Generate normal environmental data
data = {
    "sensor_id": [f"S{i % 10 + 1}" for i in range(NUM_READINGS)],

    "latitude": np.random.uniform(10.90, 11.05, NUM_READINGS),
    "longitude": np.random.uniform(76.85, 77.05, NUM_READINGS),

    "pm25": np.random.normal(55, 15, NUM_READINGS),
    "pm10": np.random.normal(100, 25, NUM_READINGS),
    "no2": np.random.normal(35, 10, NUM_READINGS),
    "so2": np.random.normal(15, 5, NUM_READINGS),
    "co": np.random.normal(0.8, 0.2, NUM_READINGS),

    "temperature": np.random.normal(30, 4, NUM_READINGS),
    "humidity": np.random.normal(65, 10, NUM_READINGS),

    "wind_speed": np.random.uniform(2, 15, NUM_READINGS),
    "wind_direction": np.random.uniform(0, 360, NUM_READINGS),

    "aqi": np.random.normal(90, 20, NUM_READINGS)
}

df = pd.DataFrame(data)

# Make sure pollution values don't become negative
pollution_columns = [
    "pm25",
    "pm10",
    "no2",
    "so2",
    "co",
    "aqi"
]

for column in pollution_columns:
    df[column] = df[column].clip(lower=0)

# --------------------------------------------------
# Inject artificial pollution hotspots
# --------------------------------------------------

# Sensor readings 180-189 represent a pollution event
df.loc[180:189, "pm25"] = np.random.uniform(130, 180, 10)
df.loc[180:189, "pm10"] = np.random.uniform(220, 300, 10)
df.loc[180:189, "no2"] = np.random.uniform(70, 100, 10)
df.loc[180:189, "aqi"] = np.random.uniform(180, 250, 10)

# Save the dataset
output_file = "member1/data/sensor_data.csv"

df.to_csv(output_file, index=False)

print("AirShield sensor dataset generated successfully!")
print(f"Total readings: {len(df)}")
print(f"Saved to: {output_file}")

print("\nSample data:")
print(df.head())

print("\nPollution hotspot readings:")
print(df.loc[180:189, ["sensor_id", "pm25", "pm10", "no2", "aqi"]])