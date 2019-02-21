import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../layouts/index'

export default ({ data }) => {
  return (
    <Layout>
      <Helmet title={`About | ${data.site.siteMetadata.title}`} />
      <p>This is the about page</p>
    </Layout>
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
