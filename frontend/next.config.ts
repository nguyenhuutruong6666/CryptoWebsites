/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bin.bnbstatic.com', 'cryptologos.cc'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  },
};

export default nextConfig;
