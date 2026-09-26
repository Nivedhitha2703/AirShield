import { useEffect, useState } from "react"

import Header from "../components/Header"
import PollutionMap from "../components/PollutionMap"
import RiskDashboard from "../components/RiskDashboard"
import EventPanel from "../components/EventPanel"
import AlertsPanel from "../components/AlertsPanel"
import CitizenReport from "../components/CitizenReport"
import ShapChart from "../components/ShapChart"
import ResponsePanel from "../components/ResponsePanel"
import EventPassport from "../components/EventPassport"

import {
  analyzePollutionEvent,
  type AirShieldAnalyzeInput,
} from "../services/api"

import type {
  Member1Event,
  Member2AIResponse,
} from "../types"

import {
  alerts,
  member2Data as fallbackRisk,
} from "../data/mockData"


function Dashboard() {

  /* =====================================================
     REAL MEMBER 1 SENSOR DATA — S1
  ===================================================== */

  const [currentEvent, setCurrentEvent] = useState<Member1Event>({
    sensor_id: "S1",
    latitude: 10.956181017827104,
    longitude: 76.97840632923085,
    location: "Sensor S1",
    pm25: 74.58218210731494,
    pm10: 85.58071673579168,
    no2: 34.62365297575152,
    so2: 14.52352233806524,
    co: 0.8300837810287154,
    aqi: 79.51823204130815,
    temperature: 30.04141047937352,
    humidity: 64.17319314157301,
    wind_speed: 14.698404270638571,
    wind_direction: 122.617499969265,
    event_type: "PM2.5 POLLUTION",
    risk_level: "UNHEALTHY_FOR_SENSITIVE_GROUPS",
    anomaly_score: 0,
  })


  /* =====================================================
     MEMBER 2 AI STATE
  ===================================================== */

  const [member2Data, setMember2Data] =
    useState<Member2AIResponse>(fallbackRisk)

  const [loadingAI, setLoadingAI] = useState(true)

  const [aiError, setAiError] =
    useState<string | null>(null)


  /* =====================================================
     SEND REAL SENSOR DATA TO MEMBER 2 AI
  ===================================================== */

  useEffect(() => {

    const input: AirShieldAnalyzeInput = {

      event: {

        event_id: "AS-S1-001",

        latitude: currentEvent.latitude,

        longitude: currentEvent.longitude,

        pm25: currentEvent.pm25,

        DEWP: 18.0,

        TEMP: currentEvent.temperature,

        PRES: 1005.0,

        Iws: currentEvent.wind_speed,

        Is: 0.0,

        Ir: 0.0,

        hour: 14,

        month: 9,

        wind_direction: "SE",

        wind_speed: currentEvent.wind_speed,

        wind_direction_degrees:
          currentEvent.wind_direction,

        duration_minutes: 120,

        interval_minutes: 15,
      },

      population: {
        density_per_km2: 5000,
      },

      schools: [],

      hospitals: [],
    }


    analyzePollutionEvent(input)

      .then((result) => {

        console.log(
          "REAL MEMBER 2 AI RESPONSE:",
          result
        )

        setMember2Data(result)

        setCurrentEvent((previous) => ({
          ...previous,
          risk_level: result.risk,
        }))

      })

      .catch((error) => {

        console.error(
          "AirShield AI error:",
          error
        )

        setAiError(
          error instanceof Error
            ? error.message
            : "Unable to connect to AI service"
        )

      })

      .finally(() => {

        setLoadingAI(false)

      })

  }, [])


  /* =====================================================
     HERO POINTER INTERACTION
  ===================================================== */

  const handleHeroPointerMove = (
    event: React.PointerEvent<HTMLElement>
  ) => {

    const hero = event.currentTarget

    const rect = hero.getBoundingClientRect()

    const x =
      event.clientX - rect.left

    const y =
      event.clientY - rect.top

    hero.style.setProperty(
      "--pointer-x",
      `${x}px`
    )

    hero.style.setProperty(
      "--pointer-y",
      `${y}px`
    )

    hero.classList.add(
      "hero-pointer-active"
    )
  }


  const handleHeroPointerLeave = (
    event: React.PointerEvent<HTMLElement>
  ) => {

    event.currentTarget.classList.remove(
      "hero-pointer-active"
    )

  }


  return (

    <div className="app-shell">

      <Header />


      {/* =====================================================
          HERO — LIVE AIR INTELLIGENCE
      ===================================================== */}

      <section
        className="hero-section"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
      >

        <div className="hero-interaction-layer" />


        {/* Animated atmospheric particles */}

        <div className="hero-particles">

          <span className="particle p1" />
          <span className="particle p2" />
          <span className="particle p3" />
          <span className="particle p4" />
          <span className="particle p5" />
          <span className="particle p6" />
          <span className="particle p7" />
          <span className="particle p8" />
          <span className="particle p9" />
          <span className="particle p10" />
          <span className="particle p11" />
          <span className="particle p12" />

        </div>


        {/* Background grid */}

        <div className="hero-grid" />


        {/* Atmospheric glow */}

        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="hero-glow glow-three" />


        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="hero-content">

          <span className="hero-kicker">

            <span className="live-dot" />

            REAL-TIME AIR QUALITY MONITORING

          </span>


          <h1>
            Air<span>Shield</span>
          </h1>


          <h2>
            Detect. Predict. Protect.
          </h2>


          <p className="hero-description">

            AI-powered intelligence for cleaner air,
            safer communities and a healthier tomorrow.

          </p>


          {/* LIVE METRICS */}

          <div className="hero-metrics">


            <div className="hero-metric">

              <span>◉</span>

              <small>AQI</small>

              <strong>
                {Math.round(currentEvent.aqi)}
              </strong>

              <em>
                LIVE
              </em>

            </div>


            <div className="hero-metric">

              <span>◈</span>

              <small>PM2.5</small>

              <strong>
                {currentEvent.pm25.toFixed(1)}
              </strong>

              <em>
                μg/m³
              </em>

            </div>


            <div className="hero-metric">

              <span>◇</span>

              <small>PM10</small>

              <strong>
                {currentEvent.pm10.toFixed(1)}
              </strong>

              <em>
                μg/m³
              </em>

            </div>


            <div className="hero-metric danger">

              <span>△</span>

              <small>RISK</small>

              <strong>
                {currentEvent.risk_level}
              </strong>

              <em>
                {loadingAI
                  ? "ANALYZING"
                  : "AI ANALYSIS"}
              </em>

            </div>


            <div className="hero-metric confidence">

              <span>✦</span>

              <small>
                AI CONFIDENCE
              </small>

              <strong>

                {Math.round(
                  member2Data.source_confidence * 100
                )}
                %

              </strong>


              <div className="confidence-line">

                <div
                  style={{
                    width: `${
                      member2Data.source_confidence *
                      100
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* SYSTEM FLOW */}

          <div className="hero-flow">

            <div className="flow-item active">

              <span>◉</span>

              LIVE DETECTION

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="flow-item">

              <span>✦</span>

              AI ANALYSIS

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="flow-item">

              <span>◇</span>

              RESPONSE READY

            </div>

          </div>


          {/* AI CONNECTION STATUS */}

          {loadingAI && (

            <div className="ai-status-message">

              Connecting to AirShield AI engine...

            </div>

          )}


          {aiError && (

            <div className="ai-status-message">

              AI connection issue: {aiError}

            </div>

          )}

        </div>


        {/* =================================================
            RADAR / ATMOSPHERIC VISUAL
        ================================================= */}

        <div className="hero-radar-zone">


          {/* Connecting data paths */}

          <div className="data-orbit orbit-large" />

          <div className="data-orbit orbit-medium" />

          <div className="data-orbit orbit-small" />


          {/* Main AirShield radar */}

          <div className="radar-main">

            <div className="radar-ring ring-1" />
            <div className="radar-ring ring-2" />
            <div className="radar-ring ring-3" />
            <div className="radar-ring ring-4" />

            <div className="radar-sweep" />

            <div className="radar-core">

              <div className="shield-icon">
                AS
              </div>

            </div>


            <div className="radar-label">

              AIRSHIELD
              <br />

              <span>
                LIVE INTELLIGENCE
              </span>

            </div>

          </div>


          {/* RADAR 1 */}

          <div className="mini-radar radar-one">

            <div className="mini-radar-ring" />

            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">

              <small>
                PM2.5
              </small>

              <strong>
                {currentEvent.pm25.toFixed(1)}
              </strong>

            </div>

          </div>


          {/* RADAR 2 */}

          <div className="mini-radar radar-two critical-radar">

            <div className="mini-radar-ring" />

            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">

              <small>
                PM10
              </small>

              <strong>
                {currentEvent.pm10.toFixed(1)}
              </strong>

            </div>

          </div>


          {/* RADAR 3 */}

          <div className="mini-radar radar-three">

            <div className="mini-radar-ring" />

            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">

              <small>
                NO₂
              </small>

              <strong>
                {currentEvent.no2.toFixed(1)}
              </strong>

            </div>

          </div>


          {/* RADAR 4 */}

          <div className="mini-radar radar-four">

            <div className="mini-radar-ring" />

            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">

              <small>
                CO
              </small>

              <strong>
                {currentEvent.co.toFixed(2)}
              </strong>

            </div>

          </div>


          {/* Floating pollution data */}

          <div className="floating-data data-one">

            <span />

            SENSOR S1

          </div>


          <div className="floating-data data-two">

            <span />

            POLLUTION DETECTED

          </div>


          <div className="floating-data data-three">

            <span />

            AI ANALYSIS

          </div>


          {/* Wind flow */}

          <div className="wind-flow">

            <i />
            <i />
            <i />
            <i />
            <i />

          </div>


          <div className="wind-label">

            ≋ WIND FLOW
            <br />

            <strong>
              {currentEvent.wind_speed.toFixed(1)}
              km/h
            </strong>

          </div>

        </div>


        {/* Status bar */}

        <div className="hero-status">

          <div>

            <span className="status-pulse" />

            SYSTEM ONLINE

          </div>


          <div>

            ● 200 EVENTS MONITORED

          </div>


          <div>

            ● AI RISK ENGINE ACTIVE

          </div>

        </div>

      </section>


      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <main className="dashboard-content">


        {/* =================================================
            POLLUTION INTELLIGENCE
        ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span className="section-kicker">
                LIVE INTELLIGENCE
              </span>

              <h2>
                Pollution Intelligence
              </h2>

            </div>


            <div className="status-indicator">

              <span className="status-dot" />

              {loadingAI
                ? "AI ANALYZING"
                : "SYSTEM ONLINE"}

            </div>

          </div>


          <PollutionMap
            event={currentEvent}
            risk={member2Data}
          />


          <div className="dashboard-grid">


            <RiskDashboard
              event={currentEvent}
              risk={member2Data}
            />


            <EventPanel
              event={currentEvent}
              risk={member2Data}
            />

          </div>

        </section>


        {/* =================================================
            ALERTS
        ================================================= */}

        <section className="dashboard-section">

          <AlertsPanel
            alerts={alerts}
          />

        </section>


        {/* =================================================
            RESPONSE
        ================================================= */}

        <section className="dashboard-section">

          <ResponsePanel
            risk={member2Data}
          />

        </section>


        {/* =================================================
            AI EXPLAINABILITY
        ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span className="section-kicker">
                AI EXPLAINABILITY
              </span>

              <h2>
                Why did the AI predict this risk?
              </h2>

            </div>

          </div>


          <ShapChart
            shap={member2Data.shap}
            risk={member2Data.risk}
          />

        </section>


        {/* =================================================
            CITIZEN REPORT
        ================================================= */}

        <section className="dashboard-section">

          <CitizenReport />

        </section>


        {/* =================================================
            EVENT PASSPORT — REAL MEMBER 1 + MEMBER 2 DATA
        ================================================= */}

        <section className="dashboard-section">

          <EventPassport
            member1={currentEvent}
            member2={member2Data}
          />

        </section>


      </main>

    </div>

  )
}


export default Dashboard