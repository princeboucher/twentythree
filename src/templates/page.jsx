import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const Page = ({ data: { page }, children }) => (
  <Layout>
    <article className="stagger">
      <Link className="article__back" to="/">
        ← Prince Boucher
      </Link>
      <header className="article__header">
        <h1 className="article__title">{page.title}</h1>
      </header>
      <div className="prose">{children}</div>
    </article>
  </Layout>
)

export default Page

export const Head = ({ data: { page } }) => (
  <Seo title={page.title} description={page.description || page.excerpt} pathname={page.slug} />
)

export const query = graphql`
  query ($slug: String!) {
    page(slug: { eq: $slug }) {
      slug
      title
      excerpt
      description
    }
  }
`
