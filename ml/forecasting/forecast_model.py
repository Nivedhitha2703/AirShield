import numpy as np

from xgboost import XGBRegressor

from ml.common.config import (
    FEATURE_COLUMNS,
    TARGET_COLUMN,
    RANDOM_STATE,
    get_risk_level,
)


class PM25Forecaster:

    def __init__(self):

        self.model = XGBRegressor(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            objective="reg:squarederror",
            random_state=RANDOM_STATE,
        )

        self.is_trained = False


    def train(self, X, y):

        self.model.fit(X, y)

        self.is_trained = True


    def predict(self, X):

        if not self.is_trained:

            raise ValueError(
                "Model must be trained before prediction."
            )

        predictions = self.model.predict(X)

        return predictions


    def predict_single(self, values):

        if not self.is_trained:

            raise ValueError(
                "Model must be trained before prediction."
            )

        X = np.array(values).reshape(1, -1)

        prediction = self.model.predict(X)[0]

        return float(prediction)


    def get_risk_level(self, pm25):

        return get_risk_level(pm25)


    def get_feature_importance(self):

        if not self.is_trained:

            raise ValueError(
                "Model must be trained first."
            )

        importance = self.model.feature_importances_

        return dict(
            zip(FEATURE_COLUMNS, importance)
        )