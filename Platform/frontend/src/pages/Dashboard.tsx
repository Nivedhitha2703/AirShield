import { useEffect, useState, type PointerEvent } from "react"

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
  getMember1Events,
} from "../services/api"

import type {
  Member1Event,
  Member2AIResponse,
} from "../types"


function Dashboard() {

  // =====================================================
  // MEMBER 1 SENSOR DATA
  // =====================================================

  const [currentEvent, setCurrentEvent] =
    useState<Member1Event | null>(null)

  const [loadingEvents, setLoadingEvents] =
    useState(true)

  const [eventsError, setEventsError] =
    useState<string | null>(null)


  // =====================================================
  // MEMBER 2 AI STATE
  // =====================================================

  const [member2Data, setMember2Data] =
    useState<Member2AIResponse | null>(null)

  const [loadingAI, setLoadingAI] =
    useState(false)

  const [aiError, setAiError] =
    useState<string | null>(null)


  // =====================================================
  // FETCH MEMBER 1 EVENTS
  // =====================================================

  useEffect(() => {

    setLoadingEvents(true)
    setEventsError(null)

    getMember1Events()

      .then((result) => {

        console.log(
          "REAL MEMBER 1 EVENTS:",
          result
        )

        if (
          !result.data ||
          result.data.length === 0
        ) {
          throw new Error(
            "Member 1 returned no pollution events."
          )
        }

        // Use the first real Member 1 event
        // for the initial dashboard view.
        setCurrentEvent(result.data[0])

      })

      .catch((error) => {

        console.error(
          "Member 1 events error:",
          error
        )

        setEventsError(
          error instanceof Error
            ? error.message
            : "Unable to connect to Member 1."
        )

      })

      .finally(() => {

        setLoadingEvents(false)

      })

  }, [])


  // =====================================================
  // SEND MEMBER 1 EVENT → MEMBER 2 AI
  // =====================================================

  useEffect(() => {

    if (!currentEvent) {
      return
    }

    setLoadingAI(true)
    setAiError(null)
    setMember2Data(null)

    /*
      FINAL MEMBER 1 → MEMBER 2 INTEGRATION

      Member 2 now accepts the complete Member 1
      event object directly.

      No transformation is required here.
    */

    analyzePollutionEvent(currentEvent)

      .then((result) => {

        console.log(
          "REAL MEMBER 2 AI RESPONSE:",
          result
        )

        setMember2Data(result)

      })

      .catch((error) => {

        console.error(
          "AirShield AI error:",
          error
        )

        setAiError(
          error instanceof Error
            ? error.message
            : "Unable to connect to AI service."
        )

      })

      .finally(() => {

        setLoadingAI(false)

      })

  }, [currentEvent])


  // =====================================================
  // HERO POINTER INTERACTION
  // =====================================================

  const handleHeroPointerMove = (
    event: PointerEvent<HTMLElement>
  ) => {

    const hero =
      event.currentTarget

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
    event: PointerEvent<HTMLElement>
  ) => {

    event.currentTarget.classList.remove(
      "hero-pointer-active"
    )

  }


  // =====================================================
  // LOADING MEMBER 1
  // =====================================================

  if (loadingEvents) {

    return (
      <div className="app-shell">

        <Header />

        <main className="dashboard-content">

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span className="section-kicker">
                  MEMBER 1 INTEGRATION
                </span>

                <h2>
                  Loading pollution intelligence...
                </h2>

              </div>

              <div className="status-indicator">

                <span className="status-dot" />

                CONNECTING

              </div>

            </div>

            <div className="card">

              <p>
                Connecting to the Member 1
                pollution detection service...
              </p>

            </div>

          </section>

        </main>

      </div>
    )
  }


  // =====================================================
  // MEMBER 1 CONNECTION ERROR
  // =====================================================

  if (eventsError || !currentEvent) {

    return (
      <div className="app-shell">

        <Header />

        <main className="dashboard-content">

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span className="section-kicker">
                  MEMBER 1 INTEGRATION
                </span>

                <h2>
                  Pollution intelligence unavailable
                </h2>

              </div>

              <div className="status-indicator">

                <span className="status-dot" />

                OFFLINE

              </div>

            </div>

            <div className="card">

              <p>
                {eventsError ||
                  "No pollution event was returned by Member 1."}
              </p>

            </div>

          </section>

        </main>

      </div>
    )
  }


  // =====================================================
  // WAIT FOR MEMBER 2
  // =====================================================

  if (loadingAI || !member2Data) {

    return (
      <div className="app-shell">

        <Header />

        <main className="dashboard-content">

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span className="section-kicker">
                  AIRSHIELD AI
                </span>

                <h2>
                  Analyzing pollution event...
                </h2>

                <p>
                  Member 1 event detected. Sending
                  environmental data to the AI risk engine.
                </p>

              </div>

              <div className="status-indicator">

                <span className="status-dot" />

                AI ANALYZING

              </div>

            </div>

            <div className="card">

              {aiError ? (
                <p>
                  AI connection issue: {aiError}
                </p>
              ) : (
                <p>
                  Connecting to the AirShield AI
                  risk intelligence service...
                </p>
              )}

            </div>

          </section>

        </main>

      </div>
    )
  }


  // =====================================================
  // MAIN DASHBOARD
  // =====================================================

  return (

    <div className="app-shell">

      <Header />


      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="hero-section"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
      >

        <div className="hero-interaction-layer" />


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


        <div className="hero-grid" />


        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="hero-glow glow-three" />


        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="hero-content">

          <span className="hero-kicker">

            <span className="live-dot" />

            POLLUTION INTELLIGENCE MONITORING

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


          {/* METRICS */}

          <div className="hero-metrics">

            <div className="hero-metric">

              <span>◉</span>

              <small>AQI</small>

              <strong>
                {Math.round(currentEvent.aqi)}
              </strong>

              <em>
                MEMBER 1
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
                {member2Data.risk}
              </strong>

              <em>
                AI ANALYSIS
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
                    width: `${Math.max(
                      0,
                      Math.min(
                        member2Data.source_confidence * 100,
                        100
                      )
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* SYSTEM FLOW */}

          <div className="hero-flow">

            <div className="flow-item active">

              <span>◉</span>

              MEMBER 1 DETECTION

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


          {aiError && (

            <div className="ai-status-message">

              AI connection issue:
              {" "}
              {aiError}

            </div>

          )}

        </div>


        {/* =================================================
            RADAR / ATMOSPHERIC VISUAL
        ================================================= */}

        <div className="hero-radar-zone">

          <div className="data-orbit orbit-large" />
          <div className="data-orbit orbit-medium" />
          <div className="data-orbit orbit-small" />


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
                AIR INTELLIGENCE
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


          {/* FLOATING DATA */}

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


          {/* WIND */}

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
              m/s
            </strong>

          </div>

        </div>


        {/* STATUS BAR */}

        <div className="hero-status">

          <div>

            <span className="status-pulse" />

            SYSTEM ONLINE

          </div>


          <div>

            ● {currentEvent.event_type}

          </div>


          <div>

            ● AI RISK ENGINE ACTIVE

          </div>

        </div>

      </section>


      {/* =================================================
          DASHBOARD
      ================================================= */}

      <main className="dashboard-content">


        {/* =================================================
            POLLUTION INTELLIGENCE
        ================================================= */}

        <section
          className="dashboard-section"
          id="pollution-intelligence"
        >

          <div className="section-heading">

            <div>

              <span className="section-kicker">
                POLLUTION INTELLIGENCE
              </span>

              <h2>
                Environmental Risk
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
              member1={currentEvent}
              member2={member2Data}
            />

          </div>

        </section>


        {/* =================================================
            ALERTS
        ================================================= */}

        <section
          className="dashboard-section"
          id="alerts"
        >

          <AlertsPanel
            member1={currentEvent}
            member2={member2Data}
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

        <section
          className="dashboard-section"
          id="risk-intelligence"
        >

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

        <section
          className="dashboard-section"
          id="report"
        >

          <CitizenReport />

        </section>


        {/* =================================================
            EVENT PASSPORT
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