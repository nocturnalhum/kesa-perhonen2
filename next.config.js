/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'kesa-perhonen.s3.ca-central-1.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
