import path from "path";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all https images
      },
      {
        protocol: 'http',
        hostname: '**', // optional for http sources
      },
    ],
  },
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

module.exports = withNextIntl(nextConfig);
