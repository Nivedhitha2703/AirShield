import type {
  CitizenReportData,
  Member1EventsResponse,
  Member2AIResponse,
} from "../types"

const MEMBER1_API =
  import.meta.env.VITE_MEMBER1_API_URL || "http://localhost:8001"

const MEMBER2_API =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"


// ============================================================
// MEMBER 1 — GET POLLUTION EVENTS
// ============================================================

export async function getPollutionEvents(): Promise<Member1EventsResponse> {
  const response = await fetch(`${MEMBER1_API}/events`)

  if (!response.ok) {
    throw new Error("Failed to fetch pollution events")
  }

  return response.json()
}


// ============================================================
// MEMBER 2 — ANALYZE EVENT
// Converts the real nested Member 2 response into the
// existing frontend Member2AIResponse structure.
// ============================================================

export async function analyzeEvent(
  event: Member1EventsResponse["data"][number]
): Promise<Member2AIResponse> {

  const response = await fetch(`${MEMBER2_API}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      event,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to analyze pollution event")
  }

  const result = await response.json()

  return {
    event_id: result.event_id,

    risk: result.prediction.risk_level,
    risk_score: result.prediction.risk_score,

    predicted_pm25: result.prediction.predicted_pm25,
    forecast_horizon: result.prediction.forecast_horizon,

    shap: result.explainability.feature_contributions,

    probable_source: result.source_analysis.probable_source,
    source_confidence: result.source_analysis.source_confidence,

    source_scores: result.source_analysis.source_scores,

    trajectory: result.trajectory,

    plume: result.plume,

    exposure: result.exposure,
  }
}


// ============================================================
// CITIZEN REPORT
// ============================================================

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
    `${MEMBER2_API}/api/citizen-report`,
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