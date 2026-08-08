import * as React from "react"

const TIME_ZONE = `America/Los_Angeles`

const formatter = () =>
  new Intl.DateTimeFormat(`en-US`, {
    timeZone: TIME_ZONE,
    hour: `numeric`,
    minute: `2-digit`,
    hour12: true,
  })

/**
 * Signature detail: the current time where Prince actually is, ticking, next to
 * a ball that keeps rolling. Renders empty on the server so the static HTML
 * never ships a stale clock.
 */
const LocalTime = () => {
  const [now, setNow] = React.useState(null)

  React.useEffect(() => {
    const fmt = formatter()
    const tick = () => setNow(fmt.format(new Date()))

    tick()
    const id = setInterval(tick, 10_000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="footer__now">
      <Ball />
      <span>{now ? `${now.toLowerCase()} in San Francisco` : `San Francisco`}</span>
    </span>
  )
}

const Ball = () => (
  <svg className="ball" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4.2 6.6C7.6 9 8.9 13.4 7.4 17.7M19.8 6.6C16.4 9 15.1 13.4 16.6 17.7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const Footer = () => (
  <footer className="footer">
    <LocalTime />
    <nav className="footer__links">
      <a className="footer__link" href="https://twitter.com/princeboucher" target="_blank" rel="noopener noreferrer">
        X
      </a>
      <a
        className="footer__link"
        href="https://www.instagram.com/princeboucher"
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram
      </a>
      <a className="footer__link" href="/rss.xml">
        RSS
      </a>
    </nav>
  </footer>
)

export default Footer
