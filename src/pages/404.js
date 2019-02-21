import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../layouts/index'

export default ({ data }) => {
  return (
    <Layout>
      <Helmet title={`Page not found | ${data.site.siteMetadata.title}`} />
      <p>Page not found</p>
    </Layout>
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
