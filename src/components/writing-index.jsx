import * as React from "react"
import { Link } from "gatsby"

const NEW_FOR_DAYS = 45

const groupByYear = (posts) => {
  const years = new Map()

  posts.forEach((post) => {
    if (!years.has(post.year)) years.set(post.year, [])
    years.get(post.year).push(post)
  })

  return [...years.entries()].sort((a, b) => b[0] - a[0])
}

const isRecent = (isoDate) => {
  const age = Date.now() - new Date(isoDate).getTime()
  return age >= 0 && age < NEW_FOR_DAYS * 24 * 60 * 60 * 1000
}

/**
 * One row. Posts carrying an externalUrl are published elsewhere, so they link
 * straight out instead of to a page on this site.
 */
const Row = ({ post, isNewest }) => {
  const external = Boolean(post.externalUrl)

  const inner = (
    <>
      <span className="index__title">
        {post.title}
        {external && (
          <span className="index__offsite" aria-hidden="true">
            ↗
          </span>
        )}
        {isNewest && isRecent(post.isoDate) && <span className="index__new">New</span>}
      </span>
      <time className="index__date" dateTime={post.isoDate}>
        {post.date}
      </time>
    </>
  )

  if (external) {
    return (
      <a className="index__row" href={post.externalUrl} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <Link className="index__row" to={post.slug}>
      {inner}
    </Link>
  )
}

/**
 * The writing index: rows of title + date, grouped by year, newest first.
 * Only the most recent post can carry the "New" marker, and only briefly.
 */
const WritingIndex = ({ posts }) => {
  if (!posts.length) {
    return <p className="index__empty">Nothing published yet.</p>
  }

  const newest = posts[0]

  return (
    <div className="index">
      {groupByYear(posts).map(([year, entries]) => (
        <section className="index__year" key={year}>
          <span className="index__yearLabel">{year}</span>
          <ul>
            {entries.map((post) => (
              <li key={post.slug}>
                <Row post={post} isNewest={post.slug === newest.slug} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default WritingIndex
