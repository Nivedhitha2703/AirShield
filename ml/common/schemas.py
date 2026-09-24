from dataclasses import dataclass
from typing import List, Dict, Any


@dataclass
class PollutionEvent:

    event_id: str

    latitude: float
    longitude: float

    pm25: float
    pm10: float
    no2: float

    temperature: float
    humidity: float

    wind_speed: float
    wind_direction: float

    event_confidence: float = 0.0


@dataclass
class ForecastResult:

    event_id: str

    predicted_pm25: float

    forecast_horizon: str

    risk_level: str

    confidence: float


@dataclass
class TrajectoryPoint:

    latitude: float
    longitude: float
    time_minutes: int


@dataclass
class AirShieldAIResult:

    event_id: str

    risk: str
    risk_score: float

    predicted_pm25: float

    source: str
    source_confidence: float

    predicted_arrival_minutes: int

    exposed_population: int
    schools: int
    hospitals: int

    trajectory: List[Dict[str, Any]]

    shap: Dict[str, float]