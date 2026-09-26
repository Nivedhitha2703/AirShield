import type { CitizenReportData, Member1Event, Member2AIResponse } from "../types"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.1.4:8000"

export interface AirShieldAnalyzeInput {
  event: {
    event_id: string
    latitude: number
    longitude: number
    pm25: number
    DEWP: number
    TEMP: number
    PRES: number
    Iws: number
    Is: number
    Ir: number
    hour: number
    month: number
    wind_direction: string
    wind_speed: number
    wind_direction_degrees: number
    duration_minutes: number
    interval_minutes: number
  }
  population: {
    density_per_km2: number
  }
  schools: unknown[]
  hospitals: unknown[]
}

export async function analyzePollutionEvent(
  input: AirShieldAnalyzeInput
): Promise<Member2AIResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `AirShield AI request failed (${response.status}): ${errorText}`
    )
  }

  return response.json()
}

export async function getPollutionEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`)

  if (!response.ok) {
    throw new Error("Failed to fetch pollution events")
  }

  return response.json()
}

export async function getRiskData(eventId: string) {
  const response = await fetch(`${API_BASE_URL}/api/risk/${eventId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch risk data")
  }

  return response.json()
}

export async function submitCitizenReport(report: CitizenReportData) {
  const formData = new FormData()

  formData.append("pollutionType", report.pollutionType)
  formData.append("location", report.location)
  formData.append("description", report.description)

  if (report.image) {
    formData.append("image", report.image)
  }

  const response = await fetch(`${API_BASE_URL}/api/citizen-report`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to submit citizen report")
  }

  return response.json()
}