import joblib
import numpy as np
import shap

from ml.common.config import (
    FORECAST_MODEL_FILE,
    get_risk_level
)

from ml.common.utils import (
    calculate_risk_score
)

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
    """
    Main AirShield Member 2 AI engine.

    Combines:

    1. PM2.5 forecasting
    2. Risk classification
    3. SHAP explainability
    4. Source analysis
    5. Pollution trajectory
    6. Plume simulation
    7. Exposure intelligence

    This class provides a single interface for
    frontend/backend integration.
    """

    def __init__(self):

        # ----------------------------------
        # Load trained forecasting model
        # ----------------------------------

        if not FORECAST_MODEL_FILE.exists():

            raise FileNotFoundError(

                "Forecast model not found. "
                "Run: "
                "python -m ml.forecasting.train"
            )

        self.forecast_model = joblib.load(
            FORECAST_MODEL_FILE
        )

        # ----------------------------------
        # Initialize SHAP explainability
        # ----------------------------------

        self.shap_explainer = (
            shap.TreeExplainer(
                self.forecast_model
            )
        )

        # ----------------------------------
        # Initialize AI modules
        # ----------------------------------

        self.source_classifier = (
            PollutionSourceClassifier()
        )

        self.trajectory_model = (
            TrajectoryModel()
        )

        self.plume_simulator = (
            PlumeSimulator()
        )

        self.exposure_model = (
            ExposureModel()
        )

    # ==================================================
    # CREATE FORECAST FEATURES
    # ==================================================

    def create_forecast_features(
        self,
        event
    ):
        """
        Convert an AirShield event into
        the exact 15 features expected
        by the trained XGBoost model.
        """

        pm25 = float(
            event["pm25"]
        )

        dewp = float(
            event["DEWP"]
        )

        temp = float(
            event["TEMP"]
        )

        pres = float(
            event["PRES"]
        )

        wind_speed = float(
            event["Iws"]
        )

        snow = float(
            event["Is"]
        )

        rain = float(
            event["Ir"]
        )

        hour = int(
            event["hour"]
        )

        month = int(
            event["month"]
        )

        wind_direction = event.get(
            "wind_direction",
            "NW"
        )

        # ----------------------------------
        # Cyclical time features
        # ----------------------------------

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

        # ----------------------------------
        # Wind one-hot encoding
        # ----------------------------------

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

        # ----------------------------------
        # Final 15-feature vector
        # ----------------------------------

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

    # ==================================================
    # SHAP EXPLAINABILITY
    # ==================================================

    def explain_prediction(
        self,
        features
    ):
        """
        Generate SHAP feature contributions
        for the PM2.5 prediction.

        Positive SHAP value:
            pushes predicted PM2.5 higher.

        Negative SHAP value:
            pushes predicted PM2.5 lower.

        These values explain the model prediction.
        They are not causal proof.
        """

        shap_values = (
            self.shap_explainer.shap_values(
                features
            )
        )

        shap_values = np.asarray(
            shap_values
        ).reshape(-1)

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

        explanations = {}

        for name, value in zip(
            feature_names,
            shap_values
        ):

            explanations[name] = round(
                float(value),
                4
            )

        # ----------------------------------
        # Sort by absolute contribution
        # ----------------------------------

        explanations = dict(
            sorted(
                explanations.items(),
                key=lambda item: abs(
                    item[1]
                ),
                reverse=True
            )
        )

        return explanations

    # ==================================================
    # MAIN AIRSHIELD ANALYSIS
    # ==================================================

    def analyze(
        self,
        event,
        population,
        schools=None,
        hospitals=None
    ):
        """
        Execute the complete AirShield AI pipeline.

        Pipeline:

        PM2.5 Forecast
              ↓
        Risk Classification
              ↓
        SHAP Explainability
              ↓
        Source Analysis
              ↓
        Trajectory Prediction
              ↓
        Plume Simulation
              ↓
        Exposure Intelligence

        Returns a unified result dictionary.
        """

        schools = schools or []

        hospitals = hospitals or []

        # ==================================
        # 1. PM2.5 FORECAST
        # ==================================

        features = (
            self.create_forecast_features(
                event
            )
        )

        predicted_pm25 = float(
            self.forecast_model.predict(
                features
            )[0]
        )

        predicted_pm25 = max(
            0.0,
            predicted_pm25
        )

        # ==================================
        # 2. RISK CLASSIFICATION
        # ==================================

        risk_level = get_risk_level(
            predicted_pm25
        )

        risk_score = calculate_risk_score(
            predicted_pm25
        )

        # ==================================
        # 3. SHAP EXPLAINABILITY
        # ==================================

        shap_explanation = (
            self.explain_prediction(
                features
            )
        )

        # ==================================
        # 4. SOURCE ANALYSIS
        # ==================================

        source_result = (
            self.source_classifier.classify(
                event
            )
        )

        # ==================================
        # 5. TRAJECTORY
        # ==================================

        trajectory = (
            self.trajectory_model
            .generate_trajectory(

                latitude=event[
                    "latitude"
                ],

                longitude=event[
                    "longitude"
                ],

                wind_speed=event[
                    "wind_speed"
                ],

                wind_direction=event[
                    "wind_direction_degrees"
                ],

                duration_minutes=event.get(
                    "duration_minutes",
                    120
                ),

                interval_minutes=event.get(
                    "interval_minutes",
                    15
                )
            )
        )

        # ==================================
        # 6. PLUME SIMULATION
        # ==================================

        plume = (
            self.plume_simulator
            .generate_plume(
                trajectory
            )
        )

        # ==================================
        # 7. EXPOSURE INTELLIGENCE
        # ==================================

        exposure = (
            self.exposure_model.analyze(

                plume=plume,

                risk_level=risk_level,

                population=population,

                schools=schools,

                hospitals=hospitals
            )
        )

        # ==================================
        # 8. UNIFIED RESULT
        # ==================================

        return {

            # --------------------------------
            # Event
            # --------------------------------

            "event_id":
                event.get(
                    "event_id",
                    "UNKNOWN"
                ),

            # --------------------------------
            # Forecast
            # --------------------------------

            "risk":
                risk_level,

            "risk_score":
                round(
                    risk_score,
                    3
                ),

            "predicted_pm25":
                round(
                    predicted_pm25,
                    2
                ),

            "forecast_horizon":
                "1_hour",

            # --------------------------------
            # SHAP Explanation
            # --------------------------------

            "shap":
                shap_explanation,

            # --------------------------------
            # Source Analysis
            # --------------------------------

            "probable_source":
                source_result[
                    "probable_source"
                ],

            "source_confidence":
                source_result[
                    "source_confidence"
                ],

            "source_scores":
                source_result[
                    "source_scores"
                ],

            # --------------------------------
            # Trajectory
            # --------------------------------

            "trajectory":
                trajectory,

            # --------------------------------
            # Pollution Plume
            # --------------------------------

            "plume":
                plume,

            # --------------------------------
            # Exposure
            # --------------------------------

            "exposure":
                exposure
        }