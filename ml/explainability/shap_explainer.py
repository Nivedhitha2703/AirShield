import joblib
import numpy as np
import xgboost as xgb

from ml.common.config import (
    FORECAST_MODEL_FILE,
    FEATURE_COLUMNS,
)


class AirShieldSHAPExplainer:
    """
    AirShield SHAP explainability using
    XGBoost's native SHAP contribution calculation.
    """

    def __init__(self):

        if not FORECAST_MODEL_FILE.exists():
            raise FileNotFoundError(
                "Forecast model not found. "
                "Run: python -m ml.forecasting.train"
            )

        self.model = joblib.load(
            FORECAST_MODEL_FILE
        )

    def explain(self, features):

        # Convert features into a 2D NumPy array
        X = np.asarray(
            features,
            dtype=float
        ).reshape(1, -1)

        # Get the underlying XGBoost Booster
        booster = self.model.get_booster()

        # Create DMatrix with the SAME feature names
        # used when the model was trained.
        dmatrix = xgb.DMatrix(
            X,
            feature_names=list(
                FEATURE_COLUMNS
            )
        )

        # Calculate native XGBoost SHAP contributions
        shap_values = booster.predict(
            dmatrix,
            pred_contribs=True
        )

        shap_values = np.asarray(
            shap_values
        )

        # First prediction
        shap_values = shap_values[0]

        # Last value is the bias/base value.
        # The remaining values correspond to
        # the actual 15 features.
        feature_values = shap_values[:-1]

        explanation = {}

        for feature, value in zip(
            FEATURE_COLUMNS,
            feature_values
        ):
            explanation[feature] = round(
                float(value),
                4
            )

        # Sort by absolute contribution
        explanation = dict(
            sorted(
                explanation.items(),
                key=lambda item: abs(
                    item[1]
                ),
                reverse=True
            )
        )

        return explanation


if __name__ == "__main__":

    print("\n======================================")
    print("      AIRSHIELD SHAP EXPLAINABILITY")
    print("======================================")

    explainer = AirShieldSHAPExplainer()

    # Same 15-feature structure used by
    # the trained forecasting model.

    sample_features = [
        142,       # pm2.5
        20,        # DEWP
        30,        # TEMP
        1008,      # PRES
        12,        # Iws
        0,         # Is
        0,         # Ir
        0.0,       # hour_sin
        -1.0,      # hour_cos
        -1.0,      # month_sin
        0.0,       # month_cos
        0,         # wind_NE
        1,         # wind_NW
        0,         # wind_SE
        0,         # wind_cv
    ]

    explanation = explainer.explain(
        sample_features
    )

    print("\nFeature contributions:\n")

    for feature, value in explanation.items():

        direction = (
            "increases prediction"
            if value > 0
            else "decreases prediction"
        )

        print(
            f"{feature:15s} : "
            f"{value:8.4f}  "
            f"({direction})"
        )

    print("\n======================================")
    print("SHAP explainability test completed.")
    print("======================================")