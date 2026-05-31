const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Required for @supabase/supabase-js v2 with Metro 0.81+ (Expo SDK 54)
// Metro's package exports resolver picks the wrong WebSocket implementation
// without this flag, causing "internet appears offline" in Expo Go.
config.resolver.unstable_enablePackageExports = false;

// Needed for @supabase/supabase-js CommonJS interop
config.resolver.sourceExts.push('cjs');

module.exports = config;
