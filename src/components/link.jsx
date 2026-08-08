import * as React from "react"
import { Link as GatsbyLink } from "gatsby"

const isInternal = (href = ``) => /^\/(?!\/)/.test(href)

/**
 * Single link component for both MDX and JSX. Internal hrefs get Gatsby's
 * client-side Link; everything else gets a plain anchor with rel/target.
 */
const Link = ({ href, to, children, className = `link`, ...rest }) => {
  const target = href ?? to

  if (isInternal(target)) {
    return (
      <GatsbyLink to={target} className={className} {...rest}>
        {children}
      </GatsbyLink>
    )
  }

  return (
    <a href={target} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

export default Link
