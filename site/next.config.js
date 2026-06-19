/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    loader: 'akamai',
    path: '',
  },
  env: {
    PUBLIC_URL: '/',
  }
}

module.exports = nextConfig
