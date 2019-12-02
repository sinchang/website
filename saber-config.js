module.exports = {
  theme: 'portfolio',
  siteConfig: {
    description: 'Web Developer, Living and working in Shanghai.',
    url: 'htts://sinchang.me'
  },
  themeConfig: {
    style: 'dark',
    github: 'sinchang',
    twitter: 'sinchangwen',
    disqus: 'sinchang',
    projects: 'pinned-repos',
    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'About',
        link: '/about'
      },
      {
        text: 'Uses',
        link: '/uses'
      }
    ],
  },

  permalinks: {
    page: '/:slug',
    post: '/posts/:slug'
  },

  plugins: [
    {
      resolve: 'saber-plugin-query-posts'
    }, {
      resolve: 'saber-plugin-google-analytics',
      options: {
        trackId: 'UA-41610509-10'
      }
    }
  ]
}
