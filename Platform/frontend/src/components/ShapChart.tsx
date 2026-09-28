import type { Member2AIResponse } from "../types"

interface ShapChartProps {
  shap: Member2AIResponse["shap"]
  risk: string
}

function ShapChart({
  shap,
  risk,
}: ShapChartProps) {

  const entries = Object.entries(shap)
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))

  const maxValue = Math.max(
    ...entries.map(([, value]) => Math.abs(value)),
    1
  )

  return (
    <section className="dashboard-section shap-section">

      {/* HEADER */}

      <div className="shap-heading">

        <div>
          <span className="section-kicker">
            AI EXPLAINABILITY
          </span>

          <h2>
            Why did the AI predict this risk?
          </h2>

          <p>
            Key environmental factors contributing to the
            current AI risk assessment.
          </p>
        </div>

        <div className="shap-risk-badge">
          {risk}
        </div>

      </div>


      {/* EXPLANATION */}

      <div className="shap-explanation">

        <div className="shap-explanation-icon">
          ✦
        </div>

        <p>
          Positive contributions increase the predicted
          risk, while negative contributions reduce it.
          The chart shows the relative influence of each
          model feature.
        </p>

      </div>


      {/* FEATURE CONTRIBUTIONS */}

      <div className="shap-card">

        <div className="shap-card-header">

          <div>
            <span className="section-kicker">
              FEATURE CONTRIBUTIONS
            </span>

            <h3>
              Model influence
            </h3>
          </div>

          <div className="shap-legend">

            <span>
              <i className="legend-positive" />
              Increases risk
            </span>

            <span>
              <i className="legend-negative" />
              Reduces risk
            </span>

          </div>

        </div>


        <div className="shap-list">

          {entries.map(([feature, value]) => {

            const percentage =
              (Math.abs(value) / maxValue) * 100

            const positive = value >= 0

            return (
              <div
                className="shap-row"
                key={feature}
              >

                <div className="shap-label">
                  <span>
                    {feature}
                  </span>

                  <strong
                    className={
                      positive
                        ? "shap-value positive"
                        : "shap-value negative"
                    }
                  >
                    {positive ? "+" : ""}
                    {value.toFixed(2)}
                  </strong>
                </div>


                <div className="shap-track">

                  <div
                    className={
                      positive
                        ? "shap-bar positive"
                        : "shap-bar negative"
                    }
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            )
          })}

        </div>

      </div>


      {/* FOOTNOTE */}

      <div className="shap-footnote">

        <span>
          SHAP
        </span>

        <p>
          Feature contributions represent the model's
          explanation of this individual prediction.
        </p>

      </div>

    </section>
  )
}

export default ShapChart