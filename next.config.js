/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost', 'dermify.com'],
  },
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
