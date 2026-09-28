import { useState } from "react"
import { submitCitizenReport } from "../services/api"

function CitizenReport() {
  const [pollutionType, setPollutionType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | undefined>()
  const [status, setStatus] = useState("")

  const [analysisResult, setAnalysisResult] = useState<{
    success: boolean
    image?: string
    brightness?: number
    contrast?: number
    saturation?: number
    haze_level?: string
    visual_score?: number
    visual_assessment?: string
  } | null>(null)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setStatus("Submitting report...")
    setAnalysisResult(null)

    try {
      const result = await submitCitizenReport({
        pollutionType,
        location,
        description,
        image,
      })

      if (image && result) {
        setAnalysisResult(result)
        setStatus("Report and photo analysis completed successfully.")
      } else {
        setStatus("Report received successfully.")
      }

      setPollutionType("")
      setLocation("")
      setDescription("")
      setImage(undefined)

      const fileInput =
        document.getElementById(
          "citizen-photo"
        ) as HTMLInputElement | null

      if (fileInput) {
        fileInput.value = ""
      }

    } catch {
      setStatus(
        "The report could not be processed right now. Please try again."
      )
    }
  }

  return (
    <section
      id="report"
      className="dashboard-section citizen-report-section"
    >

      {/* HEADER */}

      <div className="citizen-heading">

        <div>

          <span className="section-kicker">
            COMMUNITY SIGNAL
          </span>

          <h2>
            Report Local Pollution
          </h2>

          <p>
            Help AirShield improve local pollution
            intelligence by sharing what you observe.
          </p>

        </div>

        <div className="citizen-status-icon">
          +
        </div>

      </div>


      {/* REPORT FORM */}

      <div className="citizen-report-card">

        <form
          onSubmit={handleSubmit}
          className="citizen-form"
        >

          {/* POLLUTION TYPE */}

          <div className="citizen-field">

            <label htmlFor="pollution-type">
              Pollution type
            </label>

            <select
              id="pollution-type"
              value={pollutionType}
              onChange={(event) =>
                setPollutionType(event.target.value)
              }
              required
            >

              <option value="">
                Select pollution type
              </option>

              <option value="Smoke">
                Smoke
              </option>

              <option value="Dust">
                Dust
              </option>

              <option value="Burning">
                Burning
              </option>

              <option value="Industrial emissions">
                Industrial emissions
              </option>

              <option value="Unknown">
                Unknown
              </option>

            </select>

          </div>


          {/* LOCATION */}

          <div className="citizen-field">

            <label htmlFor="pollution-location">
              Location
            </label>

            <input
              id="pollution-location"
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="Enter the observed location"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="citizen-field citizen-field-full">

            <label htmlFor="pollution-description">
              What did you observe?
            </label>

            <textarea
              id="pollution-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what you observed..."
              rows={5}
              required
            />

          </div>


          {/* PHOTO */}

          <div className="citizen-field citizen-field-full">

            <label htmlFor="citizen-photo">
              Photo evidence
            </label>

            <div className="citizen-upload">

              <div className="upload-icon">
                ↑
              </div>

              <div>

                <strong>
                  Attach a pollution photo
                </strong>

                <span>
                  Optional • JPG, PNG or similar image
                </span>

              </div>

              <input
                id="citizen-photo"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImage(
                    event.target.files?.[0]
                  )
                }
              />

            </div>

            {image && (
              <p className="selected-file">
                Selected: {image.name}
              </p>
            )}

          </div>


          {/* SUBMIT */}

          <div className="citizen-submit-row">

            <button
              type="submit"
              className="citizen-submit-button"
            >
              Submit Pollution Report
              <span>→</span>
            </button>

            {status && (
              <p
                className={`citizen-status ${
                  status.includes("successfully")
                    ? "success"
                    : status.includes("Submitting")
                      ? "loading"
                      : "error"
                }`}
                aria-live="polite"
              >
                {status}
              </p>
            )}

          </div>

        </form>


        {/* AI ANALYSIS RESULT */}

        {analysisResult && (
          <div className="citizen-analysis-result">

            <div className="analysis-result-header">

              <div>
                <span className="section-kicker">
                  AI PHOTO ANALYSIS
                </span>

                <h3>
                  Pollution Visual Assessment
                </h3>
              </div>

              <div className="analysis-success">
                ✓ ANALYZED
              </div>

            </div>


            <div className="analysis-main">

              <div className="analysis-score">

                <span>
                  VISUAL SCORE
                </span>

                <strong>
                  {analysisResult.visual_score ?? "—"}
                </strong>

                <small>
                  / 100
                </small>

              </div>


              <div className="analysis-assessment">

                <span>
                  ASSESSMENT
                </span>

                <strong>
                  {analysisResult.visual_assessment
                    ?.replaceAll("_", " ")
                    ?? "Unavailable"}
                </strong>

              </div>


              <div className="analysis-haze">

                <span>
                  HAZE LEVEL
                </span>

                <strong>
                  {analysisResult.haze_level
                    ?? "Unavailable"}
                </strong>

              </div>

            </div>


            <div className="analysis-details">

              <div>
                <span>
                  Brightness
                </span>

                <strong>
                  {analysisResult.brightness?.toFixed(2)
                    ?? "—"}
                </strong>
              </div>

              <div>
                <span>
                  Contrast
                </span>

                <strong>
                  {analysisResult.contrast?.toFixed(2)
                    ?? "—"}
                </strong>
              </div>

              <div>
                <span>
                  Saturation
                </span>

                <strong>
                  {analysisResult.saturation?.toFixed(2)
                    ?? "—"}
                </strong>
              </div>

            </div>


            <p className="analysis-note">
              This assessment is generated from visual
              characteristics of the uploaded image.
              It is an environmental visual indicator,
              not a laboratory measurement of air quality.
            </p>

          </div>
        )}

      </div>

    </section>
  )
}

export default CitizenReport