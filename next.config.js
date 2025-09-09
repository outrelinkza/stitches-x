/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable hot reload and fast refresh
  reactStrictMode: true,
  swcMinify: true,
  
  // Remove static export to enable API routes
  // output: 'export', // This was causing API routes to not work
  
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true
  },
  
  // Ensure hot reload works properly
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig