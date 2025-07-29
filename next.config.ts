// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_IMAGE_DOMAIN], // Use env variable for Supabase domain
  },
}

module.exports = nextConfig
