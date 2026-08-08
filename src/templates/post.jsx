import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const Post = ({ data: { post }, children }) => (
  <Layout>
    <article className="stagger">
      <Link className="article__back" to="/">
        ← Prince Boucher
      </Link>
      <header className="article__header">
        <h1 className="article__title">{post.title}</h1>
        <p className="article__meta">
          <time dateTime={post.isoDate}>{post.date}</time>
          {` · `}
          {post.timeToRead} min read
        </p>
      </header>
      <div className="prose">{children}</div>
    </article>
  </Layout>
)

export default Post

export const Head = ({ data: { post } }) => (
  <Seo
    title={post.title}
    description={post.description || post.excerpt}
    pathname={post.slug}
    canonicalUrl={post.canonicalUrl}
    image={post.banner?.childImageSharp?.resize?.src}
  />
)

export const query = graphql`
  query ($slug: String!) {
    post(slug: { eq: $slug }) {
      slug
      title
      date(formatString: "MMMM D, YYYY")
      isoDate: date
      excerpt
      description
      canonicalUrl
      timeToRead
      banner {
        childImageSharp {
          resize(width: 1200, quality: 90) {
            src
          }
        }
      }
    }
  }
`
