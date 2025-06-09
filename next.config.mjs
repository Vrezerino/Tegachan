const nextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'app');
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/",
      },
      {
        source: "/:path*",
        destination: "/dashboard/:path*",
      },
    ];
  },
  /*
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  */
};

export default nextConfig;
