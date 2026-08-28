/** @type {import('next').NextConfig} */
export default {
  eslint: {
    // No ESLint config in this project yet; `npm run typecheck` is the gate.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
}
