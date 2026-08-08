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
 * The current time where Prince actually is, ticking. Renders without the time
 * on the server so the static HTML never ships a stale clock.
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
    <span className="footer__now">{now ? `${now.toLowerCase()} in San Francisco` : `San Francisco`}</span>
  )
}

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
