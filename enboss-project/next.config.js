/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // This wildcard allows any hostname for HTTP
      },
      {
        protocol: 'https',
        hostname: '**', // This wildcard allows any hostname for HTTPS
      },
    ],
  },
}

module.exports = nextConfig
