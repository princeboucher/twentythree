import * as React from "react"
import { MDXProvider } from "@mdx-js/react"
import MdxComponents from "./mdx-components"
import Footer from "./footer"
import AsciiBall from "./ascii-ball"
import "../styles/global.css"

const Layout = ({ children }) => (
  <MDXProvider components={MdxComponents}>
    <a className="skip-link" href="#content">
      Skip to content
    </a>
    <AsciiBall />
    <div className="shell">
      <main id="content">{children}</main>
      <Footer />
    </div>
  </MDXProvider>
)

export default Layout
