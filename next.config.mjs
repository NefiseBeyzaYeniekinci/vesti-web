/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["iyzipay"],
    experimental: {
        serverComponentsExternalPackages: ["iyzipay"],
    },
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
