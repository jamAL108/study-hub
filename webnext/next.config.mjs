/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i9.ytimg.com","i.ytimg.com"],
  },
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
