/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_API: "http://localhost:4000",
    // BACKEND_API: "https://kasir-belakang.vercel.app",
  }
}

module.exports = nextConfig
