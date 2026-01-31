/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['loremflickr.com', 'zzkhbikxefjfapceohjh.supabase.co'],
  },
  env: {
    NEXT_PLAYFABTITLEID: process.env.NEXT_PLAYFAB_TITLE_ID,
    NEXT_PLAYFABKEY: process.env.NEXT_PLAYFAB_KEY
  }
}

module.exports = nextConfig
