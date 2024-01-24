/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_API: "http://localhost:4000",
  }
}

module.exports = nextConfig
