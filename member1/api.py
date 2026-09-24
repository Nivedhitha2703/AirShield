from pathlib import Path
import sys

import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --------------------------------------------------
# Project paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

ANOMALY_FILE = DATA_DIR / "anomaly_results.csv"
EVENT_FILE = DATA_DIR / "pollution_events.csv"
SENSOR_FILE = DATA_DIR / "sensor_data.csv"

UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# --------------------------------------------------
# Import image analysis
# --------------------------------------------------

sys.path.append(str(BASE_DIR))

from image_analysis import analyze_image


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="AirShield Member 1 API",
    description="Pollution detection and environmental intelligence API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# CORS
# Allows Member 2 frontend to communicate with API
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "AirShield Member 1",
        "module": "Pollution Intelligence"
    }


# --------------------------------------------------
# Sensor data
# --------------------------------------------------

@app.get("/sensors")
def get_sensors(limit: int = 50):

    if not SENSOR_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Sensor data not found."
        )

    df = pd.read_csv(SENSOR_FILE)

    limit = max(1, min(limit, 500))

    return {
        "total": len(df),
        "returned": min(limit, len(df)),
        "data": df.head(limit).to_dict(orient="records")
    }


# --------------------------------------------------
# Anomaly results
# --------------------------------------------------

@app.get("/anomalies")
def get_anomalies():

    if not ANOMALY_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Anomaly results not found."
        )

    df = pd.read_csv(ANOMALY_FILE)

    anomalies = df[df["status"] == "ANOMALY"]

    return {
        "total_anomalies": len(anomalies),
        "data": anomalies.to_dict(orient="records")
    }


# --------------------------------------------------
# Pollution events
# --------------------------------------------------

@app.get("/events")
def get_events():

    if not EVENT_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Pollution events not found."
        )

    df = pd.read_csv(EVENT_FILE)

    return {
        "total_events": len(df),
        "critical": int(
            (df["risk_level"] == "CRITICAL").sum()
        ),
        "high": int(
            (df["risk_level"] == "HIGH").sum()
        ),
        "moderate": int(
            (df["risk_level"] == "MODERATE").sum()
        ),
        "data": df.to_dict(orient="records")
    }


# --------------------------------------------------
# Single pollution event
# --------------------------------------------------

@app.get("/events/{sensor_id}")
def get_event_by_sensor(sensor_id: str):

    if not EVENT_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Pollution events not found."
        )

    df = pd.read_csv(EVENT_FILE)

    result = df[
        df["sensor_id"].astype(str).str.upper()
        == sensor_id.upper()
    ]

    if result.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No pollution event found for {sensor_id}"
        )

    return {
        "sensor_id": sensor_id,
        "events": result.to_dict(orient="records")
    }


# --------------------------------------------------
# Image analysis
# --------------------------------------------------

@app.post("/analyze-image")
async def analyze_uploaded_image(
    file: UploadFile = File(...)
):

    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    }

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are supported."
        )

    # Create safe filename
    filename = Path(file.filename).name

    image_path = UPLOAD_DIR / filename

    # Save uploaded image
    contents = await file.read()

    with open(image_path, "wb") as buffer:
        buffer.write(contents)

    # Analyze image
    result = analyze_image(str(image_path))

    return result


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "AirShield",
        "module": "Member 1 - Pollution Intelligence",
        "version": "1.0",
        "endpoints": [
            "/health",
            "/sensors",
            "/anomalies",
            "/events",
            "/events/{sensor_id}",
            "/analyze-image"
        ]
    }