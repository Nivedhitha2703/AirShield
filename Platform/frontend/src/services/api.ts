
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
      MEMBER1_API_URL + "/events",
      {
        signal: AbortSignal.timeout(3000),
      }
    )

    if (!response.ok) {

      throw new Error(
        "Member 1 request failed (" +
        response.status +
        ")"
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

    const fallbackEvent: Member1Event = {

      event_id:
        "EVT-0001",

      timestamp:
        "2026-09-26 15:00:00",

      sensor_id:
        "S1",

      latitude:
        10.95115995265754,

      longitude:
        76.87363296552432,

      location:
        "10.95116, 76.87363",

      pm25:
        151.83070948843832,

      pm10:
        282.42924024055054,

      no2:
        72.07022777838449,

      so2:
        18.663200386077897,

      co:
        0.816365871709513,

      aqi:
        190.61165523600687,

      temperature:
        36.1684398102715,

      humidity:
        66.26379579546412,

      wind_speed:
        12.69149085768762,

      wind_direction:
        44.25144424753952,

      event_type:
        "PM2.5 POLLUTION",

      risk_level:
        "CRITICAL",

      anomaly_score:
        -0.0369776375251218,

    }

    return {

      total_events:
        1,

      critical:
        1,

      high:
        0,

      moderate:
        0,

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

  const formData =
    new FormData()

  formData.append(
    "file",
    image
  )

  const response = await fetch(
    MEMBER1_API_URL + "/analyze-image",
    {
      method:
        "POST",

      body:
        formData,

      signal:
        AbortSignal.timeout(10000),
    }
  )

  if (!response.ok) {

    const errorText =
      await response.text()

    throw new Error(
      "Image analysis failed (" +
      response.status +
      "): " +
      errorText
    )

  }

  return response.json()

}


// =====================================================
// MEMBER 2 API RESPONSE
// =====================================================

interface Member2APIResponse {

  event_id:
    string

  risk:
    string

  risk_score:
    number

  predicted_pm25:
    number

  forecast_horizon:
    string

  shap?:
    Record<string, number>

  probable_source?:
    string

  source_confidence?:
    number

  source_analysis?: {

    probable_source:
      string

    source_confidence:
      number

    source_scores:
      Record<string, number>

    supporting_features:
      Record<string, number | string>

  }

  source_scores?:
    Record<string, number>

  trajectory?: {

    latitude:
      number

    longitude:
      number

    time_minutes:
      number

  }[]

  plume?: {

    latitude:
      number

    longitude:
      number

    time_minutes:
      number

    distance_from_source_km:
      number

    estimated_width_km:
      number

  }[]

  exposure?: {

    exposure_level:
      string

    estimated_exposed_population:
      number

    affected_schools:
      unknown[]

    affected_hospitals:
      unknown[]

    school_count:
      number

    hospital_count:
      number

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

    const response = await fetch(
      MEMBER2_API_URL +
      "/api/airshield/analyze",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({

            event: {

              event_id:
                event.event_id,

              latitude:
                event.latitude,

              longitude:
                event.longitude,

              pm25:
                event.pm25,

              wind_speed:
                event.wind_speed,

              wind_direction:
                "NW",

              wind_direction_degrees:
                event.wind_direction,

              TEMP:
                event.temperature,

            },

          }),

        signal:
          AbortSignal.timeout(60000),
      }
    )

    if (!response.ok) {

      const errorText =
        await response.text()

      throw new Error(
        "Member 2 request failed (" +
        response.status +
        "): " +
        errorText
      )

    }

    const data:
      Member2APIResponse =
        await response.json()

    console.log(
      "REAL MEMBER 2 RESPONSE:",
      data
    )

    return {

      event_id:
        data.event_id,

      risk:
        data.risk,

      risk_score:
        data.risk_score,

      predicted_pm25:
        data.predicted_pm25,

      forecast_horizon:
        data.forecast_horizon,

      shap:
        data.shap ?? {},

      probable_source:
        data.source_analysis?.probable_source ??
        data.probable_source ??
        "UNKNOWN",

      source_confidence:
        data.source_analysis?.source_confidence ??
        data.source_confidence ??
        0,

      source_scores:
        data.source_analysis?.source_scores ??
        data.source_scores ??
        {},

      trajectory:
        data.trajectory ?? [],

      plume:
        data.plume ?? [],

      exposure:
        data.exposure ?? {

          exposure_level:
            "UNKNOWN",

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

  } catch (error) {

    console.warn(
      "Member 2 unavailable. Using prototype AI result.",
      error
    )

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

      trajectory:
        [],

      plume:
        [],

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
// GEMINI GENERATIVE AI
// =====================================================

export interface GeminiAIResponse {

  insight:
    string

  language?:
    string

  model?:
    string

}


export async function generateAIInsight(
  analysisResult: Member2AIResponse,
  language: string = "English"
): Promise<GeminiAIResponse> {

  console.log(
    "Sending analysis to Gemini:",
    analysisResult
  )

  try {

    const response = await fetch(
      MEMBER2_API_URL +
      "/api/airshield/ai-insight",
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({

            analysis_result:
              analysisResult,

            language:
              language,

          }),

        signal:
          AbortSignal.timeout(15000),

      }
    )

    if (!response.ok) {

      const errorText =
        await response.text()

      throw new Error(
        "Gemini request failed (" +
        response.status +
        "): " +
        errorText
      )

    }

    const data =
      await response.json()

    console.log(
      "REAL GEMINI RESPONSE:",
      data
    )

    return data

  } catch (error) {

    console.error(
      "Gemini AI unavailable:",
      error
    )

    throw error

  }

}


// =====================================================
// CITIZEN REPORT
// =====================================================

export async function submitCitizenReport(
  report: CitizenReportData
) {

  if (report.image) {

    return analyzePollutionImage(
      report.image
    )

  }

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

