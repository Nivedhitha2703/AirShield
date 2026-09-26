import { useState, type FormEvent } from "react"

function CitizenReport() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="card report-card">
      <div className="card-heading">
        <div>
          <span className="card-kicker">COMMUNITY SIGNAL</span>
          <h3>Report Pollution</h3>
        </div>
      </div>

      <p>
        Help AirShield improve local pollution intelligence by
        reporting what you observe.
      </p>

      {submitted ? (
        <div className="report-success">
          <div className="report-success-icon">✓</div>

          <div>
            <strong>Report submitted</strong>
            <p>
              Thank you. Your observation has been recorded for
              review.
            </p>
          </div>
        </div>
      ) : (
        <form className="report-form" onSubmit={handleSubmit}>
          <label>
            Pollution type
            <select defaultValue="">
              <option value="" disabled>
                Select type
              </option>
              <option>Smoke</option>
              <option>Dust</option>
              <option>Burning</option>
              <option>Industrial emissions</option>
              <option>Unknown</option>
            </select>
          </label>

          <label>
            Location
            <input
              type="text"
              placeholder="Enter location"
            />
          </label>

          <label>
            Description
            <textarea
              placeholder="Describe what you observed..."
            />
          </label>

          <label>
            Photo
            <input type="file" accept="image/*" />
          </label>

          <button type="submit">
            Submit Pollution Report
          </button>
        </form>
      )}
    </div>
  )
}

export default CitizenReport