/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "placehold.co"],
  },
};

module.exports = nextConfig;
