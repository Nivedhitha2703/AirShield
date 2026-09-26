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
  member1Data,
  member2Data,
  alerts,
  eventPassport,
} from "../data/mockData"


function Dashboard() {
  const currentEvent = member1Data.data[0]

  const handleHeroPointerMove = (
  event: React.PointerEvent<HTMLElement>
) => {
  const hero = event.currentTarget
  const rect = hero.getBoundingClientRect()

  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  hero.style.setProperty("--pointer-x", `${x}px`)
  hero.style.setProperty("--pointer-y", `${y}px`)

  hero.classList.add("hero-pointer-active")
}

const handleHeroPointerLeave = (
  event: React.PointerEvent<HTMLElement>
) => {
  event.currentTarget.classList.remove("hero-pointer-active")
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
              <strong>{Math.round(currentEvent.aqi)}</strong>
              <em>CRITICAL</em>
            </div>

            <div className="hero-metric">
              <span>◈</span>
              <small>PM2.5</small>
              <strong>{currentEvent.pm25.toFixed(1)}</strong>
              <em>μg/m³</em>
            </div>

            <div className="hero-metric">
              <span>◇</span>
              <small>PM10</small>
              <strong>{currentEvent.pm10.toFixed(1)}</strong>
              <em>μg/m³</em>
            </div>

            <div className="hero-metric danger">
              <span>△</span>
              <small>RISK</small>
              <strong>{currentEvent.risk_level}</strong>
              <em>ACTIVE EVENT</em>
            </div>

            <div className="hero-metric confidence">
              <span>✦</span>
              <small>AI CONFIDENCE</small>
              <strong>
                {Math.round(member2Data.source_confidence * 100)}%
              </strong>

              <div className="confidence-line">
                <div
                  style={{
                    width: `${member2Data.source_confidence * 100}%`,
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
              AIRSHIELD<br />
              <span>LIVE INTELLIGENCE</span>
            </div>

          </div>


          {/* =================================================
              RADAR 1 — TOP LEFT
          ================================================= */}

          <div className="mini-radar radar-one">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">
              <small>PM2.5</small>
              <strong>82.3</strong>
            </div>

          </div>


          {/* =================================================
              RADAR 2 — TOP RIGHT
          ================================================= */}

          <div className="mini-radar radar-two critical-radar">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">
              <small>PM2.5</small>
              <strong>176.4</strong>
            </div>

          </div>


          {/* =================================================
              RADAR 3 — BOTTOM LEFT
          ================================================= */}

          <div className="mini-radar radar-three">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">
              <small>PM10</small>
              <strong>143.2</strong>
            </div>

          </div>


          {/* =================================================
              RADAR 4 — BOTTOM RIGHT
          ================================================= */}

          <div className="mini-radar radar-four">

            <div className="mini-radar-ring" />
            <div className="mini-radar-ring ring-second" />

            <div className="mini-sweep" />

            <div className="mini-core">
              ◆
            </div>

            <div className="radar-data">
              <small>NO₂</small>
              <strong>48.7</strong>
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
            ≋ WIND FLOW<br />
            <strong>{currentEvent.wind_speed.toFixed(1)} km/h</strong>
          </div>

        </div>


        {/* Status bar */}

        <div className="hero-status">

          <div>
            <span className="status-pulse" />
            SYSTEM ONLINE
          </div>

          <div>
            ● {member1Data.total_events} EVENTS MONITORED
          </div>

          <div>
            ● AI RISK ENGINE ACTIVE
          </div>

        </div>

      </section>


      {/* =====================================================
          EXISTING DASHBOARD
      ===================================================== */}

      <main className="dashboard-content">

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
                event={member1Data.data[0]}
                 risk={member2Data}
            />

            <EventPanel
              event={currentEvent}
              risk={member2Data}
            />

          </div>

        </section>


        <section className="dashboard-section">
          <AlertsPanel alerts={alerts} />
        </section>


        <section className="dashboard-section">
          <ResponsePanel risk={member2Data} />
        </section>


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


        <section className="dashboard-section">
          <CitizenReport />
        </section>


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