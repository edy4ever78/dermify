/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'dermify.com']
    }
  },
  images: {
    domains: ['localhost', 'dermify.com'],
  },
  // Enable standalone output for Docker
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
  // Disable the Pages Router API routes
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'].filter(ext => 
    !ext.includes('api')
  ),
};

module.exports = nextConfig;
