/** @type {import('next').NextConfig} */

module.exports = ({
  reactStrictMode: true,
  // getStaticProps loads public/sql-wasm.wasm from the filesystem at
  // runtime (ISR revalidation runs in a lambda); the path is computed
  // dynamically, so output file tracing can't discover it on its own.
  outputFileTracingIncludes: {
    '/': ['./public/sql-wasm.wasm'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'unavatar.io' },
      { protocol: 'https', hostname: 'testingcf.jsdelivr.net' },
      { protocol: 'https', hostname: 'now-playing-profile-rho.vercel.app' },
      { protocol: 'https', hostname: 'i.scdn.co' },
    ],
  },
})
