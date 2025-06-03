// client/next.config.js*

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Reescribimos todas las rutas /api/* hacia localhost:4000/api/*
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig
