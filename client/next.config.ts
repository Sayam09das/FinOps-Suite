import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/sign-in',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/sign-up',
        destination: '/register',
        permanent: false,
      },
      {
        source: '/auth/sign-in',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/auth/sign-up',
        destination: '/register',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
