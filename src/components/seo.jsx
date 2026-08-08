import * as React from "react"
import { graphql, useStaticQuery, withPrefix } from "gatsby"

const useSiteMetadata = () => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteTitle
          siteTitleAlt
          siteUrl
          siteDescription
          siteImage
          siteLanguage
          author
        }
      }
    }
  `)

  return site.siteMetadata
}

const Seo = ({ title = ``, description = ``, pathname = ``, image = ``, canonicalUrl = ``, children }) => {
  const {
    siteTitle,
    siteTitleAlt,
    siteUrl,
    siteDescription,
    siteImage,
    siteLanguage,
    author,
  } = useSiteMetadata()

  const seo = {
    title: title ? `${title} — ${siteTitle}` : siteTitleAlt,
    description: description || siteDescription,
    url: `${siteUrl}${pathname}`,
    image: `${siteUrl}${image || siteImage}`,
  }

  return (
    <>
      <html lang={siteLanguage} />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="author" content={siteTitle} />
      <link rel="canonical" href={canonicalUrl || seo.url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content={author} />

      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f2f0ea" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#131311" />

      <link rel="icon" type="image/png" sizes="32x32" href={withPrefix(`/favicon-32x32.png`)} />
      <link rel="icon" type="image/png" sizes="16x16" href={withPrefix(`/favicon-16x16.png`)} />
      <link rel="apple-touch-icon" href={withPrefix(`/apple-touch-icon.png`)} />
      <link rel="alternate" type="application/rss+xml" title={siteTitle} href={withPrefix(`/rss.xml`)} />
      {children}
    </>
  )
}

export default Seo
