import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import WritingIndex from "../components/writing-index"
import Bio from "../../content/home/bio.mdx"
import Projects from "../../content/home/projects.mdx"

const Homepage = ({ data: { allPost } }) => {
  const posts = allPost.nodes
  const newest = posts[0]

  return (
    <Layout>
      <div className="stagger">
        <header className="masthead">
          <h1 className="masthead__name">Prince Boucher</h1>
          {newest && (
            <p className="masthead__meta">
              Updated <time dateTime={newest.isoDate}>{newest.updated}</time>
            </p>
          )}
        </header>

        <div className="prose">
          <Bio />
        </div>

        <section className="section">
          <h2 className="section__label">Writing</h2>
          <WritingIndex posts={posts} />
        </section>

        <section className="section">
          <h2 className="section__label">Projects</h2>
          <div className="prose">
            <Projects />
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Homepage

export const Head = () => <Seo />

export const query = graphql`
  {
    allPost(sort: { date: DESC }) {
      nodes {
        slug
        title
        year
        date(formatString: "YYYY.MM.DD")
        updated: date(formatString: "MMM D, YYYY")
        isoDate: date
      }
    }
  }
`
