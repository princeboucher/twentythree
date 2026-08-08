const remarkGfm = require(`remark-gfm`)

const siteUrl = `https://princeboucher.com`

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    siteTitle: `Prince Boucher`,
    siteTitleAlt: `Prince Boucher — Applied Generalist`,
    siteHeadline: `Prince Boucher — artist, organizer, entrepreneur`,
    siteUrl,
    siteDescription: `Ideas and projects from the investigations of Prince Boucher.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `en`,
    author: `@princeboucher`,
  },
  trailingSlash: `never`,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `posts`, path: `${__dirname}/content/posts` },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `pages`, path: `${__dirname}/content/pages` },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `home`, path: `${__dirname}/content/home` },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 640,
              quality: 90,
              linkImagesToOriginal: false,
              backgroundColor: `transparent`,
              withWebp: true,
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: { output: `/` },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Prince Boucher`,
        short_name: `Prince Boucher`,
        description: `Ideas and projects from the investigations of Prince Boucher.`,
        start_url: `/`,
        background_color: `#f3f1ec`,
        theme_color: `#f3f1ec`,
        display: `standalone`,
        icons: [
          { src: `/android-chrome-192x192.png`, sizes: `192x192`, type: `image/png` },
          { src: `/android-chrome-512x512.png`, sizes: `512x512`, type: `image/png` },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [`G-B4E3Q40Z83`],
        gtagConfig: { anonymize_ip: true },
        pluginConfig: { head: true },
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title: siteTitle
                description: siteDescription
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allPost } }) =>
              allPost.nodes.map((post) => {
                const url = site.siteMetadata.siteUrl + post.slug
                const content = `<p>${post.excerpt}</p><p><a href="${url}">Keep reading</a></p>`

                return {
                  title: post.title,
                  date: post.date,
                  excerpt: post.excerpt,
                  url,
                  guid: url,
                  custom_elements: [{ "content:encoded": content }],
                }
              }),
            query: `{
  allPost(sort: {date: DESC}) {
    nodes {
      title
      date(formatString: "MMMM D, YYYY")
      excerpt
      slug
    }
  }
}`,
            output: `rss.xml`,
            title: `Prince Boucher`,
          },
        ],
      },
    },
  ],
}
