import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../layouts/index'
import StarRatingComponent from 'react-star-rating-component'

class Movie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movie: []
    }
  }

  fetchData() {
    fetch(`http://api.sinchang.me/douban/sinchangwen/movie/collect`)
      .then(response => {
        return response.json()
      })
      .then(movie => {
        this.setState({ movie })
      })
  }

  componentWillMount() {
    this.fetchData()
  }

  render() {
    const { data } = this.props
    const list = this.state.movie.map((item, index) => {
      const divStyle = {
        backgroundImage: 'url(' + item.poster + ')',
      }
      return (
        <li className="movie-item" key={index}>
          <a href={item.url}>
            <img src={item.poster}></img>
          </a>
          <StarRatingComponent 
            name={item.title} 
            starCount={5}
            value={Number(item.rate)}
          />
          <div className="movie-bg" style={divStyle}></div>
        </li>
      )
    })

    return (
      <Layout>
      <Helmet>
        <title>{`Watched Movie | ${data.site.siteMetadata.title}`}</title>
        <meta name="referrer" content="never" />
      </Helmet>
      <ul className="movie-container">
        { list }
      </ul>
      </Layout>
    )
  }
}

export default Movie

export const query = graphql`
  query MovieQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
