import React from 'react'

export default ({ data }) => {
  const githubBtn = () => data.github_url ? <a href={data.github_url} className="card-link">GitHub</a> : ''
  const websiteBtn = () => data.website_url ? <a href={data.website_url} className="card-link">Website</a> : ''
	return (
		<div className="card">
      <img className="card-img-top" src={data.cover_image_url} alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">{data.name}</h5>
        <p className="card-text">{data.desc}</p>
        { githubBtn() }
        { websiteBtn() }
      </div>
    </div>
	)
}