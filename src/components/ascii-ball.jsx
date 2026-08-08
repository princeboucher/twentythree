import * as React from "react"

/**
 * ASCII tennis ball, fixed to the top-right corner.
 *
 * The render loop is Prince's. It's wrapped here so it only runs in the
 * browser (Gatsby prerenders on the server, where there's no document), and so
 * it re-initializes when the OS color scheme flips — the light/dark branch
 * changes the character ramp, not just the colors, so a CSS variable swap
 * alone wouldn't be enough.
 */

const W = 26
const H = 13
const FPS = 18
const SPEED = 0.45
const FONT = 9

const COLORS = {
  light: { fuzz: `#a9b616`, seam: `#a3abb3` },
  dark: { fuzz: `rgba(190,205,60,.75)`, seam: `#e8e6da` },
}

// tennis-ball seam curve on the unit sphere (a + b = 1)
const SEAM = (() => {
  const a = 0.72
  const b = 0.28
  const c = 2 * Math.sqrt(a * b)
  const pts = []
  const N = 240
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2
    pts.push([
      a * Math.cos(t) + b * Math.cos(3 * t),
      a * Math.sin(t) - b * Math.sin(3 * t),
      c * Math.sin(2 * t),
    ])
  }
  return pts
})()

const RAMP = `..::-=+*#`
const TILT = 0.45
const SEAM_W = 0.11

const L = (() => {
  const v = [-0.4, -0.6, 0.8]
  const m = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  return [v[0] / m, v[1] / m, v[2] / m]
})()

const frame = (angle, theme) => {
  const ct = Math.cos(TILT)
  const st = Math.sin(TILT)
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  const rx = (W - 1) / 2
  const ry = (H - 1) / 2
  let out = ``

  for (let r = 0; r < H; r++) {
    let runSeam = null
    let buf = ``

    for (let c = 0; c < W; c++) {
      const nx = (c - rx) / rx
      const ny = (r - ry) / ry
      const d2 = nx * nx + ny * ny
      let ch
      let isSeam = false

      if (d2 > 0.97) {
        ch = ` `
      } else {
        const nz = Math.sqrt(1 - d2)
        const lum = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2])
        // tilt the axis a little (about z), then spin about the horizontal
        // x-axis -> the surface and seams roll north-to-south
        const x1 = nx * ct - ny * st
        const y1 = nx * st + ny * ct
        const y2 = y1 * ca - nz * sa
        const z2 = y1 * sa + nz * ca
        let md = 9

        for (let i = 0; i < SEAM.length; i++) {
          const s = SEAM[i]
          const dx = x1 - s[0]
          const dy = y2 - s[1]
          const dz = z2 - s[2]
          const dd = dx * dx + dy * dy + dz * dz
          if (dd < md) md = dd
        }

        if (Math.sqrt(md) < SEAM_W) {
          ch = lum > 0.25 ? `@` : `o`
          isSeam = true
        } else {
          // on white, ink density = shadow; on dark, ink density = light
          const shade = theme === `light` ? 1 - lum : lum
          let idx = Math.min(RAMP.length - 1, Math.floor(shade * RAMP.length))
          if (theme === `light` && idx < 2) idx = 2 // keep the lit side visible on white
          ch = RAMP[idx]
        }
      }

      if (isSeam !== runSeam && buf) {
        out += runSeam ? `<span class="atb-s">${buf}</span>` : buf
        buf = ``
      }
      runSeam = isSeam
      buf += ch
    }

    out += runSeam ? `<span class="atb-s">${buf}</span>` : buf
    out += `\n`
  }

  return out
}

/** Mounts one ball for a given theme. Returns its teardown. */
const mount = (theme) => {
  const { fuzz, seam } = COLORS[theme]

  const el = document.createElement(`pre`)
  el.setAttribute(`aria-hidden`, `true`)
  el.className = `ascii-tennis-ball atb-${theme}`
  el.style.cssText =
    `margin:0;pointer-events:none;user-select:none;` +
    `font:${FONT}px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;` +
    `letter-spacing:0;white-space:pre;color:var(--atb-fuzz, ${fuzz});` +
    `position:fixed;top:18px;right:22px;z-index:20;`
  document.body.appendChild(el)

  // The grid assumes a 2:1 cell aspect, so measure the real character width
  // and pin line-height to twice it.
  const probe = document.createElement(`span`)
  probe.style.cssText =
    `position:absolute;visibility:hidden;` +
    `font:${FONT}px/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre;`
  probe.textContent = `MMMMMMMMMM`
  document.body.appendChild(probe)
  const cw = probe.getBoundingClientRect().width / 10
  probe.remove()
  if (cw > 0) el.style.lineHeight = `${(cw * 2).toFixed(2)}px`

  const styleId = `atb-style-${theme}`
  let style = document.getElementById(styleId)
  if (!style) {
    style = document.createElement(`style`)
    style.id = styleId
    style.textContent = `.ascii-tennis-ball.atb-${theme} .atb-s{color:var(--atb-seam, ${seam});}`
    document.head.appendChild(style)
  }

  const reduced = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  if (reduced) {
    el.innerHTML = frame(0.9, theme)
    return () => el.remove()
  }

  let raf = 0
  let last = 0
  const interval = 1000 / FPS

  const tick = (now) => {
    raf = requestAnimationFrame(tick)
    if (now - last < interval) return
    last = now
    el.innerHTML = frame((now / 1000) * SPEED, theme)
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    el.remove()
  }
}

const AsciiBall = () => {
  React.useEffect(() => {
    const query = window.matchMedia(`(prefers-color-scheme: dark)`)
    let teardown = mount(query.matches ? `dark` : `light`)

    const onChange = (event) => {
      teardown()
      teardown = mount(event.matches ? `dark` : `light`)
    }

    query.addEventListener(`change`, onChange)
    return () => {
      query.removeEventListener(`change`, onChange)
      teardown()
    }
  }, [])

  return null
}

export default AsciiBall
