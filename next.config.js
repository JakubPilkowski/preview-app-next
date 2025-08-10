//@ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // Configure the port
  transpilePackages: ['@preview-workspace/preview-lib'],
  // Set the port for development
  env: {
    PORT: '4201',
  },
  // Asset prefix for CloudFront + S3
  assetPrefix:
    process.env.NODE_ENV === 'production'
      ? process.env.ASSET_PREFIX ||
        'https://your-cloudfront-domain.cloudfront.net'
      : '',
  // Output static for S3 deployment
  output: 'standalone',
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
