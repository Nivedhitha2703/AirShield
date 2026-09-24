import pandas as pd
import numpy as np

from ml.common.config import TARGET_COLUMN


# Real UCI dataset
REAL_DATASET_COLUMNS = [
    "No",
    "year",
    "month",
    "day",
    "hour",
    "pm2.5",
    "DEWP",
    "TEMP",
    "PRES",
    "cbwd",
    "Iws",
    "Is",
    "Ir",
]


def load_dataset(filepath):
    """Load the UCI Beijing PM2.5 dataset."""

    df = pd.read_csv(filepath)

    print("\nDataset loaded successfully.")
    print("Rows:", len(df))
    print("Columns:", list(df.columns))

    return df


def create_datetime(df):
    """Create a proper timestamp from year/month/day/hour."""

    df = df.copy()

    df["timestamp"] = pd.to_datetime(
        {
            "year": df["year"],
            "month": df["month"],
            "day": df["day"],
            "hour": df["hour"],
        }
    )

    return df


def encode_wind_direction(df):
    """Convert categorical wind direction into numeric features."""

    df = df.copy()

    # One-hot encode wind direction.
    wind_dummies = pd.get_dummies(
        df["cbwd"],
        prefix="wind",
        dtype=int
    )

    df = pd.concat([df, wind_dummies], axis=1)

    return df


def create_time_features(df):
    """Create useful time-based forecasting features."""

    df = df.copy()

    df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
    df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)

    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)

    return df


def create_target(df):
    """
    Create the 1-hour-ahead PM2.5 forecasting target.

    Current row:
        PM2.5 at time t

    Target:
        PM2.5 at time t + 1 hour
    """

    df = df.copy()

    df[TARGET_COLUMN] = df["pm2.5"].shift(-1)

    return df


def clean_dataset(df):
    """Clean and validate the real dataset."""

    df = df.copy()

    # Replace invalid infinite values.
    df = df.replace([np.inf, -np.inf], np.nan)

    # Numeric columns.
    numeric_columns = [
        "pm2.5",
        "DEWP",
        "TEMP",
        "PRES",
        "Iws",
        "Is",
        "Ir",
        TARGET_COLUMN,
    ]

    for column in numeric_columns:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Remove rows where current or future PM2.5 is unavailable.
    df = df.dropna(
        subset=[
            "pm2.5",
            TARGET_COLUMN
        ]
    )

    # Remove physically invalid PM2.5 values.
    df = df[df["pm2.5"] >= 0]
    df = df[df[TARGET_COLUMN] >= 0]

    return df


def prepare_data(filepath):
    """Complete preprocessing pipeline."""

    # 1. Load
    df = load_dataset(filepath)

    # 2. Create timestamp
    df = create_datetime(df)

    # 3. Create 1-hour target
    df = create_target(df)

    # 4. Create wind-direction features
    df = encode_wind_direction(df)

    # 5. Create time features
    df = create_time_features(df)

    # 6. Clean
    df = clean_dataset(df)

    # Features used by the model.
    feature_columns = [
        "pm2.5",
        "DEWP",
        "TEMP",
        "PRES",
        "Iws",
        "Is",
        "Ir",
        "hour_sin",
        "hour_cos",
        "month_sin",
        "month_cos",
    ]

    # Add wind-direction columns.
    wind_columns = [
        column
        for column in df.columns
        if column.startswith("wind_")
    ]

    feature_columns.extend(wind_columns)

    X = df[feature_columns]
    y = df[TARGET_COLUMN]

    return X, y, df


def create_demo_dataset(filepath, rows=500):
    """
    Kept only as a fallback for testing.

    The real UCI dataset should be used for AirShield model development.
    """

    np.random.seed(42)

    timestamps = pd.date_range(
        start="2026-01-01",
        periods=rows,
        freq="h"
    )

    pm25 = np.random.uniform(20, 250, rows)
    dewp = np.random.uniform(-20, 20, rows)
    temp = np.random.uniform(0, 40, rows)
    pres = np.random.uniform(990, 1030, rows)
    wind_speed = np.random.uniform(1, 20, rows)
    snow = np.random.uniform(0, 2, rows)
    rain = np.random.uniform(0, 5, rows)

    future_pm25 = (
        pm25 * 0.65
        + dewp * 0.2
        + temp * 0.1
        - wind_speed * 1.2
        + np.random.normal(0, 8, rows)
    )

    future_pm25 = np.maximum(future_pm25, 0)

    df = pd.DataFrame({
        "timestamp": timestamps,
        "pm2.5": pm25,
        "DEWP": dewp,
        "TEMP": temp,
        "PRES": pres,
        "Iws": wind_speed,
        "Is": snow,
        "Ir": rain,
        "cbwd": "NW",
    })

    df[TARGET_COLUMN] = future_pm25

    filepath.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        filepath,
        index=False
    )

    print("\nDemo dataset created:")
    print(filepath)

    return df