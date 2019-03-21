import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../layouts/index'

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <Layout>
      <Helmet
        title={`${post.frontmatter.title} | ${data.site.siteMetadata.title}`}
      />
      <div
        className="md-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </Layout>
  )
}

export const query = graphql`
  query MarkdownQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html,
      frontmatter {
        title
      }
    }
  }
`
