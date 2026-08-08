import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import WritingIndex from "../components/writing-index"
import Bio from "../../content/home/bio.mdx"
import Projects from "../../content/home/projects.mdx"

const Homepage = ({ data: { allPost, siteBuildMetadata } }) => {
  const posts = allPost.nodes

  return (
    <Layout>
      <div className="stagger">
        <header className="masthead">
          <h1 className="masthead__name">Prince Boucher</h1>
          <p className="masthead__meta">
            Updated{` `}
            <time dateTime={siteBuildMetadata.isoBuildTime}>{siteBuildMetadata.buildTime}</time>
          </p>
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
        externalUrl
        date(formatString: "YYYY.MM.DD")
        isoDate: date
      }
    }
    siteBuildMetadata {
      buildTime(formatString: "MMM D, YYYY")
      isoBuildTime: buildTime
    }
  }
`
