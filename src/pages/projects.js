import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Card from '../components/card'
import Layout from '../layouts/index'
import json from '../assets/projects.json'

export default ({ data }) => {
  return (
    <Layout>
      <Helmet title={`Projects | ${data.site.siteMetadata.title}`} />
      <h2>Projects 🎉</h2>
        {
          json.map((item, index) => {
            return (
              <Card data={item} key={index}></Card>
            )
          })
        }
    </Layout>
  )
}

export const query = graphql`
  query ProjectsQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`