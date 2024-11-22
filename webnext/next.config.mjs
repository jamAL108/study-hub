/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i9.ytimg.com","i.ytimg.com","api.microlink.io"],
  },
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
