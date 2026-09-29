import type {
  CitizenReportData,
  Member1Event,
  Member2AIResponse,
} from "../types"


// =====================================================
// API URLS
// =====================================================

const MEMBER1_API_URL =
  import.meta.env.VITE_MEMBER1_API_URL ||
  "http://10.85.245.34:8000"

const MEMBER2_API_URL =
  import.meta.env.VITE_MEMBER2_API_URL ||
  "http://localhost:8000"


// =====================================================
// GOOGLE AI SUPPORTED LANGUAGES
// =====================================================

export type SupportedLanguage =
  | "English"
  | "Tamil"
  | "Hindi"


// =====================================================
// GOOGLE AI RESPONSE
// =====================================================

export interface AIInsightResponse {

  language:
    SupportedLanguage

  ai_insight:
    string

}


// =====================================================
// MEMBER 1 RESPONSE
// =====================================================

export interface Member1EventsResponse {
  total_events: number
  critical: number
  high: number
  moderate: number
  data: Member1Event[]
}


// =====================================================
// GET MEMBER 1 EVENTS
// =====================================================

export async function getMember1Events(): Promise<Member1EventsResponse> {

  try {

    console.log(
      "Connecting to Member 1..."
    )

    const response = await fetch(
      `${MEMBER1_API_URL}/events`,
      {
        signal: AbortSignal.timeout(3000),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Member 1 request failed (${response.status})`
      )
    }

    const data: Member1EventsResponse =
      await response.json()

    console.log(
      "REAL MEMBER 1 DATA:",
      data
    )

    return data

  } catch (error) {

    console.warn(
      "Member 1 unavailable. Using prototype fallback event.",
      error
    )

    // =================================================
    // MEMBER 1 FALLBACK EVENT
    // =================================================

    const fallbackEvent: Member1Event = {

      event_id: "EVT-0001",

      timestamp: "2026-09-26 15:00:00",

      sensor_id: "S1",

      latitude: 10.95115995265754,

      longitude: 76.87363296552432,

      location: "10.95116, 76.87363",

      pm25: 151.83070948843832,

      pm10: 282.42924024055054,

      no2: 72.07022777838449,

      so2: 18.663200386077897,

      co: 0.816365871709513,

      aqi: 190.61165523600687,

      temperature: 36.1684398102715,

      humidity: 66.26379579546412,

      wind_speed: 12.69149085768762,

      wind_direction: 44.25144424753952,

      event_type: "PM2.5 POLLUTION",

      risk_level: "CRITICAL",

      anomaly_score: -0.0369776375251218,

    }

    return {

      total_events: 1,

      critical: 1,

      high: 0,

      moderate: 0,

      data: [
        fallbackEvent,
      ],

    }

  }

}


// =====================================================
// MEMBER 1 IMAGE ANALYSIS
// =====================================================

export async function analyzePollutionImage(
  image: File
) {

  const formData = new FormData()

  formData.append(
    "file",
    image
  )

  const response = await fetch(
    `${MEMBER1_API_URL}/analyze-image`,
    {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(10000),
    }
  )

  if (!response.ok) {

    const errorText =
      await response.text()

    throw new Error(
      `Image analysis failed (${response.status}): ${errorText}`
    )

  }

  return response.json()

}


// =====================================================
// MEMBER 2 API RESPONSE
// =====================================================

interface Member2APIResponse {

  event_id: string

  prediction: {

    predicted_pm25: number

    forecast_horizon: string

    risk_level: string

    risk_score: number

  }

  explainability: {

    method: string

    feature_contributions:
      Record<string, number>

  }

  source_analysis: {

    probable_source: string

    source_confidence: number

    source_scores:
      Record<string, number>

    supporting_features:
      Record<string, number | string>

  }

  trajectory: {

    latitude: number

    longitude: number

    time_minutes: number

  }[]

  plume: {

    latitude: number

    longitude: number

    time_minutes: number

    distance_from_source_km: number

    estimated_width_km: number

  }[]

  exposure: {

    exposure_level: string

    estimated_exposed_population: number

    affected_schools: unknown[]

    affected_hospitals: unknown[]

    school_count: number

    hospital_count: number

  }

}


// =====================================================
// MEMBER 2 AI ANALYSIS
// =====================================================

export async function analyzePollutionEvent(
  event: Member1Event
): Promise<Member2AIResponse> {

  console.log(
    "Sending event to Member 2:",
    event
  )

  try {

    // =================================================
    // TRY REAL MEMBER 2 API
    // =================================================

    const response = await fetch(
      `${MEMBER2_API_URL}/analyze`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          event,
        }),

        signal: AbortSignal.timeout(5000),
      }
    )

    if (!response.ok) {

      throw new Error(
        `Member 2 request failed (${response.status})`
      )

    }

    const data: Member2APIResponse =
      await response.json()

    console.log(
      "REAL MEMBER 2 RESPONSE:",
      data
    )

    return {

      event_id:
        data.event_id,

      risk:
        data.prediction.risk_level,

      risk_score:
        data.prediction.risk_score,

      predicted_pm25:
        data.prediction.predicted_pm25,

      forecast_horizon:
        data.prediction.forecast_horizon,

      shap:
        data.explainability.feature_contributions,

      probable_source:
        data.source_analysis.probable_source,

      source_confidence:
        data.source_analysis.source_confidence,

      source_scores:
        data.source_analysis.source_scores,

      trajectory:
        data.trajectory,

      plume:
        data.plume,

      exposure:
        data.exposure,

    }

  } catch (error) {

    // =================================================
    // MEMBER 2 FALLBACK
    // =================================================

    console.warn(
      "Member 2 unavailable. Using prototype AI result.",
      error
    )

    /*
      Prototype fallback.

      This uses the finalized Member 2 response structure
      so the complete AirShield dashboard can run without
      Member 2's local terminal.
    */

    return {

      event_id:
        event.event_id,

      risk:
        "UNHEALTHY",

      risk_score:
        0.38,

      predicted_pm25:
        113.86,

      forecast_horizon:
        "1_hour",

      shap: {

        "pm2.5":
          34.6916,

        "Iws":
          -8.9502,

        "wind_NE":
          -8.7884,

        "TEMP":
          -7.9887,

        "DEWP":
          4.1223,

        "wind_SE":
          -2.6685,

        "month_cos":
          1.8576,

        "wind_NW":
          1.7198,

        "hour_sin":
          0.91,

        "month_sin":
          -0.8171,

        "Ir":
          0.6969,

        "hour_cos":
          0.4628,

        "PRES":
          -0.2784,

        "Is":
          0.045,

        "wind_cv":
          0.0014,

      },

      probable_source:
        "DUST",

      source_confidence:
        0.4,

      source_scores: {

        TRAFFIC:
          0.191,

        BIOMASS_BURNING:
          0.171,

        INDUSTRIAL:
          0.243,

        DUST:
          0.394,

        MIXED_OR_UNCERTAIN:
          0,

      },

      trajectory: [

        {
          latitude:
            event.latitude,

          longitude:
            event.longitude,

          time_minutes:
            0,
        },

        {
          latitude:
            event.latitude + 0.012263,

          longitude:
            event.longitude + 0.012169,

          time_minutes:
            15,
        },

        {
          latitude:
            event.latitude + 0.024526,

          longitude:
            event.longitude + 0.024338,

          time_minutes:
            30,
        },

        {
          latitude:
            event.latitude + 0.036789,

          longitude:
            event.longitude + 0.036509,

          time_minutes:
            45,
        },

        {
          latitude:
            event.latitude + 0.049052,

          longitude:
            event.longitude + 0.048680,

          time_minutes:
            60,
        },

        {
          latitude:
            event.latitude + 0.061315,

          longitude:
            event.longitude + 0.060850,

          time_minutes:
            75,
        },

        {
          latitude:
            event.latitude + 0.073578,

          longitude:
            event.longitude + 0.073022,

          time_minutes:
            90,
        },

        {
          latitude:
            event.latitude + 0.085841,

          longitude:
            event.longitude + 0.085194,

          time_minutes:
            105,
        },

        {
          latitude:
            event.latitude + 0.098104,

          longitude:
            event.longitude + 0.097366,

          time_minutes:
            120,
        },

      ],

      plume: [

        {
          latitude:
            event.latitude,

          longitude:
            event.longitude,

          time_minutes:
            0,

          distance_from_source_km:
            0,

          estimated_width_km:
            1,
        },

        {
          latitude:
            event.latitude + 0.012263,

          longitude:
            event.longitude + 0.012169,

          time_minutes:
            15,

          distance_from_source_km:
            1.904,

          estimated_width_km:
            1.286,
        },

        {
          latitude:
            event.latitude + 0.024526,

          longitude:
            event.longitude + 0.024338,

          time_minutes:
            30,

          distance_from_source_km:
            3.807,

          estimated_width_km:
            1.571,
        },

        {
          latitude:
            event.latitude + 0.036789,

          longitude:
            event.longitude + 0.036509,

          time_minutes:
            45,

          distance_from_source_km:
            5.711,

          estimated_width_km:
            1.857,
        },

        {
          latitude:
            event.latitude + 0.049052,

          longitude:
            event.longitude + 0.048680,

          time_minutes:
            60,

          distance_from_source_km:
            7.615,

          estimated_width_km:
            2.142,
        },

        {
          latitude:
            event.latitude + 0.061315,

          longitude:
            event.longitude + 0.060850,

          time_minutes:
            75,

          distance_from_source_km:
            9.519,

          estimated_width_km:
            2.428,
        },

        {
          latitude:
            event.latitude + 0.073578,

          longitude:
            event.longitude + 0.073022,

          time_minutes:
            90,

          distance_from_source_km:
            11.422,

          estimated_width_km:
            2.713,
        },

        {
          latitude:
            event.latitude + 0.085841,

          longitude:
            event.longitude + 0.085194,

          time_minutes:
            105,

          distance_from_source_km:
            13.326,

          estimated_width_km:
            2.999,
        },

        {
          latitude:
            event.latitude + 0.098104,

          longitude:
            event.longitude + 0.097366,

          time_minutes:
            120,

          distance_from_source_km:
            15.23,

          estimated_width_km:
            3.284,
        },

      ],

      exposure: {

        exposure_level:
          "MODERATE",

        estimated_exposed_population:
          0,

        affected_schools:
          [],

        affected_hospitals:
          [],

        school_count:
          0,

        hospital_count:
          0,

      },

    }

  }

}


// =====================================================
// GOOGLE GEMINI AI INSIGHT
// =====================================================
//
// This is an ADDITIONAL feature.
//
// It does NOT replace or modify the existing
// Member 2 pollution analysis.
//
// =====================================================

export async function generateAIInsight(
  analysisResult: Member2AIResponse,
  language: SupportedLanguage = "English"
): Promise<AIInsightResponse> {

  console.log(
    "Requesting Google Gemini AI insight:",
    {
      language,
      analysisResult,
    }
  )

  const response = await fetch(
    `${MEMBER2_API_URL}/api/airshield/ai-insight`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        analysis_result:
          analysisResult,

        language:
          language,
      }),

      signal:
        AbortSignal.timeout(30000),
    }
  )

  if (!response.ok) {

    const errorText =
      await response.text()

    throw new Error(
      `Google AI insight request failed (${response.status}): ${errorText}`
    )

  }

  const data:
    AIInsightResponse =
      await response.json()

  console.log(
    "GOOGLE GEMINI AI INSIGHT:",
    data
  )

  return data
}


// =====================================================
// CITIZEN REPORT
// =====================================================

export async function submitCitizenReport(
  report: CitizenReportData
) {

  // If the citizen uploads an image,
  // send it to Member 1 image analysis.

  if (report.image) {

    return analyzePollutionImage(
      report.image
    )

  }

  // Text-only report acknowledgement.

  return {

    status:
      "received",

    pollutionType:
      report.pollutionType,

    location:
      report.location,

    description:
      report.description,

  }

}