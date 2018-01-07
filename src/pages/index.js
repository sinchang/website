import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

export default ({ data }) => {
  console.log(data)
  return (
    <div>
      <Helmet title={`Home | ${data.site.siteMetadata.title}`} />
      <h1>sinchang</h1>
      <p>Web Developer, live and work in Shanghai.</p>
      <p className="social-links">
        <a href="https://github.com/sinchang">GitHub</a>
        <a href="https://twitter.com/sinchangwen">Twitter</a>
        <a href="https://t.me/sinchang">Telegram</a>
        <a href="/projects">Projects</a>        
        <a href="/about">About</a>
      </p>
      <ul>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <li key={node.id}>
            <h4 className="post-title">
              <Link to={node.fields.slug} target="_blank">{node.frontmatter.title}</Link>
            </h4>
          </li>
        ))}
      </ul>
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
