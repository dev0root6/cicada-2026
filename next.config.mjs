/** @type {import('next').NextConfig} */
export default {
  eslint: {
    // No ESLint config in this project yet; `npm run typecheck` is the gate.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return {
      // The teaser in public/landing is the front door; the full site starts
      // at /home. beforeFiles so it wins over any page route at "/".
      beforeFiles: [{ source: "/", destination: "/landing/index.html" }],
    }
  },
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
}
