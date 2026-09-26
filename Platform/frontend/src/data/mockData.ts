import type {
  Member1EventsResponse,
  Member2AIResponse,
  Alert,
  EventPassportData,
} from "../types"


// ============================================================
// MEMBER 1 — DEVELOPMENT DATA
// Matches current GET /events response
// ============================================================

export const member1Data: Member1EventsResponse = {
  total_events: 10,

  critical: 9,

  high: 1,

  moderate: 0,

  data: [
    {
      sensor_id: "S1",

      latitude: 10.95115995265754,

      longitude: 76.87363296552432,

      location: "10.95116, 76.87363",

      pm25: 151.83070948843832,

      pm10: 282.42924024050554,

      no2: 72.07022777838449,

      so2: 18.66320038677897,

      co: 0.816365871709513,

      aqi: 190.6115523500687,

      temperature: 36.1684398102715,

      humidity: 66.2637959546412,

      wind_speed: 12.69149085768762,

      wind_direction: 44.25144424753952,

      event_type: "PM2.5 POLLUTION",

      risk_level: "CRITICAL",

      anomaly_score: -0.0369776375251218,
    },
  ],
}


// ============================================================
// MEMBER 2 — DEVELOPMENT DATA
// Matches CURRENT TESTED response
// ============================================================

export const member2Data: Member2AIResponse = {
  event_id: "AS-DEMO-001",

  risk: "UNHEALTHY",

  risk_score: 0.396,

  predicted_pm25: 118.87,

  forecast_horizon: "1_hour",

  shap: {},

  probable_source: "DUST",

  source_confidence: 0.407,

  source_scores: {},

  trajectory: [],

  plume: [],

  exposure: {
    estimated_exposed_population: 49017,

    exposure_level: "MODERATE",

    hospital_count: 0,

    school_count: 0,

    affected_hospitals: [],

    affected_schools: [],
  },
}


// ============================================================
// ALERTS
// ============================================================

export const alerts: Alert[] = [
  {
    id: "ALT-001",

    type: "citizen",

    message:
      "High pollution risk detected in the monitored area.",

    severity: "HIGH",

    time: "Live",
  },

  {
    id: "ALT-002",

    type: "authority",

    message:
      "Critical PM2.5 pollution event detected by sensor S1.",

    severity: "CRITICAL",

    time: "Live",
  },

  {
    id: "ALT-003",

    type: "forecast",

    message:
      "AI forecast predicts elevated PM2.5 during the next 1 hour.",

    severity: "MEDIUM",

    time: "Live",
  },
]


// ============================================================
// EVENT PASSPORT
// ============================================================

export const eventPassport: EventPassportData = {
  eventId: member2Data.event_id,

  location: member1Data.data[0].location,

  detectedAt: "Live detection",

  pollutant: member1Data.data[0].event_type,

  source: member2Data.probable_source,

  confidence: member2Data.source_confidence,

  predictedMovement:
    member2Data.trajectory.length > 1
      ? "Predicted trajectory available"
      : "Trajectory data pending",

  exposure:
    member2Data.exposure.exposure_level,

  status: member1Data.data[0].risk_level,
}