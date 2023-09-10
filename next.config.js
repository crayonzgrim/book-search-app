/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  images: {
    domains: ['itbook.store']
  }
};

module.exports = nextConfig;
