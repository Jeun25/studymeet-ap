===============================================================
  STUDYMEET — Expo SDK 54 — Setup & Run Guide
  Updated: May 2026 (includes LAN + tunnel connection fixes)
===============================================================


QUICK START
-----------
  cd StudyMeet
  cp .env.example .env          ← EDIT with your real Supabase credentials
  npm install
  npx expo start --clear --tunnel


WHAT WAS FIXED IN THIS VERSION
--------------------------------
Three issues prevented the app from connecting to iPhone Expo Go:

  FIX 1 — metro.config.js: Added unstable_enablePackageExports = false
    WHY: Expo SDK 54 uses Metro 0.81+ which enables package exports by default.
    @supabase/supabase-js v2 exports both 'browser' and 'node' conditions.
    Metro picks the wrong WebSocket implementation, causing a bundle error
    that Expo Go shows as "The Internet connection appears to be offline."
    This was the root cause of the LAN connection failure.

  FIX 2 — package.json: Added @expo/ngrok@^4.0.1 as devDependency
    WHY: expo start --tunnel requires @expo/ngrok to be installed locally.
    Without it, Expo tries to auto-install it at runtime, which times out
    in many environments causing "ngrok tunnel took too long to connect."

  FIX 3 — app.json: Removed placeholder EAS projectId
    WHY: The value "YOUR_EAS_PROJECT_ID" in extra.eas.projectId can cause
    Expo's tunnel authentication to fail. Removed for local Expo Go use.


STEP-BY-STEP SETUP
-------------------

STEP 1 — Create your .env file (REQUIRED)
  cp .env.example .env
  
  Open .env and fill in BOTH values:
    EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
  
  Get these from: supabase.com → your project → Settings → API
  The app CANNOT start without these — it will crash immediately.

STEP 2 — Install dependencies
  npm install
  
  This installs @expo/ngrok (now in devDependencies) which is required
  for tunnel mode to work.

STEP 3 — Start the app
  npx expo start --clear --tunnel
  
  Wait for the QR code to appear (may take 15-30 seconds for ngrok).
  
  Then in Expo Go on iPhone: tap Scan QR Code → scan the terminal QR.


CONNECTION TROUBLESHOOTING
---------------------------

--- TUNNEL MODE ISSUES ---

"ngrok tunnel took too long to connect"
  → Make sure you ran npm install (installs @expo/ngrok locally)
  → If still failing: npx expo install @expo/ngrok
  → Try again: npx expo start --clear --tunnel

"Tunnel connection failed" / ngrok auth error
  → Free ngrok has session limits. Wait 60 seconds and retry.
  → Or use LAN mode (see below) — faster and more reliable on same WiFi.

--- LAN MODE ISSUES ---

"The Internet connection appears to be offline"
  → This is usually the metro.config.js package exports issue (already fixed).
  → If you still see it after this fix:
      1. Make sure your iPhone and Mac are on the EXACT SAME WiFi network.
         Not "same router" — literally the same SSID. 
         Guest networks are isolated and won't work.
      2. Check your Mac firewall: System Settings → Network → Firewall
         → Allow incoming connections for "node"
      3. Try: npx expo start --clear --lan
         (forces LAN mode explicitly)

"Network request failed" on the Expo Go loading screen
  → Your .env file is missing or has wrong Supabase credentials.
  → Double-check the URL format: must start with https://
  → Double-check the anon key: must be the full JWT string

Metro stuck at "Starting Metro Bundler"
  → Delete cache: rm -rf .expo node_modules/.cache
  → Then: npx expo start --clear --tunnel

Bundle error / red screen after QR scan
  → Check the terminal for the actual error message
  → Most common cause: .env missing or wrong Supabase URL
  → Run: npx expo start --clear --tunnel (the --clear flag wipes bundle cache)

--- COMPLETE RESET (if nothing works) ---
  rm -rf node_modules .expo
  npm install
  npx expo start --clear --tunnel


SUPABASE SETUP (if you haven't done this yet)
-----------------------------------------------
  1. Create free project at https://supabase.com
  2. Run SQL migrations IN ORDER in Supabase → SQL Editor:
       supabase/migrations/001_schema.sql
       supabase/migrations/002_rls.sql
       supabase/migrations/003_functions.sql
       supabase/migrations/004_storage.sql
  3. Create storage buckets (Supabase → Storage → New bucket):
       avatars  (public)
       photos   (public)
  4. Copy credentials: Settings → API → Project URL + anon/public key
  5. Paste into your .env file


PROJECT STRUCTURE
-----------------
StudyMeet/
├── app/                    Expo Router screens
│   ├── _layout.tsx         Root layout (auth guard)
│   ├── auth/               Sign in, sign up, onboarding
│   ├── (tabs)/             5 main tab screens
│   └── modals/             Full-screen modal screens
├── assets/images/          icon.png, splash.png (placeholders — replace!)
├── constants/config.ts     Colors, exam options, study resources
├── hooks/                  useNotifications, useOnlineStatus, useRealtime
├── lib/supabase.ts         Supabase client + all TypeScript types
├── stores/                 authStore, uiStore (Zustand)
├── supabase/migrations/    SQL files to run once in Supabase
├── utils/index.ts          Date formatting helpers
├── app.json                Expo config (EAS placeholder removed)
├── babel.config.js         Babel (reanimated plugin only)
├── metro.config.js         Metro (package exports fix for supabase)
├── package.json            SDK 54 deps + @expo/ngrok devDep
└── .env.example            Copy to .env and fill in Supabase creds


NPM SCRIPTS
-----------
  npm run start:tunnel    →  npx expo start --clear --tunnel  ← USE THIS
  npm run start:clear     →  npx expo start --clear
  npm start               →  npx expo start


ASSETS NOTE
-----------
The placeholder icon.png / splash.png / adaptive-icon.png in assets/images/
are 1×1 pixel files. The app works fine with them in Expo Go.
To use real assets, replace them with proper PNG files:
  icon.png          1024×1024
  splash.png        1284×2778 (or any size, resizeMode: contain)
  adaptive-icon.png 1024×1024

===============================================================
