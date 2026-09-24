import joblib
import numpy as np

from ml.common.config import (
    FORECAST_MODEL_FILE,
    FORECAST_HORIZON,
    get_risk_level,
)
from ml.common.utils import calculate_risk_score


class AirShieldPredictor:

    def __init__(self):

        if not FORECAST_MODEL_FILE.exists():
            raise FileNotFoundError(
                "Forecast model not found. "
                "Run: python -m ml.forecasting.train"
            )

        self.model = joblib.load(
            FORECAST_MODEL_FILE
        )

    def create_features(self, event):

        # --------------------------------------------------
        # Basic environmental features
        # --------------------------------------------------

        pm25 = float(event["pm25"])
        dewp = float(event["DEWP"])
        temp = float(event["TEMP"])
        pres = float(event["PRES"])
        wind_speed = float(event["Iws"])
        snow = float(event["Is"])
        rain = float(event["Ir"])

        hour = int(event["hour"])
        month = int(event["month"])

        wind_direction = event.get(
            "wind_direction",
            "NW"
        )

        # --------------------------------------------------
        # Time features
        # --------------------------------------------------

        hour_sin = np.sin(
            2 * np.pi * hour / 24
        )

        hour_cos = np.cos(
            2 * np.pi * hour / 24
        )

        month_sin = np.sin(
            2 * np.pi * month / 12
        )

        month_cos = np.cos(
            2 * np.pi * month / 12
        )

        # --------------------------------------------------
        # Wind direction encoding
        # --------------------------------------------------

        wind_NE = 1 if wind_direction == "NE" else 0
        wind_NW = 1 if wind_direction == "NW" else 0
        wind_SE = 1 if wind_direction == "SE" else 0
        wind_cv = 1 if wind_direction == "cv" else 0

        # --------------------------------------------------
        # EXACT 15 FEATURE ORDER
        # --------------------------------------------------

        features = [
            pm25,
            dewp,
            temp,
            pres,
            wind_speed,
            snow,
            rain,
            hour_sin,
            hour_cos,
            month_sin,
            month_cos,
            wind_NE,
            wind_NW,
            wind_SE,
            wind_cv,
        ]

        return np.array(
            features,
            dtype=float
        ).reshape(1, -1)

    def predict(self, event):

        X = self.create_features(event)

        predicted_pm25 = float(
            self.model.predict(X)[0]
        )

        predicted_pm25 = max(
            0.0,
            predicted_pm25
        )

        risk_level = get_risk_level(
            predicted_pm25
        )

        risk_score = calculate_risk_score(
            predicted_pm25
        )

        return {
            "event_id": event.get(
                "event_id",
                "UNKNOWN"
            ),

            "predicted_pm25": round(
                predicted_pm25,
                2
            ),

            "forecast_horizon": FORECAST_HORIZON,

            "risk_level": risk_level,

            "risk_score": round(
                risk_score,
                3
            ),
        }


if __name__ == "__main__":

    # ------------------------------------------------------
    # SAMPLE AIRSHIELD EVENT
    # ------------------------------------------------------

    sample_event = {

        "event_id": "AS-001",

        "latitude": 10.98,

        "longitude": 76.95,

        # Current PM2.5
        "pm25": 142,

        # UCI weather variables
        "DEWP": 20,

        "TEMP": 30,

        "PRES": 1008,

        "Iws": 12,

        "Is": 0,

        "Ir": 0,

        # Time
        "hour": 14,

        "month": 9,

        # Wind direction
        "wind_direction": "NW",

        # Event confidence
        "event_confidence": 0.89,
    }

    predictor = AirShieldPredictor()

    result = predictor.predict(
        sample_event
    )

    print("\n======================================")
    print("       AIRSHIELD PREDICTION")
    print("======================================")

    for key, value in result.items():

        print(
            f"{key}: {value}"
        )

    print("======================================\n")