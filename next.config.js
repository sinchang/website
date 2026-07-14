/** @type {import('next').NextConfig} */

module.exports = ({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['unavatar.io', 'testingcf.jsdelivr.net', 'now-playing-profile-rho.vercel.app', 'i.scdn.co'],
  },
  webpack: (
    config,
  ) => {
    config.resolve.fallback = {
      fs: require.resolve('browserify-fs'), // or 'empty' if you prefer an empty module
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    }

    // Add the 'module' configuration for handling .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'javascript/auto',
    })

    return config
  },
})
