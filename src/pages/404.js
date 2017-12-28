import React from 'react'
import Helmet from 'react-helmet'

export default ({ data }) => {
  return (
    <div>
      <Helmet title={`Page not found | ${data.site.siteMetadata.title}`} />
      <p>Page not found</p>
    </div>
  )
}

export const query = graphql`
  query NotFoundQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
