import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Social from '../components/social'
import Layout from '../layouts/index'

export default ({ data }) => {
  return (
    <Layout>
      <Helmet title={`Posts | ${data.site.siteMetadata.title}`} />
      <h2>Posts</h2>
      <ul className="menu">
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <h4 className="post-title">
              <a href={node.fields.slug}>{node.frontmatter.title}</a>
            </h4>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query PostsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true }, template: { ne: "markdown" } } }
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
