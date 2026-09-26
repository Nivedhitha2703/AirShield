import type {
  PollutionEvent,
  RiskData,
  Alert,
  EventPassportData,
} from "../types"

export const pollutionEvent: PollutionEvent = {
  event_id: "AS-001",
  latitude: 10.98,
  longitude: 76.95,
  pm25: 142,
  pm10: 218,
  no2: 74,
  temperature: 39,
  humidity: 68,
  wind_speed: 12,
  wind_direction: 45,
  event_confidence: 0.89,
}

export const riskData: RiskData = {
  event_id: "AS-001",
  risk: "HIGH",
  risk_score: 0.91,
  source: "Agricultural burning",
  source_confidence: 0.67,
  predicted_arrival_minutes: 92,
  exposed_population: 18400,
  schools: 4,
  hospitals: 2,
  trajectory: [
    [10.98, 76.95],
    [11.0, 76.98],
    [11.03, 77.01],
    [11.06, 77.04],
  ],
  shap: {
    "PM2.5": 31,
    "Satellite anomaly": 24,
    Wind: 18,
    NO2: 13,
    History: 8,
  },
}

export const alerts: Alert[] = [
  {
    id: "ALT-001",
    type: "citizen",
    message: "High pollution predicted in your area within 90 minutes.",
    severity: "HIGH",
    time: "2 min ago",
  },
  {
    id: "ALT-002",
    type: "authority",
    message: "Pollution event detected near Industrial Zone A.",
    severity: "SEVERE",
    time: "5 min ago",
  },
  {
    id: "ALT-003",
    type: "forecast",
    message: "Pollution plume is moving towards the northeast.",
    severity: "MEDIUM",
    time: "8 min ago",
  },
]

export const eventPassport: EventPassportData = {
  eventId: "AS-2026-001",
  location: "Industrial Corridor",
  detectedAt: "10:05 AM",
  pollutant: "PM2.5 + NO₂",
  source: "Possible combustion",
  confidence: 0.89,
  predictedMovement: "NE",
  exposure: "HIGH",
  status: "ACTIVE",
}