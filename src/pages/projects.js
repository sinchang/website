import React from 'react'
import Helmet from 'react-helmet'
import Card from '../components/card'
import json from '../assets/projects.json'

export default ({ data }) => {
  return (
    <div>
      <Helmet title={`Projects | ${data.site.siteMetadata.title}`} />
      <h2>Projects 🎉</h2>
        {
          json.map((item, index) => {
            return (
              <Card data={item} key={index}></Card>
            )
          })
        }
    </div>
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