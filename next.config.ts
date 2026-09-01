import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/home', destination: '/', permanent: true }]
  },
  async rewrites() {
    // Markdown twins for AI readability — specific patterns first.
    return [
      { source: '/index.md', destination: '/md/page/home' },
      { source: '/events/:slug.md', destination: '/md/event/:slug' },
      { source: '/posts/:slug.md', destination: '/md/post/:slug' },
      { source: '/:slug.md', destination: '/md/page/:slug' },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
