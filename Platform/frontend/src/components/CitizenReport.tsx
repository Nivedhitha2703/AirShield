import { useState } from "react"
import { submitCitizenReport } from "../services/api"

function CitizenReport() {
  const [pollutionType, setPollutionType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<File | undefined>()
  const [status, setStatus] = useState("")

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setStatus("Submitting report...")

    try {
      await submitCitizenReport({
        pollutionType,
        location,
        description,
        image,
      })

      setStatus(
        "Report received successfully."
      )

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

      </div>

    </section>
  )
}

export default CitizenReport