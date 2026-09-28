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
  analyzeEvent,
  getPollutionEvents,
} from "../services/api"

import type {
  Member1EventsResponse,
  Member2AIResponse,
  Alert,
  EventPassportData,
} from "../types"


function Dashboard() {
  // ============================================================
  // LIVE AIRSHIELD DATA
  // ============================================================

  const [member1Data, setMember1Data] =
    useState<Member1EventsResponse | null>(null)

  const [member2Data, setMember2Data] =
    useState<Member2AIResponse | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] =
    useState<string | null>(null)


  // ============================================================
  // LOAD MEMBER 1 → MEMBER 2 PIPELINE
  // ============================================================

  useEffect(() => {
    async function loadAirShieldData() {
      try {
        setLoading(true)
        setError(null)

        // --------------------------------------------------------
        // STEP 1 — Get real pollution event from Member 1
        // --------------------------------------------------------

        const events = await getPollutionEvents()

        if (!events.data || events.data.length === 0) {
          throw new Error("No pollution events available")
        }

        setMember1Data(events)

        // --------------------------------------------------------
        // STEP 2 — Send the detected event to Member 2
        // --------------------------------------------------------

        const currentEvent = events.data[0]

        const aiResult = await analyzeEvent(currentEvent)

        // --------------------------------------------------------
        // STEP 3 — Store real AI intelligence
        // --------------------------------------------------------

        setMember2Data(aiResult)

      } catch (err) {
        console.error(
          "AirShield data loading failed:",
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load AirShield intelligence"
        )
      } finally {
        setLoading(false)
      }
    }

    loadAirShieldData()
  }, [])


  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="app-shell">

        <Header />

        <main className="dashboard-content">

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span className="section-kicker">
                  AIRSHIELD INTELLIGENCE
                </span>

                <h2>
                  Loading live air intelligence...
                </h2>

              </div>

              <div className="status-indicator">
                <span className="status-dot" />
                CONNECTING
              </div>

            </div>

            <p>
              Connecting to Member 1 pollution detection
              and Member 2 AI intelligence services.
            </p>

          </section>

        </main>

      </div>
    )
  }


  // ============================================================
  // ERROR SCREEN
  // ============================================================

  if (
    error ||
    !member1Data ||
    !member2Data ||
    !member1Data.data[0]
  ) {
    return (
      <div className="app-shell">

        <Header />

        <main className="dashboard-content">

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span className="section-kicker">
                  AIRSHIELD SYSTEM
                </span>

                <h2>
                  Unable to load live intelligence
                </h2>

              </div>

              <div className="status-indicator">
                <span className="status-dot" />
                CONNECTION ERROR
              </div>

            </div>

            <p>
              {error ||
                "AirShield backend services did not return valid data."}
            </p>

          </section>

        </main>

      </div>
    )
  }


  // ============================================================
  // CURRENT LIVE EVENT
  // ============================================================

  const currentEvent = member1Data.data[0]


  // ============================================================
  // DYNAMIC ALERTS
  // ============================================================

  const alerts: Alert[] = [

    {
      id: "ALT-LIVE-001",
      type: "authority",
      message:
        `${currentEvent.event_type} detected by sensor ${currentEvent.sensor_id}.`,
      severity: currentEvent.risk_level,
      time: "Live",
    },

    {
      id: "ALT-LIVE-002",
      type: "forecast",
      message:
        `AI forecast predicts ${member2Data.predicted_pm25.toFixed(1)} µg/m³ PM2.5 during the next ${member2Data.forecast_horizon.replace("_", " ")}.`,
      severity:
        member2Data.risk === "UNHEALTHY"
          ? "HIGH"
          : "MEDIUM",
      time: "Live",
    },

    {
      id: "ALT-LIVE-003",
      type: "ai",
      message:
        `Probable pollution source: ${member2Data.probable_source} with ${Math.round(
          member2Data.source_confidence * 100
        )}% confidence.`,
      severity: "MEDIUM",
      time: "Live",
    },
  ]


  // ============================================================
  // DYNAMIC EVENT PASSPORT
  // ============================================================

  const eventPassport: EventPassportData = {

    eventId:
      member2Data.event_id ||
      currentEvent.sensor_id,

    location:
      currentEvent.location,

    detectedAt:
      currentEvent.sensor_id
        ? `Sensor ${currentEvent.sensor_id} — Live`
        : "Live detection",

    pollutant:
      currentEvent.event_type,

    source:
      member2Data.probable_source,

    confidence:
      member2Data.source_confidence,

    predictedMovement:
      member2Data.trajectory.length > 1
        ? "AI trajectory prediction available"
        : "Trajectory data pending",

    exposure:
      member2Data.exposure.exposure_level,

    status:
      currentEvent.risk_level,
  }


  // ============================================================
  // HERO POINTER EFFECT
  // ============================================================

  const handleHeroPointerMove = (
    event: React.PointerEvent<HTMLElement>
  ) => {

    const hero = event.currentTarget

    const rect =
      hero.getBoundingClientRect()

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


  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (

    <div className="app-shell">

      <Header />


      {/* ======================================================
          HERO — LIVE AIR INTELLIGENCE
      ====================================================== */}

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


        {/* ==================================================
            HERO CONTENT
        ================================================== */}

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


          {/* =================================================
              LIVE METRICS
          ================================================= */}

          <div className="hero-metrics">


            {/* AQI */}

            <div className="hero-metric">

              <span>◉</span>

              <small>
                AQI
              </small>

              <strong>
                {Math.round(currentEvent.aqi)}
              </strong>

              <em>
                {currentEvent.risk_level}
              </em>

            </div>


            {/* CURRENT PM2.5 */}

            <div className="hero-metric">

              <span>◈</span>

              <small>
                PM2.5
              </small>

              <strong>
                {currentEvent.pm25.toFixed(1)}
              </strong>

              <em>
                µg/m³
              </em>

            </div>


            {/* PM10 */}

            <div className="hero-metric">

              <span>◇</span>

              <small>
                PM10
              </small>

              <strong>
                {currentEvent.pm10.toFixed(1)}
              </strong>

              <em>
                µg/m³
              </em>

            </div>


            {/* AI FORECAST */}

            <div className="hero-metric danger">

              <span>△</span>

              <small>
                1H FORECAST
              </small>

              <strong>
                {member2Data.predicted_pm25.toFixed(1)}
              </strong>

              <em>
                {member2Data.risk}
              </em>

            </div>


            {/* AI CONFIDENCE */}

            <div className="hero-metric confidence">

              <span>✦</span>

              <small>
                AI CONFIDENCE
              </small>

              <strong>
                {Math.round(
                  member2Data.source_confidence * 100
                )}%
              </strong>


              <div className="confidence-line">

                <div
                  style={{
                    width: `${
                      member2Data.source_confidence * 100
                    }%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* =================================================
              SYSTEM FLOW
          ================================================= */}

          <div className="hero-flow">


            <div className="flow-item active">

              <span>
                ◉
              </span>

              LIVE DETECTION

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="flow-item">

              <span>
                ✦
              </span>

              AI ANALYSIS

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="flow-item">

              <span>
                ◇
              </span>

              RESPONSE READY

            </div>

          </div>

        </div>


        {/* ==================================================
            RADAR / ATMOSPHERIC VISUAL
        ================================================== */}

        <div className="hero-radar-zone">


          {/* Connecting data paths */}

          <div className="data-orbit orbit-large" />
          <div className="data-orbit orbit-medium" />
          <div className="data-orbit orbit-small" />


          {/* Main radar */}

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


          {/* Radar 1 */}

          <div className="mini-radar radar-one">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◇
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


          {/* Radar 2 */}

          <div className="mini-radar radar-two critical-radar">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◇
            </div>

            <div className="radar-data">

              <small>
                FORECAST
              </small>

              <strong>
                {member2Data.predicted_pm25.toFixed(1)}
              </strong>

            </div>

          </div>


          {/* Radar 3 */}

          <div className="mini-radar radar-three">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◇
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


          {/* Radar 4 */}

          <div className="mini-radar radar-four">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◇
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


          {/* Floating pollution data */}

          <div className="floating-data data-one">

            <span />

            SENSOR {currentEvent.sensor_id}

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

            ≪ WIND FLOW

            <br />

            <strong>
              {currentEvent.wind_speed.toFixed(1)} km/h
            </strong>

          </div>

        </div>


        {/* ==================================================
            STATUS BAR
        ================================================== */}

        <div className="hero-status">


          <div>

            <span className="status-pulse" />

            SYSTEM ONLINE

          </div>


          <div>

            ◉ {member1Data.total_events} EVENTS MONITORED

          </div>


          <div>

            ◉ AI RISK ENGINE ACTIVE

          </div>

        </div>

      </section>


      {/* ======================================================
          EXISTING DASHBOARD
      ====================================================== */}

      <main className="dashboard-content">


        {/* ==================================================
            POLLUTION INTELLIGENCE
        ================================================== */}

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

              SYSTEM ONLINE

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


        {/* ==================================================
            ALERTS
        ================================================== */}

        <section className="dashboard-section">

          <AlertsPanel
            alerts={alerts}
          />

        </section>


        {/* ==================================================
            RESPONSE
        ================================================== */}

        <section className="dashboard-section">

          <ResponsePanel
            risk={member2Data}
          />

        </section>


        {/* ==================================================
            SHAP EXPLAINABILITY
        ================================================== */}

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
          />

        </section>


        {/* ==================================================
            CITIZEN REPORT
        ================================================== */}

        <section className="dashboard-section">

          <CitizenReport />

        </section>


        {/* ==================================================
            EVENT PASSPORT
        ================================================== */}

        <section className="dashboard-section">

          <EventPassport
            passport={eventPassport}
          />

        </section>

      </main>

    </div>
  )
}


export default Dashboard