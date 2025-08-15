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
    PREVIEW_CONTROLLER: process.env.PREVIEW_CONTROLLER || '',
  },
  // Asset prefix for CloudFront + S3
  assetPrefix:
    process.env.NODE_ENV === 'production' ? process.env.ASSET_PREFIX : '',
  // Output static for S3 deployment
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: false,
    remotePatterns: [
      ...(process.env.NODE_ENV !== 'production'
        ? [
            {
              hostname: 'localhost',
              port: '4200',
            },
          ]
        : []),
      {
        hostname: 'picsum.photos',
      },
      ...(process.env.NODE_ENV === 'production' &&
      process.env.PREVIEW_CONTROLLER
        ? [
            {
              hostname: process.env.PREVIEW_CONTROLLER,
            },
          ]
        : []),
    ],
  },
};

module.exports = nextConfig;
