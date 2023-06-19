/** @type {import('next').NextConfig} */
const defaultRuntimeCaching = require("next-pwa/cache");
const nextConfig = {}

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    scope:"/",
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /\//,
        method: "GET",
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "index",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 24 * 60 * 60 * 365, // 1 year
          },
        },
      },
      ...defaultRuntimeCaching,
    ],
  });
  
module.exports = withPWA({
reactStrictMode: true,
});
