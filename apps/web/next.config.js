/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ]
  },
  images: {
    domains: ['localhost'],
  },
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig