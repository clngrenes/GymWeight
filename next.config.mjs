const isProd = process.env.NODE_ENV === 'production'

// Try to import next-pwa dynamically. Some build environments (or older
// CI runners) may not have the optional package available at config-eval
// time. In that case we fall back to an identity wrapper so the build
// continues without PWA support.
let withPWACfg = (cfg) => cfg
try {
  const mod = await import('next-pwa')
  const withPWA = mod?.default ?? mod
  if (typeof withPWA === 'function') {
    withPWACfg = withPWA({ dest: 'public', disable: !isProd, register: true, skipWaiting: true })
  }
} catch (err) {
  // next-pwa not available or failed to load — continue without it.
  // This prevents build-time crashes on hosts that don't install optional
  // packages or where native binaries aren't available.
  // console.warn('next-pwa not available; continuing without PWA plugin')
}

const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '2mb' } }
}

export default withPWACfg(nextConfig)