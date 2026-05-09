/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // 1. Use a private env variable (e.g., BACKEND_URL) instead of NEXT_PUBLIC_
    const backApi = process.env.BACKEND_URL || "http://localhost:5000"

    return [
      {
        // When frontend calls /api/something
        source: "/api/:path*",

        // Example A: Use this if your backend expects http://localhost:5000/something
        destination: `${backApi}/:path*`,

        // Example B: Use this INSTEAD if your backend expects http://localhost:5000/api/something
        // destination: `${backApi}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
