import React from 'react'
import Helmet from 'react-helmet'
import json from '../resources/projects.json'

export default ({ data }) => {
  return (
    <div>
      <Helmet title={`Projects | ${data.site.siteMetadata.title}`} />
      <h3 style={{ marginBottom: '30px' }}>My Project List</h3>
      <ul>
        {
          json.map((item, index) => {
            return (
              <li key={index}><a href={item.url} target="_blank">{ item.name }</a></li>
            )
          })
        }
      </ul>
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