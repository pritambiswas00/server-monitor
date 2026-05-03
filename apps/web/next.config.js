/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    PORT: '3001',
  },
  // Transpile workspace packages so Next.js compiles their TypeScript
  transpilePackages: ['@repo/api-client', '@repo/ui'],
};

export default nextConfig;
