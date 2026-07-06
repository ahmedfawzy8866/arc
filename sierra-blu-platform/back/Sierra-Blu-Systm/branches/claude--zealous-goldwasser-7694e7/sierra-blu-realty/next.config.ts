import type { NextConfig } from "next";

const SERVER_ONLY_PACKAGES = [
  '@grpc/grpc-js',
  '@opentelemetry/exporter-trace-otlp-grpc',
  '@opentelemetry/exporter-trace-otlp-http',
  '@opentelemetry/exporter-logs-otlp-http',
  '@opentelemetry/sdk-node',
  '@opentelemetry/sdk-logs',
  '@opentelemetry/sdk-trace-node',
  '@opentelemetry/instrumentation-http',
  '@opentelemetry/instrumentation-express',
  'firebase-admin',
];

const nextConfig: NextConfig = {
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    '@grpc/grpc-js',
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/sdk-node',
    'firebase-admin',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.firebasestorage.app' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'sierra-blu.com' },
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/propertyfinder.xml",
        destination: "/api/propertyfinder",
      },
      {
        source: "/feed.xml",
        destination: "/api/propertyfinder",
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      SERVER_ONLY_PACKAGES.forEach(pkg => {
        config.resolve.alias[pkg] = false;
      });
    }
    return config;
  },
};

export default nextConfig;
