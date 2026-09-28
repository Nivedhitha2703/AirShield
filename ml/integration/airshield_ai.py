import joblib
import numpy as np
import pandas as pd
import shap

from ml.common.config import (
    FORECAST_MODEL_FILE,
    get_risk_level
)

from ml.common.utils import calculate_risk_score

from ml.source_analysis.source_classifier import (
    PollutionSourceClassifier
)

from ml.trajectory.trajectory_model import (
    TrajectoryModel
)

from ml.trajectory.plume_simulator import (
    PlumeSimulator
)

from ml.exposure.exposure_model import (
    ExposureModel
)


class AirShieldAI:

    def __init__(self):

        if not FORECAST_MODEL_FILE.exists():

            raise FileNotFoundError(
                "Forecast model not found. "
                "Run: python -m ml.forecasting.train"
            )

        # Load trained forecasting model
        self.forecast_model = joblib.load(
            FORECAST_MODEL_FILE
        )

        # SHAP explainer
        self.shap_explainer = shap.TreeExplainer(
            self.forecast_model
        )

        # Initialize AI modules
        self.source_classifier = PollutionSourceClassifier()

        self.trajectory_model = TrajectoryModel()

        self.plume_simulator = PlumeSimulator()

        self.exposure_model = ExposureModel()


    # =========================================================
    # FORECAST FEATURE CREATION
    # =========================================================

    def create_forecast_features(self, event):

        pm25 = float(
            event["pm25"]
        )

        dewp = float(
            event.get("DEWP", 20.0)
        )

        temp = float(
            event.get(
                "TEMP",
                event.get("temperature", 30.0)
            )
        )

        pres = float(
            event.get("PRES", 1008.0)
        )

        wind_speed = float(
            event.get(
                "Iws",
                event.get("wind_speed", 0.0)
            )
        )

        snow = float(
            event.get("Is", 0.0)
        )

        rain = float(
            event.get("Ir", 0.0)
        )


        # =====================================================
        # TIME FEATURES
        # =====================================================

        if "hour" in event:

            hour = int(
                event["hour"]
            )

        else:

            timestamp = pd.Timestamp(
                event["timestamp"]
            )

            hour = int(
                timestamp.hour
            )


        if "month" in event:

            month = int(
                event["month"]
            )

        else:

            timestamp = pd.Timestamp(
                event["timestamp"]
            )

            month = int(
                timestamp.month
            )


        # =====================================================
        # WIND DIRECTION
        # =====================================================

        wind_direction = event.get(
            "wind_direction",
            "NW"
        )


        # Member 1 provides wind direction
        # as degrees, while the forecasting
        # model expects categories.

        if isinstance(
            wind_direction,
            (
                int,
                float,
                np.integer,
                np.floating
            )
        ):

            degrees = float(
                wind_direction
            ) % 360


            if degrees >= 315 or degrees < 45:

                wind_direction = "NE"

            elif degrees < 135:

                wind_direction = "SE"

            elif degrees < 225:

                wind_direction = "cv"

            else:

                wind_direction = "NW"


        wind_direction = str(
            wind_direction
        )


        # =====================================================
        # CYCLICAL TIME FEATURES
        # =====================================================

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


        # =====================================================
        # WIND ONE-HOT FEATURES
        # =====================================================

        wind_NE = (
            1
            if wind_direction == "NE"
            else 0
        )

        wind_NW = (
            1
            if wind_direction == "NW"
            else 0
        )

        wind_SE = (
            1
            if wind_direction == "SE"
            else 0
        )

        wind_cv = (
            1
            if wind_direction == "cv"
            else 0
        )


        # =====================================================
        # FINAL FEATURE VECTOR
        # =====================================================

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
            wind_cv

        ]


        return np.array(
            features,
            dtype=float
        ).reshape(1, -1)


    # =========================================================
    # SHAP EXPLAINABILITY
    # =========================================================

    def explain_prediction(self, features):

        shap_values = (
            self.shap_explainer.shap_values(
                features
            )
        )

        shap_values = np.asarray(
            shap_values
        )


        if shap_values.ndim > 1:

            shap_values = shap_values[0]


        feature_names = [

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
            "wind_cv"

        ]


        explanation = {}


        for feature, value in zip(
            feature_names,
            shap_values
        ):

            explanation[feature] = round(
                float(value),
                4
            )


        # Sort by absolute contribution
        explanation = dict(
            sorted(
                explanation.items(),
                key=lambda item: abs(item[1]),
                reverse=True
            )
        )


        return explanation


    # =========================================================
    # COMPLETE AIRSHIELD AI ANALYSIS
    # =========================================================

    def analyze(
        self,
        event,
        population=None,
        schools=None,
        hospitals=None
    ):

        if population is None:

            population = {}


        if schools is None:

            schools = []


        if hospitals is None:

            hospitals = []


        # =====================================================
        # 1. FORECAST
        # =====================================================

        features = self.create_forecast_features(
            event
        )


        predicted_pm25 = float(
            self.forecast_model.predict(
                features
            )[0]
        )


        predicted_pm25 = round(
            predicted_pm25,
            2
        )


        # =====================================================
        # 2. RISK ANALYSIS
        # =====================================================

        risk_level = get_risk_level(
            predicted_pm25
        )


        risk_score = round(
            calculate_risk_score(
                predicted_pm25
            ),
            3
        )


        # =====================================================
        # 3. SHAP EXPLANATION
        # =====================================================

        shap_explanation = (
            self.explain_prediction(
                features
            )
        )


        # =====================================================
        # 4. POLLUTION SOURCE ANALYSIS
        # =====================================================

        source_result = (
            self.source_classifier.classify(
                event
            )
        )


        # =====================================================
        # 5. POLLUTION TRAJECTORY
        # =====================================================

        trajectory_result = (
            self.trajectory_model.generate_trajectory(

                latitude=float(
                    event["latitude"]
                ),

                longitude=float(
                    event["longitude"]
                ),

                wind_speed=float(
                    event.get(
                        "wind_speed",
                        event.get(
                            "Iws",
                            0
                        )
                    )
                ),

                wind_direction=float(
                    event.get(
                        "wind_direction_degrees",
                        event.get(
                            "wind_direction",
                            0
                        )
                    )
                ),

                duration_minutes=int(
                    event.get(
                        "duration_minutes",
                        120
                    )
                ),

                interval_minutes=int(
                    event.get(
                        "interval_minutes",
                        15
                    )
                )
            )
        )


        # =====================================================
        # 6. PLUME SIMULATION
        # =====================================================

        plume_result = (
            self.plume_simulator.generate_plume(
                trajectory_result
            )
        )


        # =====================================================
        # 7. EXPOSURE ANALYSIS
        # =====================================================

        exposure_result = (
            self.exposure_model.analyze(

                plume=plume_result,

                risk_level=risk_level,

                population=population,

                schools=schools,

                hospitals=hospitals
            )
        )


        # =====================================================
        # 8. FINAL INTEGRATED RESULT
        # =====================================================

        result = {

            "event_id":
                event.get(
                    "event_id",
                    "UNKNOWN"
                ),

            "prediction": {

                "predicted_pm25":
                    predicted_pm25,

                "forecast_horizon":
                    "1_hour",

                "risk_level":
                    risk_level,

                "risk_score":
                    risk_score
            },

            "explainability": {

                "method":
                    "SHAP",

                "feature_contributions":
                    shap_explanation
            },

            "source_analysis":
                source_result,

            "trajectory":
                trajectory_result,

            "plume":
                plume_result,

            "exposure":
                exposure_result
        }


        return result