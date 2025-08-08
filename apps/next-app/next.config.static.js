//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
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

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
