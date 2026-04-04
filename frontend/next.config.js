/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile Three.js packages for SSR compatibility
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  // Prevent ESLint/TS errors from blocking Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable image optimization (no external image domains needed)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
