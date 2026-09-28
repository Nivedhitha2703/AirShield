import joblib
import numpy as np
import shap

from ml.common.config import (
    FORECAST_MODEL_FILE,
    FEATURE_COLUMNS,
)


class AirShieldSHAPExplainer:

    def __init__(self):

        if not FORECAST_MODEL_FILE.exists():
            raise FileNotFoundError(
                "Forecast model not found. "
                "Run: python -m ml.forecasting.train"
            )

        self.model = joblib.load(
            FORECAST_MODEL_FILE
        )

        self.explainer = shap.TreeExplainer(
            self.model
        )

    def explain(self, features):

        # Convert features into numpy array
        X = np.array(
            features,
            dtype=float
        ).reshape(1, -1)

        # Calculate SHAP values
        shap_values = self.explainer.shap_values(
            X
        )

        # Convert to 1D array
        if isinstance(shap_values, list):
            shap_values = shap_values[0]

        shap_values = np.asarray(
            shap_values
        ).reshape(-1)

        explanation = {}

        for feature, value in zip(
            FEATURE_COLUMNS,
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