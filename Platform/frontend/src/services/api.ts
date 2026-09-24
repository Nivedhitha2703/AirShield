import type { CitizenReportData } from "../types"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

export async function getPollutionEvents() {
  const response = await fetch(`${API_BASE_URL}/api/events`)

  if (!response.ok) {
    throw new Error("Failed to fetch pollution events")
  }

  return response.json()
}

export async function getRiskData(eventId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/risk/${eventId}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch risk data")
  }

  return response.json()
}

export async function submitCitizenReport(
  report: CitizenReportData
) {
  const formData = new FormData()

  formData.append("pollutionType", report.pollutionType)
  formData.append("location", report.location)
  formData.append("description", report.description)

  if (report.image) {
    formData.append("image", report.image)
  }

  const response = await fetch(
    `${API_BASE_URL}/api/citizen-report`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error("Failed to submit citizen report")
  }

  return response.json()
}