import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Social from '../components/social'
import Layout from '../layouts/index'

export default ({ data }) => {
  return (
    <Layout>
      <Helmet title={`Home | ${data.site.siteMetadata.title}`} />
      <h1 className="name">
        Jeff Wen <span className="aka">(aka: sinchang)</span>
      </h1>
      <p>Web Developer, Living and working in Shanghai.</p>
      <div className="social-links">
        <Social />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
        }
      }
    }
  }
`
