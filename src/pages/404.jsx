import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFound = () => (
  <Layout>
    <article className="stagger">
      <header className="article__header">
        <h1 className="article__title">Not found</h1>
      </header>
      <div className="prose">
        <p>
          There's nothing at this address. Try the{` `}
          <Link className="link" to="/">
            homepage
          </Link>
          .
        </p>
      </div>
    </article>
  </Layout>
)

export default NotFound

export const Head = () => <Seo title="Not found" />
