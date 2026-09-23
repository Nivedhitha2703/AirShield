from pathlib import Path


# ============================================================
# AIRSHIELD PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

ML_ROOT = PROJECT_ROOT / "ml"

FORECASTING_DIR = ML_ROOT / "forecasting"
DATA_DIR = FORECASTING_DIR / "data"
MODEL_DIR = FORECASTING_DIR / "models"

TRAJECTORY_DIR = ML_ROOT / "trajectory"

EXPLAINABILITY_DIR = ML_ROOT / "explainability"


# ============================================================
# DATASET PATHS
# ============================================================

REAL_DATASET = (
    DATA_DIR
    / "beijing+pm2+5+data"
    / "PRSA_data_2010.1.1-2014.12.31.csv"
)

DEFAULT_DATASET = DATA_DIR / "air_quality.csv"


# ============================================================
# MODEL FILES
# ============================================================

FORECAST_MODEL_FILE = (
    MODEL_DIR / "pm25_xgboost_model.joblib"
)

MODEL_METADATA_FILE = (
    MODEL_DIR / "model_metadata.json"
)


# ============================================================
# MODEL CONFIGURATION
# ============================================================

TARGET_COLUMN = "pm25_next_hour"

FORECAST_HORIZON = "1_hour"

RANDOM_STATE = 42

TEST_SIZE = 0.2


# ============================================================
# COMPLETE MODEL FEATURE LIST
# ============================================================
#
# IMPORTANT:
# The trained XGBoost model uses 15 features.
#
# 11 numerical/time features
# +
# 4 wind-direction encoded features
#
# The order MUST remain identical to the training data
# and prediction pipeline.
# ============================================================

FEATURE_COLUMNS = [
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
    "wind_NE",
    "wind_NW",
    "wind_SE",
    "wind_cv",
]


# ============================================================
# RISK LEVEL CALCULATION
# ============================================================
#
# Prototype AirShield risk categorization based directly
# on predicted PM2.5 concentration.
#
# These thresholds are project-level prototype thresholds.
# Do not present them as an official AQI standard unless
# later aligned with the required jurisdictional standard.
# ============================================================

def get_risk_level(pm25: float) -> str:

    pm25 = float(pm25)

    if pm25 <= 30:
        return "GOOD"

    elif pm25 <= 60:
        return "MODERATE"

    elif pm25 <= 90:
        return "UNHEALTHY_FOR_SENSITIVE_GROUPS"

    elif pm25 <= 120:
        return "UNHEALTHY"

    elif pm25 <= 250:
        return "VERY_UNHEALTHY"

    else:
        return "HAZARDOUS"