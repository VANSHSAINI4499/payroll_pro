/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile Three.js packages for SSR compatibility
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

module.exports = nextConfig;
