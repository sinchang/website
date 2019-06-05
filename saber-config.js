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
      }
    ],
    skills: [
      {
        topic: 'vue',
        description: `ElementUI Contributor`,
      },
      {
        topic: 'nodejs',
        description: `CNode Contributor`,
      },
      {
        topic: 'react',
        description: `Use React in my side projects`,
      }
    ]
  },

  permalinks: {
    page: '/:slug',
    post: '/posts/:slug'
  },

  plugins: [
    {
      resolve: 'saber-plugin-query-posts'
    }
  ]
}
