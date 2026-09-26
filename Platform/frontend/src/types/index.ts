export interface PollutionEvent {
  event_id: string
  latitude: number
  longitude: number
  pm25: number
  pm10: number
  no2: number
  temperature: number
  humidity: number
  wind_speed: number
  wind_direction: number
  event_confidence: number
}

export interface RiskData {
  event_id: string
  risk: string
  risk_score: number
  source: string
  source_confidence: number
  predicted_arrival_minutes: number
  exposed_population: number
  schools: number
  hospitals: number
  trajectory: [number, number][]
  shap: Record<string, number>
}

export interface Alert {
  id: string
  type: string
  message: string
  severity: string
  time: string
}

export interface EventPassportData {
  eventId: string
  location: string
  detectedAt: string
  pollutant: string
  source: string
  confidence: number
  predictedMovement: string
  exposure: string
  status: string
}

export interface CitizenReportData {
  pollutionType: string
  location: string
  description: string
  image?: File
  id?: string
  timestamp?: string
  status?: string
}