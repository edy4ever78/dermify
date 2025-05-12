/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Enable App Router
  },
  // Disable the Pages Router API routes
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'].filter(ext => 
    !ext.includes('api')
  ),
};

module.exports = nextConfig;
