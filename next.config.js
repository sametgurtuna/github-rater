/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/github-profile-analyzer',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig