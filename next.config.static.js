/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // Configure the port
  transpilePackages: ['@preview-workspace/preview-lib'],
  // Set the port for development
  env: {
    PORT: '4201',
    NEXT_APP_DOMAIN: process.env.NEXT_APP_DOMAIN || '',
  },
  // Output static for S3 deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: 'localhost',
        port: '4200',
      },
      {
        hostname: 'picsum.photos',
      },
    ],
  },
};

module.exports = nextConfig;
