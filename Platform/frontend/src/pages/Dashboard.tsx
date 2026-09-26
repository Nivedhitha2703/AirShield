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
  pollutionEvent,
  riskData,
  alerts,
  eventPassport,
} from "../data/mockData"

function Dashboard() {
  return (
    <div className="app" id="top">
      <Header />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              REAL-TIME AIR QUALITY INTELLIGENCE
            </span>

            <h2>
              Detect. Predict.
              <br />
              <span>Protect.</span>
            </h2>

            <p>
              Hyperlocal pollution intelligence that detects
              pollution events, predicts their movement, and helps
              communities respond faster.
            </p>

            <div className="hero-stats">
              <div>
                <strong>LIVE</strong>
                <span>Monitoring</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Detection</span>
              </div>

              <div>
                <strong>AI</strong>
                <span>Prediction</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one"></div>
            <div className="hero-orbit orbit-two"></div>
            <div className="hero-shield">🛡️</div>
          </div>
        </section>

        {/* LIVE MAP */}
        <section className="section" id="map">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                LIVE MONITORING
              </span>

              <h2>Pollution Intelligence Map</h2>

              <p>
                Real-time pollution hotspots and predicted
                movement of the detected event.
              </p>
            </div>

            <div className="live-indicator">
              <span></span>
              LIVE
            </div>
          </div>

          <PollutionMap
            event={pollutionEvent}
            risk={riskData}
          />
        </section>

        {/* RISK & EVENT */}
        <section className="section" id="intelligence">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                AI INTELLIGENCE
              </span>

              <h2>Risk & Event Intelligence</h2>

              <p>
                Understand the severity, source, exposure, and
                predicted impact of the pollution event.
              </p>
            </div>
          </div>

          <div className="dashboard-grid two-column">
            <RiskDashboard risk={riskData} />

            <EventPanel
              event={pollutionEvent}
              risk={riskData}
            />
          </div>
        </section>

        {/* ALERTS & RESPONSE */}
        <section className="section" id="alerts">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                EARLY WARNING
              </span>

              <h2>Alerts & Response</h2>

              <p>
                Important warnings and recommended actions based
                on current pollution conditions.
              </p>
            </div>
          </div>

          <div className="dashboard-grid two-column">
            <AlertsPanel alerts={alerts} />

            <ResponsePanel risk={riskData} />
          </div>
        </section>

        {/* SHAP & REPORT */}
        <section className="section" id="report">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                TRANSPARENT AI
              </span>

              <h2>Explainability & Citizen Reports</h2>

              <p>
                Understand why the AI generated the risk prediction
                and report pollution directly from the community.
              </p>
            </div>
          </div>

          <div className="dashboard-grid two-column">
            <ShapChart shap={riskData.shap} />

            <CitizenReport />
          </div>
        </section>

        {/* EVENT PASSPORT */}
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                EVENT RECORD
              </span>

              <h2>Pollution Event Passport</h2>

              <p>
                A structured record containing the key information
                associated with this pollution event.
              </p>
            </div>
          </div>

          <EventPassport passport={eventPassport} />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <strong>AirShield</strong>
          <span>Hyperlocal Pollution Intelligence</span>
        </div>

        <p>
          Detect pollution. Predict risk. Protect communities.
        </p>
      </footer>
    </div>
  )
}

export default Dashboard