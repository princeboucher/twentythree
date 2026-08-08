import * as React from "react"
import Link from "./link"

/**
 * Passed to MDXProvider so authored markdown links pick up the site's link
 * treatment and internal/external handling without any per-file markup.
 */
const MdxComponents = {
  a: (props) => <Link {...props} />,
}

export default MdxComponents
