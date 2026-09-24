import joblib

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from ml.forecasting.forecast_model import PM25Forecaster
from ml.forecasting.preprocess import prepare_data

from ml.common.config import (
    REAL_DATASET,
    FORECAST_MODEL_FILE,
    MODEL_METADATA_FILE,
)

from ml.common.utils import (
    save_json,
    ensure_directory,
)


def train_model():
    """
    Train the AirShield PM2.5 forecasting model
    using the real UCI Beijing PM2.5 dataset.
    """

    print("\n======================================")
    print("      AIRSHIELD REAL DATA TRAINING")
    print("======================================")

    # --------------------------------------------------------
    # 1. Check dataset
    # --------------------------------------------------------

    if not REAL_DATASET.exists():
        raise FileNotFoundError(
            f"\nReal dataset not found:\n{REAL_DATASET}"
        )

    print("\nReal dataset found:")
    print(REAL_DATASET)

    # --------------------------------------------------------
    # 2. Prepare dataset
    # --------------------------------------------------------

    X, y, df = prepare_data(REAL_DATASET)

    print("\n======================================")
    print("         DATASET INFORMATION")
    print("======================================")

    print(f"Samples: {len(X)}")
    print(f"Features: {len(X.columns)}")

    print("\nFeatures:")
    for feature in X.columns:
        print(f"  - {feature}")

    print("\nTarget:")
    print("  PM2.5 concentration one hour ahead")

    # --------------------------------------------------------
    # 3. Chronological train/test split
    # --------------------------------------------------------
    #
    # IMPORTANT:
    # For time-series forecasting, we should NOT randomly
    # shuffle historical data.
    #
    # First 80%  -> training
    # Last 20%   -> testing
    #

    split_index = int(len(X) * 0.8)

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]
    y_test = y.iloc[split_index:]

    print("\n======================================")
    print("         TRAIN / TEST SPLIT")
    print("======================================")

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples : {len(X_test)}")

    # --------------------------------------------------------
    # 4. Train XGBoost model
    # --------------------------------------------------------

    forecaster = PM25Forecaster()

    print("\nTraining XGBoost PM2.5 forecasting model...")

    forecaster.train(
        X_train,
        y_train
    )

    # --------------------------------------------------------
    # 5. Generate predictions
    # --------------------------------------------------------

    predictions = forecaster.predict(X_test)

    # --------------------------------------------------------
    # 6. Evaluate model
    # --------------------------------------------------------

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = mean_squared_error(
        y_test,
        predictions
    ) ** 0.5

    r2 = r2_score(
        y_test,
        predictions
    )

    # --------------------------------------------------------
    # 7. Display results
    # --------------------------------------------------------

    print("\n======================================")
    print("       AIRSHIELD MODEL RESULTS")
    print("======================================")

    print(f"MAE  : {mae:.2f}")
    print(f"RMSE : {rmse:.2f}")
    print(f"R²   : {r2:.4f}")

    print("======================================")

    # --------------------------------------------------------
    # 8. Feature importance
    # --------------------------------------------------------

    importance = forecaster.get_feature_importance()

    print("\n======================================")
    print("       FEATURE IMPORTANCE")
    print("======================================")

    sorted_importance = sorted(
        importance.items(),
        key=lambda item: item[1],
        reverse=True
    )

    for feature, value in sorted_importance:
        print(
            f"{feature:15s}: {value:.4f}"
        )

    # --------------------------------------------------------
    # 9. Save model
    # --------------------------------------------------------

    ensure_directory(
        FORECAST_MODEL_FILE.parent
    )

    joblib.dump(
        forecaster.model,
        FORECAST_MODEL_FILE
    )

    # --------------------------------------------------------
    # 10. Save metadata
    # --------------------------------------------------------

    metadata = {
        "model": "XGBoost",
        "dataset": "UCI Beijing PM2.5",
        "target": "PM2.5 next hour",
        "forecast_horizon": "1 hour",
        "training_samples": int(len(X_train)),
        "testing_samples": int(len(X_test)),
        "features": list(X.columns),
        "mae": float(mae),
        "rmse": float(rmse),
        "r2": float(r2),
        "feature_importance": {
            key: float(value)
            for key, value in importance.items()
        },
        "split_method": "chronological 80/20",
    }

    save_json(
        metadata,
        MODEL_METADATA_FILE
    )

    # --------------------------------------------------------
    # 11. Final status
    # --------------------------------------------------------

    print("\n======================================")
    print("          TRAINING COMPLETE")
    print("======================================")

    print("\nModel saved:")
    print(FORECAST_MODEL_FILE)

    print("\nMetadata saved:")
    print(MODEL_METADATA_FILE)

    print("\nAirShield forecasting model is ready.")

    return forecaster


if __name__ == "__main__":
    train_model()