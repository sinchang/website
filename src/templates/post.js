import React from 'react'
import Helmet from 'react-helmet'

export default ({ data }) => {
  const post = data.markdownRemark
  return (
    <div>
      <Helmet
        title={`${post.frontmatter.title} | ${data.site.siteMetadata.title}`}
      />
      <h2>{post.frontmatter.title}</h2>
      <span className="post-date">{post.frontmatter.date}</span>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </div>
  )
}

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
