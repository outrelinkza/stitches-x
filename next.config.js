/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable hot reload and fast refresh
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static export for Vercel
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig

  // Ensure hot reload works properly
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
