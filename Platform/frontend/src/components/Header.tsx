function Header() {
  return (
    <header className="header">
      <a className="brand" href="#top">
        <div className="brand-icon">🛡️</div>

        <div>
          <h1>AirShield</h1>
          <p>Hyperlocal Pollution Intelligence</p>
        </div>
      </a>

      <nav className="header-nav">
        <a href="#pollution-intelligence">
          Pollution Map
        </a>

        <a href="#risk-intelligence">
          Intelligence
        </a>

        <a href="#alerts">
          Alerts
        </a>

        <a href="#report">
          Report
        </a>
      </nav>

      <div className="header-status">
        <span className="status-dot" />
        <span>AirShield Online</span>
      </div>
    </header>
  )
}

export default Header