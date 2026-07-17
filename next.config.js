/** @type {import('next').NextConfig} */

module.exports = ({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'unavatar.io' },
      { protocol: 'https', hostname: 'testingcf.jsdelivr.net' },
      { protocol: 'https', hostname: 'now-playing-profile-rho.vercel.app' },
      { protocol: 'https', hostname: 'i.scdn.co' },
    ],
  },
})
