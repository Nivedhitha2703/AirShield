from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.integration.airshield_ai import AirShieldAI


# ============================================================
# AIRSHIELD MEMBER 2 AI API
# ============================================================

app = FastAPI(
    title="AirShield Member 2 AI API",
    version="1.0.0",
    description=(
        "AirShield AI prediction and risk intelligence API. "
        "Provides PM2.5 forecasting, SHAP explainability, "
        "pollution source analysis, trajectory, plume and "
        "exposure intelligence."
    ),
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class AnalyzeRequest(BaseModel):

    event: Dict[str, Any]

    # IMPORTANT:
    # AirShield ExposureModel expects population
    # as a dictionary, not an integer.
    population: Dict[str, Any] = Field(
        default_factory=lambda: {
            "density_per_km2": 0
        }
    )

    schools: Optional[List[Dict[str, Any]]] = None

    hospitals: Optional[List[Dict[str, Any]]] = None


# ============================================================
# AI ENGINE
# ============================================================

ai_engine: Optional[AirShieldAI] = None


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
def startup_event():

    global ai_engine

    print("\n==========================================")
    print("      AIRSHIELD MEMBER 2 AI API")
    print("==========================================")

    print("Loading AirShield AI engine...")

    try:

        ai_engine = AirShieldAI()

        print("AirShield AI engine loaded successfully.")

    except Exception as exc:

        print("\nERROR LOADING AIRSHIELD AI ENGINE:")
        print(str(exc))

        raise

    print("==========================================\n")


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "service": "AirShield Member 2 AI API",
        "status": "running",
        "version": "1.0.0",
        "endpoint": "POST /analyze",
        "authentication": "none"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "airshield-member2-ai",
        "ai_engine_loaded": ai_engine is not None
    }


# ============================================================
# MAIN AI ANALYSIS ENDPOINT
# ============================================================

@app.post("/analyze")
def analyze_event(request: AnalyzeRequest):

    # --------------------------------------------------------
    # Check AI engine
    # --------------------------------------------------------

    if ai_engine is None:

        raise HTTPException(
            status_code=503,
            detail="AirShield AI engine is not loaded."
        )

    # --------------------------------------------------------
    # Execute complete AI pipeline
    # --------------------------------------------------------

    try:

        result = ai_engine.analyze(
            event=request.event,
            population=request.population,
            schools=request.schools or [],
            hospitals=request.hospitals or []
        )

        return result

    # --------------------------------------------------------
    # Missing required event field
    # --------------------------------------------------------

    except KeyError as exc:

        raise HTTPException(
            status_code=400,
            detail=f"Missing required event field: {exc}"
        )

    # --------------------------------------------------------
    # Invalid input
    # --------------------------------------------------------

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    # --------------------------------------------------------
    # Unexpected AI pipeline error
    # --------------------------------------------------------

    except Exception as exc:

        print("\n==========================================")
        print("AIRSHIELD ANALYSIS ERROR")
        print("==========================================")
        print(str(exc))
        print("==========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"AirShield analysis failed: {exc}"
        )


# ============================================================
# SERVER ENTRY POINT
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "airshield_api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )