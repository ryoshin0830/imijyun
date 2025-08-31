/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@imijun/ui", "@imijun/lib"],
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig