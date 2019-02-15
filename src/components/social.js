import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faTwitter,
  faTelegram
} from '@fortawesome/free-brands-svg-icons'
import { faCode, faEnvelope } from '@fortawesome/free-solid-svg-icons'

library.add(
  faGithub,
  faTwitter,
  faTelegram,
  faCode
)

export default () => {
	return (
		<div>
      <a href="https://github.com/sinchang">
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <a href="https://twitter.com/sinchangwen">
        <FontAwesomeIcon icon={faTwitter} />
      </a>
      <a href="https://t.me/sinchang">
        <FontAwesomeIcon icon={faTelegram} />
      </a>
      <a href="mailto:hi@sinchang.me">
        <FontAwesomeIcon icon={faEnvelope} />
      </a>
      <a href="/projects" alt="projects">
        <FontAwesomeIcon icon={faCode}/>
      </a>
    </div>
	)
}