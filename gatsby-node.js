const path = require(`path`)
const readingTime = require(`reading-time`)

const kebabCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, `$1-$2`)
    .replace(/[^a-zA-Z0-9]+/g, `-`)
    .replace(/^-+|-+$/g, ``)
    .toLowerCase()

const withLeadingSlash = (str) => `/${str}`.replace(/\/\/+/g, `/`).replace(/\/$/, ``) || `/`

/**
 * Two node types, distinguished by which gatsby-source-filesystem instance the
 * MDX file came from:
 *   content/posts/** -> Post  (dated, listed in the writing index, in the feed)
 *   content/pages/** -> Page  (undated, standalone, reached by inline link)
 * content/home/**    -> neither; imported directly as MDX by src/pages/index.jsx
 */
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type Post implements Node {
      id: ID!
      slug: String!
      title: String!
      date: Date! @dateformat
      year: Int!
      excerpt: String!
      description: String
      canonicalUrl: String
      tags: [String!]
      banner: File @fileByRelativePath
      timeToRead: Int!
      wordCount: Int!
      contentFilePath: String!
    }

    type Page implements Node {
      id: ID!
      slug: String!
      title: String!
      excerpt: String!
      description: String
      contentFilePath: String!
    }
  `)
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  if (node.internal.type !== `Mdx`) return

  const fileNode = getNode(node.parent)
  const source = fileNode.sourceInstanceName
  const { frontmatter } = node

  if (source === `posts`) {
    const stats = readingTime(node.body || ``)
    const slug = withLeadingSlash(frontmatter.slug || kebabCase(frontmatter.title))
    const fields = {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      year: new Date(frontmatter.date).getUTCFullYear(),
      excerpt: frontmatter.excerpt || node.excerpt || ``,
      description: frontmatter.description,
      canonicalUrl: frontmatter.canonicalUrl,
      tags: frontmatter.tags,
      banner: frontmatter.banner,
      timeToRead: Math.max(1, Math.round(stats.minutes)),
      wordCount: stats.words,
      contentFilePath: fileNode.absolutePath,
    }

    actions.createNode({
      ...fields,
      id: createNodeId(`${node.id} >>> Post`),
      parent: node.id,
      children: [],
      internal: {
        type: `Post`,
        contentDigest: createContentDigest(fields),
      },
    })
  }

  if (source === `pages`) {
    const fields = {
      slug: withLeadingSlash(frontmatter.slug || kebabCase(frontmatter.title)),
      title: frontmatter.title,
      excerpt: frontmatter.excerpt || node.excerpt || ``,
      description: frontmatter.description,
      contentFilePath: fileNode.absolutePath,
    }

    actions.createNode({
      ...fields,
      id: createNodeId(`${node.id} >>> Page`),
      parent: node.id,
      children: [],
      internal: {
        type: `Page`,
        contentDigest: createContentDigest(fields),
      },
    })
  }
}

/**
 * `excerpt` on Post/Page falls back to the MDX body when frontmatter omits it.
 * The Mdx node's own excerpt resolver isn't available at onCreateNode time, so
 * resolve it lazily here off the parent.
 */
exports.createResolvers = ({ createResolvers }) => {
  const excerptFromParent = {
    excerpt: {
      type: `String!`,
      args: { pruneLength: { type: `Int`, defaultValue: 160 } },
      async resolve(source, args, context, info) {
        if (source.excerpt) return source.excerpt
        const mdx = context.nodeModel.getNodeById({ id: source.parent })
        if (!mdx) return ``
        const type = info.schema.getType(`Mdx`)
        const resolver = type.getFields().excerpt.resolve
        return resolver(mdx, args, context, info)
      },
    },
  }

  createResolvers({ Post: excerptFromParent, Page: excerptFromParent })
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const postTemplate = path.resolve(`./src/templates/post.jsx`)
  const pageTemplate = path.resolve(`./src/templates/page.jsx`)

  const result = await graphql(`
    {
      allPost(sort: { date: DESC }) {
        nodes {
          slug
          contentFilePath
        }
      }
      allPage {
        nodes {
          slug
          contentFilePath
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error loading posts or pages`, result.errors)
    return
  }

  result.data.allPost.nodes.forEach((post) => {
    actions.createPage({
      path: post.slug,
      component: `${postTemplate}?__contentFilePath=${post.contentFilePath}`,
      context: { slug: post.slug },
    })
  })

  result.data.allPage.nodes.forEach((page) => {
    actions.createPage({
      path: page.slug,
      component: `${pageTemplate}?__contentFilePath=${page.contentFilePath}`,
      context: { slug: page.slug },
    })
  })
}
