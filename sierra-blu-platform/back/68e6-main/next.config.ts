import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

// Packages that must never be bundled client-side (native binaries / gRPC)
const SERVER_ONLY_PACKAGES = [
  '@grpc/grpc-js',
  '@opentelemetry/exporter-trace-otlp-grpc',
  '@opentelemetry/exporter-trace-otlp-http',
  '@opentelemetry/exporter-logs-otlp-http',
  '@opentelemetry/otlp-transformer',
  '@opentelemetry/sdk-node',
  '@opentelemetry/sdk-logs',
  '@opentelemetry/sdk-trace-node',
  '@opentelemetry/sdk-trace-base',
  '@opentelemetry/instrumentation-http',
  '@opentelemetry/instrumentation-express',
  '@opentelemetry/resources',
  '@arizeai/openinference-semantic-conventions',
  'firebase-admin',
];


const nextConfig: NextConfig = {
  serverExternalPackages: [
    // gRPC + OpenTelemetry — server-only, skip webpack bundling entirely
    '@grpc/grpc-js',
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/exporter-trace-otlp-http',
    '@opentelemetry/exporter-logs-otlp-http',
    '@opentelemetry/otlp-transformer',
    '@opentelemetry/sdk-node',
    '@opentelemetry/sdk-logs',
    '@opentelemetry/sdk-trace-node',
    '@opentelemetry/sdk-trace-base',
    '@opentelemetry/instrumentation-http',
    '@opentelemetry/instrumentation-express',
    '@opentelemetry/resources',
    '@arizeai/openinference-semantic-conventions',
    // Firebase Admin
    'firebase-admin',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.firebasestorage.app' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
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
  turbopack: {
    resolveAlias: {
      '@grpc/grpc-js': './lib/stubs/empty.js',
      '@opentelemetry/exporter-trace-otlp-grpc': './lib/stubs/empty.js',
      '@opentelemetry/exporter-trace-otlp-http': './lib/stubs/empty.js',
      '@opentelemetry/exporter-logs-otlp-http': './lib/stubs/empty.js',
      '@opentelemetry/sdk-node': './lib/stubs/empty.js',
      '@opentelemetry/sdk-logs': './lib/stubs/empty.js',
      '@opentelemetry/sdk-trace-node': './lib/stubs/empty.js',
      '@opentelemetry/instrumentation-http': './lib/stubs/empty.js',
      '@opentelemetry/instrumentation-express': './lib/stubs/empty.js',
      'firebase-admin': './lib/stubs/empty.js',
    }
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Stub all server-only packages to empty modules in the browser bundle
      SERVER_ONLY_PACKAGES.forEach(pkg => {
        config.resolve.alias[pkg] = false;
      });
    }
    // Silence protobufjs dynamic-require warning from @opentelemetry/otlp-transformer
    // Safe: these packages are server-external and never bundled into client chunks
    config.module = config.module || {};
    config.module.noParse = [
      ...(Array.isArray(config.module.noParse) ? config.module.noParse : []),
      /protobufjs[\\/]src[\\/]util[\\/]inquire/,
    ];
    return config;
  },
};

export default withNextIntl(nextConfig);
