import React from 'react'
import Helmet from 'react-helmet'

export default ({ data }) => {
  return (
    <div>
      <Helmet title={`About | ${data.site.siteMetadata.title}`} />
      <p>This is the about page</p>
    </div>
  )
}

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
