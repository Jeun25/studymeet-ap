===============================================================
  STUDYMEET — Expo SDK 54 — Setup & Run Guide
  Last updated: May 2026
===============================================================

QUICK START (after downloading and unzipping)
----------------------------------------------
1. cd StudyMeet
2. cp .env.example .env
   → Edit .env with your Supabase URL and anon key (see Supabase section)
3. npm install
4. npx expo start --clear --tunnel
5. Open Expo Go on your iPhone → tap "Scan QR Code" → scan the QR in terminal


FULL STEP-BY-STEP INSTRUCTIONS
--------------------------------

STEP 1 — Prerequisites (do this once)
  • Node.js 18 or 20: https://nodejs.org
  • Expo Go on iPhone: search "Expo Go" in the App Store
  • Your iPhone and computer must be on the same Wi-Fi
    (or use --tunnel mode which works over the internet)

STEP 2 — Install dependencies
  cd StudyMeet
  npm install

  If you see any peer dependency warnings, ignore them — the
  versions in package.json are tested for SDK 54.

STEP 3 — Set up your Supabase environment
  a. Create a free Supabase project at https://supabase.com
  b. Run the SQL migrations in order:
       supabase/migrations/001_schema.sql
       supabase/migrations/002_rls.sql
       supabase/migrations/003_functions.sql
       supabase/migrations/004_storage.sql
     (Paste each file into Supabase → SQL Editor → Run)
  c. Copy your project credentials from Supabase → Settings → API
  d. Create your .env file:
       cp .env.example .env
     Then edit .env:
       EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
       EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

STEP 4 — Start the app
  npx expo start --clear --tunnel

  • "--clear" wipes the Metro cache (important after SDK upgrade)
  • "--tunnel" routes through Expo's servers — works even if your
    phone and computer are on different networks

STEP 5 — Open on iPhone
  a. Open Expo Go
  b. Tap "Scan QR Code"
  c. Point at the QR code shown in your terminal
  d. The app will bundle and launch (first load may take 30–60 sec)


TROUBLESHOOTING
---------------

"Something went wrong" on launch
  → Make sure your .env file exists and has valid Supabase credentials
  → Run: npx expo start --clear --tunnel

"Unable to resolve module" errors
  → Run: npm install
  → Then: npx expo start --clear --tunnel

App loads but shows blank/white screen
  → Check terminal for red errors
  → Make sure Supabase migrations have been run

"Network response timed out" in Expo Go
  → Use --tunnel mode (already set in the start:tunnel script)

Metro bundler crash
  → Delete .expo folder: rm -rf .expo
  → Then: npx expo start --clear --tunnel

TypeScript errors in editor (not blocking)
  → Run: npx tsc --noEmit to see them
  → These do not prevent the app from running

Port already in use
  → npx expo start --clear --tunnel --port 8082


NPM SCRIPTS
-----------
  npm start              → expo start
  npm run start:clear    → expo start --clear
  npm run start:tunnel   → expo start --clear --tunnel  ← USE THIS FOR IPHONE
  npm run ios            → open in iOS Simulator
  npm run android        → open in Android Emulator


PROJECT STRUCTURE
-----------------
StudyMeet/
├── app/                    Expo Router screens
│   ├── _layout.tsx         Root layout (auth guard, navigation)
│   ├── auth/               Login, signup, onboarding screens
│   ├── (tabs)/             Main tab screens
│   │   ├── dashboard/      Home dashboard
│   │   ├── discover/       Swipe/match discovery
│   │   ├── groups/         Study groups
│   │   ├── messages/       Message threads list
│   │   └── profile/        Your profile
│   └── modals/             Full-screen modals
├── assets/                 Images and fonts
│   └── images/             icon.png, splash.png, etc.
├── components/             Reusable UI components
├── constants/
│   └── config.ts           Colors, exam options, study resources
├── hooks/                  Custom React hooks
│   ├── useNotifications.ts Push notification setup
│   ├── useOnlineStatus.ts  Online/offline tracking
│   └── useRealtime.ts      Supabase realtime subscriptions
├── lib/
│   └── supabase.ts         Supabase client + TypeScript types
├── stores/
│   ├── authStore.ts        Auth state (Zustand)
│   └── uiStore.ts          Toast/loading state (Zustand)
├── supabase/
│   └── migrations/         SQL files to run in Supabase
├── utils/
│   └── index.ts            Helper functions
├── app.json                Expo configuration
├── babel.config.js         Babel (no nativewind)
├── metro.config.js         Metro bundler config
├── package.json            Dependencies (SDK 54)
├── tsconfig.json           TypeScript config
└── README.txt              ← You are here


SDK UPGRADE NOTES (51 → 54)
-----------------------------
Changes made during upgrade:
  • All expo-* packages updated to SDK 54 compatible versions
  • react-native updated to 0.76.9
  • react-native-reanimated updated to ~3.16.7
  • react-native-gesture-handler updated to ~2.21.2
  • react-native-safe-area-context updated to 5.4.0
  • nativewind removed (was not used — no className= in any file)
  • metro.config.js simplified (removed nativewind/metro dependency)
  • babel.config.js simplified (removed nativewind/babel plugin)
  • global.css removed (was only needed for nativewind)
  • expo-updates removed (requires native build; not compatible with Expo Go)
  • @gorhom/bottom-sheet removed (not used in any screen)
  • @shopify/flash-list removed (not used in any screen)
  • expo-av removed (not used in any screen)
  • expo-sharing removed (not used in any screen)
  • newArchEnabled: true added to app.json (React Native new arch for SDK 54)
  • All modal routes explicitly declared in root _layout.tsx
  • router.replace() calls use 'as any' cast for expo-router v4 typed routes


PACKAGES REMOVED (and why)
---------------------------
  nativewind          → Not used (0 className= found), caused Metro issues
  expo-updates        → Requires EAS/native build, breaks Expo Go
  @gorhom/bottom-sheet → Not imported anywhere in the codebase
  @shopify/flash-list → Not imported anywhere in the codebase
  expo-av             → Not imported anywhere in the codebase
  expo-sharing        → Not imported anywhere in the codebase
  tailwindcss         → Only needed with nativewind


SUPABASE STORAGE BUCKETS
-------------------------
Create these in Supabase → Storage:
  • avatars   (public bucket)
  • photos    (public bucket)


SUPPORT
-------
If the app fails to start after following these steps:
  1. Delete node_modules: rm -rf node_modules
  2. Delete .expo: rm -rf .expo
  3. npm install
  4. npx expo start --clear --tunnel

If you still have issues, check:
  https://docs.expo.dev/troubleshooting/
  https://github.com/expo/expo/issues

===============================================================
