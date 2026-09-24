from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from ml.integration.airshield_ai import AirShieldAI


app = FastAPI(
    title="AirShield AI API",
    description="AI-powered hyperlocal pollution intelligence and climate risk analysis API.",
    version="1.0.0",
)


# ---------------------------------------------------------
# Request Models
# ---------------------------------------------------------

class AirQualityEvent(BaseModel):
    event_id: str = "AS-DEMO-001"

    latitude: float
    longitude: float

    pm25: float

    DEWP: float = 18.0
    TEMP: float = 30.0
    PRES: float = 1005.0
    Iws: float = 12.0
    Is: float = 0.0
    Ir: float = 0.0

    hour: int = Field(default=14, ge=0, le=23)
    month: int = Field(default=9, ge=1, le=12)

    wind_direction: str = "NW"
    wind_speed: float = 12.0
    wind_direction_degrees: float = 315.0

    duration_minutes: int = 120
    interval_minutes: int = 15


class AnalyzeRequest(BaseModel):
    event: AirQualityEvent

    population_density: float = 5000.0

    schools: List[dict] = []
    hospitals: List[dict] = []


# ---------------------------------------------------------
# AI Engine
# ---------------------------------------------------------

ai_engine: Optional[AirShieldAI] = None


@app.on_event("startup")
def startup_event():
    global ai_engine
    ai_engine = AirShieldAI()


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "AirShield AI API",
        "ai_engine": "READY" if ai_engine is not None else "NOT_READY",
    }


# ---------------------------------------------------------
# Root
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "name": "AirShield AI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
    }


# ---------------------------------------------------------
# Main AirShield Analysis
# ---------------------------------------------------------

@app.post("/api/airshield/analyze")
def analyze_air_quality(request: AnalyzeRequest):

    if ai_engine is None:
        raise HTTPException(
            status_code=503,
            detail="AirShield AI engine is not initialized."
        )

    try:
        event = request.event.model_dump()

        population = {
            "density": request.population_density
        }

        result = ai_engine.analyze(
            event=event,
            population=population,
            schools=request.schools,
            hospitals=request.hospitals,
        )

        return result

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc)
        )


# ---------------------------------------------------------
# Run directly
# ---------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )