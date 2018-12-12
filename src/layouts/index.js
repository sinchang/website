import React from 'react'
import 'normalize.css'
import '../css/index.css'
import 'prismjs/themes/prism-solarizedlight.css'

export default ({ children }) => (
  <div style={{ margin: `0 auto`, maxWidth: 768, padding: `2rem 1rem` }}>
    {children()}
  </div>
)
