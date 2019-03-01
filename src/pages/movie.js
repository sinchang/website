import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import StarRatingComponent from 'react-star-rating-component'
import axios from 'axios'
import ReactLoading from 'react-loading';

import Layout from '../layouts/index'

class Movie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movie: [],
      loading: true
    }
  }

  fetchData() {
    axios(`https://api.sinchang.me/douban/sinchangwen/movie/collect`)
      .then(res => {
        this.setState({ 
          movie: res.data,
          loading: false
        })
      })
      .catch(() => {
        this.setState({ loading: false })
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
      <div>
        <Helmet>
          <title>{`Watched Movie | ${data.site.siteMetadata.title}`}</title>
          <meta name="referrer" content="never" />
        </Helmet>
        <ul className="movie-container">
          { list }
        </ul>
    { this.state.loading && <ReactLoading type="bars" color="#fff" height={50} width={50} className="loading" /> }
      </div>
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
