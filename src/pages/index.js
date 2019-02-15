import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import Social from '../components/social'

export default ({ data }) => {
  return (
    <div>
      <Helmet title={`Home | ${data.site.siteMetadata.title}`} />
      <h1>
        Jeff Wen <span className="aka">(aka: sinchang)</span>
      </h1>
      <p>Web Developer, Living and working in Shanghai.</p>
      <div className="social-links">
        <Social />
      </div>
    </div>
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
