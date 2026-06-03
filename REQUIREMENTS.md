# SkinSense — Full Product Requirements
> AI-Powered Skin Analysis & Personalized Care Mobile App  
> Target: React Native (iOS + Android) | Project Complete: June 20, 2026 | App Store Launch: June 27, 2026

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Navigation Architecture](#5-navigation-architecture)
6. [All Pages & Screens](#6-all-pages--screens)
7. [Core Features & Logic](#7-core-features--logic)
8. [AI Integration](#8-ai-integration)
9. [State Management](#9-state-management)
10. [API & Backend](#10-api--backend)
11. [Permissions & Device APIs](#11-permissions--device-apis)
12. [Data Models](#12-data-models)
13. [Notifications](#13-notifications)
14. [Analytics](#14-analytics)
15. [Performance Requirements](#15-performance-requirements)
16. [Error Handling](#16-error-handling)
17. [Testing Requirements](#17-testing-requirements)
18. [Launch Checklist](#18-launch-checklist)

---

## 1. Project Overview

### App Identity
- **App Name:** SkinSense
- **Tagline:** Know your skin. Own your glow.
- **Platform:** iOS 16+ and Android 10+ via React Native
- **Bundle ID (iOS):** `com.skinsense.app`
- **Package Name (Android):** `com.skinsense.app`

### Core Purpose
SkinSense lets users take a selfie and instantly receive:
1. A detailed AI skin analysis (15+ parameters)
2. A fully personalized morning + evening skincare routine
3. Ingredient-based product recommendations
4. Long-term skin progress tracking over time

### User Flow Summary (Happy Path)
```
App Open → Onboarding (first time only)
  → Skin Quiz (5 questions)
  → First AI Scan (guided selfie)
  → Skin Report Screen
  → Routine Reveal
  → Home Dashboard (main loop)
       ├── Daily check-in prompt
       ├── Routine checklist
       ├── Weekly scan
       └── Progress / insights
```

---

## 2. Tech Stack

### Mobile
| Layer | Choice | Notes |
|---|---|---|
| Framework | React Native 0.74+ | Expo bare workflow (NOT managed) |
| Language | TypeScript (strict mode) | All files `.tsx` / `.ts` |
| Navigation | React Navigation v6 | Stack + Bottom Tab + Drawer |
| State | Zustand | Global app state |
| Server State | TanStack Query v5 | All API calls |
| Forms | React Hook Form + Zod | Validation on all forms |
| Styling | StyleSheet + custom theme | No Tailwind (RN incompatible) |
| Animations | Reanimated 3 + Moti | All transitions, progress bars |
| Camera | react-native-vision-camera v4 | Selfie scan + ingredient scanner |
| ML On-Device | react-native-fast-tflite | TensorFlow Lite models |
| Storage | MMKV | Local key-value (fast) |
| Secure Storage | react-native-keychain | Auth tokens |
| Push Notifs | Firebase Cloud Messaging | Cross-platform |
| Analytics | Mixpanel RN SDK | Event tracking |
| Auth | Auth0 React Native SDK | OAuth + biometric |
| Images | react-native-fast-image | Cached image loading |
| Charts | Victory Native XL | Progress trend charts |
| Date | date-fns | All date formatting |
| Icons | react-native-vector-icons (MaterialCommunityIcons) | Consistent icon set |

### Backend (Node.js — separate repo, document API contracts here)
| Layer | Choice |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| Framework | Fastify |
| Database | PostgreSQL via Prisma ORM |
| Vector DB | Pinecone (product recommendations) |
| File Storage | AWS S3 (encrypted) |
| AI Models | Google Vertex AI (cloud) + TFLite bundles (on-device) |
| Auth | Auth0 M2M + JWT verification |
| Hosting | AWS ECS Fargate |

---

## 3. Project Structure

```
skinsense/
├── src/
│   ├── app/                        # Root entry, providers
│   │   ├── App.tsx
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   └── navigation/
│   │       ├── RootNavigator.tsx
│   │       ├── AuthNavigator.tsx
│   │       ├── MainNavigator.tsx   # Bottom tabs
│   │       └── types.ts            # All navigation type definitions
│   │
│   ├── screens/                    # One folder per screen
│   │   ├── onboarding/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── SkinQuizScreen.tsx
│   │   │   └── QuizResultsScreen.tsx
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── scan/
│   │   │   ├── ScanGuideScreen.tsx
│   │   │   ├── CameraScreen.tsx
│   │   │   └── AnalyzingScreen.tsx
│   │   ├── report/
│   │   │   ├── SkinReportScreen.tsx
│   │   │   └── ReportDetailScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── routine/
│   │   │   ├── RoutineScreen.tsx
│   │   │   ├── RoutineStepScreen.tsx
│   │   │   └── EditRoutineScreen.tsx
│   │   ├── products/
│   │   │   ├── ProductsScreen.tsx
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   └── IngredientScannerScreen.tsx
│   │   ├── progress/
│   │   │   ├── ProgressScreen.tsx
│   │   │   └── CompareScreen.tsx
│   │   ├── learn/
│   │   │   ├── LearnScreen.tsx
│   │   │   ├── ArticleScreen.tsx
│   │   │   └── AIChatScreen.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       ├── EditProfileScreen.tsx
│   │       ├── SkinProfileScreen.tsx
│   │       ├── PrivacyScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Divider.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Sheet.tsx           # Bottom sheet
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── skin/
│   │   │   ├── SkinScoreRing.tsx   # Animated circular score
│   │   │   ├── FaceMap.tsx         # Annotated face diagram
│   │   │   ├── ConcernTag.tsx
│   │   │   ├── SkinTypeCard.tsx
│   │   │   └── TrendChart.tsx
│   │   ├── routine/
│   │   │   ├── RoutineStepCard.tsx
│   │   │   ├── RoutineTimeline.tsx
│   │   │   └── StreakBadge.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── MatchScoreBadge.tsx
│   │   │   └── IngredientPill.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── SafeArea.tsx
│   │       ├── LoadingOverlay.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── hooks/
│   │   ├── useSkinAnalysis.ts
│   │   ├── useCamera.ts
│   │   ├── useRoutine.ts
│   │   ├── useProgress.ts
│   │   ├── useProducts.ts
│   │   ├── useAuth.ts
│   │   ├── useNotifications.ts
│   │   └── useHealthKit.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts           # Axios instance + interceptors
│   │   │   ├── auth.ts
│   │   │   ├── scan.ts
│   │   │   ├── routine.ts
│   │   │   ├── products.ts
│   │   │   ├── progress.ts
│   │   │   └── learn.ts
│   │   ├── ai/
│   │   │   ├── skinAnalyzer.ts     # On-device TFLite inference
│   │   │   ├── modelLoader.ts
│   │   │   └── preprocessor.ts     # Image normalization
│   │   ├── storage/
│   │   │   ├── mmkv.ts
│   │   │   ├── secureStorage.ts
│   │   │   └── imageCache.ts
│   │   └── notifications/
│   │       └── fcm.ts
│   │
│   ├── store/                      # Zustand stores
│   │   ├── authStore.ts
│   │   ├── skinStore.ts
│   │   ├── routineStore.ts
│   │   ├── uiStore.ts
│   │   └── onboardingStore.ts
│   │
│   ├── types/
│   │   ├── skin.ts
│   │   ├── routine.ts
│   │   ├── product.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── utils/
│   │   ├── skinScore.ts
│   │   ├── imageProcessing.ts
│   │   ├── dateHelpers.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       ├── shadows.ts
│       └── index.ts
│
├── assets/
│   ├── models/                     # Bundled TFLite models
│   │   ├── skin_type_classifier.tflite
│   │   └── concern_detector.tflite
│   ├── images/
│   ├── fonts/
│   └── lottie/                     # Animation JSON files
│
├── android/
├── ios/
├── __tests__/
├── .env.example
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## 4. Design System

### Color Palette
```typescript
// src/theme/colors.ts
export const colors = {
  // Brand
  primary:        '#2D6A4F',   // Deep forest green — primary actions
  primaryLight:   '#52B788',   // Medium green — secondary elements
  primaryPale:    '#B7E4C7',   // Pale green — backgrounds, chips
  primaryDark:    '#1B4332',   // Dark green — headings, emphasis

  // Accent
  accent:         '#F4A261',   // Warm orange — highlights, CTAs
  accentLight:    '#FDDCBC',   // Pale orange — tags, badges

  // Neutrals
  white:          '#FFFFFF',
  background:     '#F8FAF9',   // Off-white app background
  surface:        '#FFFFFF',   // Card surfaces
  surfaceAlt:     '#F0FFF4',   // Alternate card tint
  border:         '#E5E7EB',
  borderLight:    '#F3F4F6',

  // Text
  textPrimary:    '#111827',
  textSecondary:  '#4B5563',
  textTertiary:   '#9CA3AF',
  textInverse:    '#FFFFFF',

  // Semantic
  success:        '#10B981',
  warning:        '#F59E0B',
  error:          '#EF4444',
  info:           '#3B82F6',

  // Skin concern severity
  severityLow:    '#10B981',   // Green
  severityMed:    '#F59E0B',   // Amber
  severityHigh:   '#EF4444',   // Red

  // Overlays
  overlay:        'rgba(0,0,0,0.5)',
  overlayLight:   'rgba(0,0,0,0.2)',
} as const;
```

### Typography
```typescript
// src/theme/typography.ts
// Use react-native-google-fonts or bundle fonts
export const fonts = {
  heading:  'DMSans-Bold',        // DM Sans Bold — headings
  subhead:  'DMSans-SemiBold',    // DM Sans SemiBold
  body:     'DMSans-Regular',     // DM Sans Regular
  bodyMed:  'DMSans-Medium',
  mono:     'SpaceMono-Regular',  // Space Mono — ingredient codes, scores
};

export const typography = {
  h1:       { fontFamily: fonts.heading,  fontSize: 28, lineHeight: 36 },
  h2:       { fontFamily: fonts.heading,  fontSize: 22, lineHeight: 30 },
  h3:       { fontFamily: fonts.subhead,  fontSize: 18, lineHeight: 26 },
  h4:       { fontFamily: fonts.subhead,  fontSize: 16, lineHeight: 24 },
  bodyLg:   { fontFamily: fonts.body,     fontSize: 16, lineHeight: 24 },
  body:     { fontFamily: fonts.body,     fontSize: 14, lineHeight: 22 },
  bodySm:   { fontFamily: fonts.body,     fontSize: 13, lineHeight: 20 },
  caption:  { fontFamily: fonts.body,     fontSize: 12, lineHeight: 18 },
  label:    { fontFamily: fonts.bodyMed,  fontSize: 12, lineHeight: 16, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  score:    { fontFamily: fonts.mono,     fontSize: 36, lineHeight: 44 },
};
```

### Spacing & Radius
```typescript
// src/theme/spacing.ts
export const spacing = {
  xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48,
};

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
};
```

### Shadows
```typescript
export const shadows = {
  sm:  { shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.05, shadowRadius:2,  elevation:1 },
  md:  { shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:6,  elevation:3 },
  lg:  { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.10, shadowRadius:12, elevation:6 },
};
```

---

## 5. Navigation Architecture

```
RootNavigator (Stack)
├── SplashScreen               ← shown while checking auth state
├── AuthNavigator (Stack)      ← shown if NOT authenticated
│   ├── WelcomeScreen
│   ├── LoginScreen
│   └── SignupScreen
├── OnboardingNavigator (Stack) ← shown if authenticated + onboarding NOT complete
│   ├── SkinQuizScreen
│   ├── ScanGuideScreen
│   ├── CameraScreen (first scan)
│   ├── AnalyzingScreen
│   ├── SkinReportScreen (first report)
│   └── RoutineRevealScreen
└── MainNavigator (Bottom Tabs) ← main app
    ├── Tab: Home
    │   └── HomeScreen
    ├── Tab: Scan
    │   ├── ScanGuideScreen
    │   ├── CameraScreen
    │   ├── AnalyzingScreen
    │   └── SkinReportScreen
    ├── Tab: Routine
    │   ├── RoutineScreen
    │   ├── RoutineStepScreen
    │   └── EditRoutineScreen
    ├── Tab: Progress
    │   ├── ProgressScreen
    │   └── CompareScreen
    └── Tab: More (Drawer)
        ├── ProductsScreen
        │   ├── ProductDetailScreen
        │   └── IngredientScannerScreen
        ├── LearnScreen
        │   ├── ArticleScreen
        │   └── AIChatScreen
        └── ProfileScreen
            ├── EditProfileScreen
            ├── SkinProfileScreen
            ├── PrivacyScreen
            └── SettingsScreen
```

**Bottom Tab Bar spec:**
- Icons: Home, Scan (center — larger, primary-colored), Routine, Progress, More
- Active tab: `colors.primary` icon + label
- Inactive tab: `colors.textTertiary`
- Scan tab: pill-shaped button, `colors.primary` background, white icon — elevated above others
- Height: 64px safe area adjusted
- Background: white with top border `colors.border`

---

## 6. All Pages & Screens

> Each screen section follows: **Purpose → Layout → Components → Data → Actions → Edge Cases**

---

### 6.1 SplashScreen
**Purpose:** App initialization — check auth token, load local data, decide first route.

**Layout:**
- Full screen `colors.primary` background
- Centered `SkinSense` logo (SVG) + tagline
- Lottie animation: subtle leaf/glow pulse

**Logic:**
1. Check MMKV for auth token
2. If token exists → validate with backend (`GET /auth/me`)
3. If valid → check `onboardingComplete` flag in MMKV
   - If complete → navigate `MainNavigator`
   - If incomplete → navigate `OnboardingNavigator`
4. If no token → navigate `AuthNavigator`
5. Minimum display time: 1.5s (brand moment)

**Edge Cases:**
- Network error during token validation → treat as unauthenticated, show auth screen
- Token expired → clear storage, redirect to Login

---

### 6.2 WelcomeScreen
**Purpose:** First impression. Communicate value before asking for signup.

**Layout:**
- Full screen with gradient background (`primary` → `primaryDark`)
- 3-slide horizontal carousel (Reanimated pagination dots):
  - Slide 1: "Know Your Skin" — illustrated face with scan lines animation
  - Slide 2: "Routines Built for You" — product step illustration
  - Slide 3: "Track Real Progress" — before/after comparison illustration
- Bottom fixed area:
  - Primary CTA: "Get Started" → SignupScreen
  - Secondary: "I already have an account" → LoginScreen
  - Tertiary: "Continue as Guest" → skips to SkinQuiz (limited mode, prompt to sign up later)

**Animations:**
- Each slide fades + translates in
- Illustration has subtle float animation (Moti loop)

---

### 6.3 LoginScreen
**Purpose:** Authenticate existing users.

**Layout:**
- Back button (top left)
- Logo (small, centered top)
- Heading: "Welcome back"
- Form:
  - Email input (keyboard: email, autocomplete: email)
  - Password input (secure, show/hide toggle)
- "Forgot password?" link → opens browser to Auth0 reset flow
- Primary button: "Sign In"
- Divider: "or"
- Social buttons: "Continue with Apple" / "Continue with Google"
- Footer: "Don't have an account? Sign up"
- Biometric login button (if previously enabled in settings + device supports it)

**Validation (Zod):**
- Email: valid format required
- Password: minimum 8 characters

**Actions:**
- On submit → `POST /auth/login` → store JWT in Keychain → navigate based on onboarding state
- On social → Auth0 universal login flow

**Error States:**
- Wrong credentials: inline error below form "Email or password incorrect"
- Network error: Toast "Check your connection and try again"
- Too many attempts: show lockout message with countdown

---

### 6.4 SignupScreen
**Purpose:** Account creation.

**Layout:**
- Same structure as Login
- Form fields: Name (first + last), Email, Password, Confirm Password
- Checkbox: "I agree to Terms of Service and Privacy Policy" (both are links)
- Primary button: "Create Account"
- Social signup options identical to Login

**Validation:**
- Name: 2+ characters each
- Email: valid format, not already registered (checked on blur via `GET /auth/check-email`)
- Password: min 8 chars, 1 uppercase, 1 number
- Confirm password: must match
- Terms checkbox: must be checked

**Post-signup flow:**
- Create user record in backend
- Set `onboardingComplete = false` in MMKV
- Navigate to `SkinQuizScreen`

---

### 6.5 SkinQuizScreen
**Purpose:** Gather baseline skin context before first scan. Personalizes the AI model and routine.

**Layout:**
- Progress bar at top (step X of 5)
- One question per screen (swipe/button to advance)
- Large readable question text
- Selection cards (not tiny radio buttons)
- Back button to previous question
- "Skip" option on last 2 questions

**Questions:**
1. **What's your main skin concern?** (multi-select, up to 3)
   Options: Acne / Oiliness / Dryness / Uneven tone / Dark spots / Wrinkles / Redness / Sensitivity / Large pores
2. **How would you describe your skin type right now?**
   Options: Very oily / Oily / Combination / Normal / Dry / Very dry / Not sure
3. **What's your current routine like?**
   Options: No routine / Cleanser only / Basic (3 steps) / Full routine (5+ steps) / I don't know where to start
4. **What's your age range?**
   Options: Under 18 / 18–24 / 25–34 / 35–44 / 45–54 / 55+
5. **What matters most to you?** (multi-select, up to 2)
   Options: Clearing acne / Anti-aging / Brightening / Hydration / Minimizing pores / Calming redness / Going natural/clean / Keeping it simple

**Data saved:** Store as `quizAnswers` in Zustand `onboardingStore` and POST to `/users/quiz` after completion.

---

### 6.6 ScanGuideScreen
**Purpose:** Educate user on how to take a quality selfie for accurate analysis.

**Layout:**
- Illustration: face in ideal lighting position
- 4 tip cards with icons:
  - "Find natural light or face a bright lamp"
  - "Remove makeup if possible for best results"
  - "Keep face neutral, no big smiles"
  - "Hold phone at eye level, arm's length away"
- Primary CTA: "I'm Ready — Open Camera"
- Secondary: "Skip tips next time" toggle

---

### 6.7 CameraScreen
**Purpose:** Guided selfie capture for AI analysis.

**Layout:**
- Full screen camera preview (front-facing)
- Face oval overlay (dashed line, animates green when face detected + aligned)
- Real-time alignment feedback text: "Move closer" / "Good light" / "Center your face" / "Hold still"
- Lighting quality indicator (3 bars, green/amber/red)
- Shutter button (center bottom) — disabled until face is properly aligned
- Close button (top left)
- Flash/brightness toggle (top right)

**Technical:**
- Uses `react-native-vision-camera` with real-time frame processor
- MediaPipe Face Mesh via TFLite on-device for alignment detection
- Capture at minimum 1080x1080 resolution
- Auto-capture when all conditions met for 2 consecutive seconds (with countdown "3...2...1")
- Manual capture always available via shutter button
- Image processing: normalize brightness, crop to face region

**Post-capture:**
- Save original image to local cache (NOT uploaded)
- Run on-device TFLite analysis
- Navigate to `AnalyzingScreen` with image URI + preliminary results

**Permissions:**
- Camera permission required — if denied, show permission request sheet with explanation

---

### 6.8 AnalyzingScreen
**Purpose:** Show progress while AI processes the scan.

**Layout:**
- Blurred/dimmed background of captured photo
- Animated scan line sweeping across face image
- Progress bar with stage labels:
  1. "Detecting skin regions…" (0–20%)
  2. "Analyzing skin type…" (20–45%)
  3. "Checking for concerns…" (45–75%)
  4. "Building your profile…" (75–95%)
  5. "Almost ready…" (95–100%)
- Fun skin fact appears at bottom (rotates every 2s)

**Logic:**
- On-device TFLite inference runs in background (via `runAsync`)
- If on-device gives low confidence (<70%) → also send anonymized score vector to cloud API for refinement
- Minimum display time: 3 seconds (feels credible)
- On complete → navigate `SkinReportScreen` with analysis results

**Error:**
- If analysis fails → show error screen with retry and "Contact support" option

---

### 6.9 SkinReportScreen
**Purpose:** The main payoff — show users their full skin analysis.

**Layout:**

**Section 1: Score Header**
- User photo (circular crop) on left
- Large animated score ring on right (0–100, animates from 0 on entry)
- Score label: e.g., "Skin Health Score: 74 / 100"
- Subtext: skin type e.g. "Combination Skin · Fitzpatrick Type III"
- Scan date + "View History" link

**Section 2: Skin Type Card**
- Icon + skin type name
- 2-sentence personalized description of their skin type
- 3 key characteristics as chips

**Section 3: Concern Breakdown**
- Heading: "Your Skin Concerns"
- List of all detected concerns (show 0-severity as "healthy" too)
- Each concern item:
  - Icon, concern name
  - Severity bar (low/medium/high) with color coding
  - One-line insight e.g. "Mild dehydration detected around cheeks"
- Tap any concern → `ReportDetailScreen` for that concern

**Section 4: Face Map**
- `FaceMap` component: SVG face outline
- Colored zones corresponding to where each concern was detected
- Tap a zone → highlight + show concern tooltip
- Zones: forehead, left cheek, right cheek, nose, chin, under-eye

**Section 5: What's Working**
- Positive findings listed (e.g., "Strong skin barrier", "Good elasticity")

**Section 6: Recommended Next Steps**
- 3 action cards:
  - "Start Your Routine" → RoutineScreen
  - "Explore Products" → ProductsScreen
  - "Scan Again in 7 Days" → sets reminder

**CTA Button (sticky bottom):** "See My Personalized Routine →"

---

### 6.10 ReportDetailScreen
**Purpose:** Deep-dive into a single skin concern.

**Layout:**
- Header: concern name + severity badge
- "What is this?" — plain language explanation
- "What causes it?" — 3–4 bullet causes
- "Your result" — personalized insight from their scan data
- "How to improve it" — 3 actionable tips
- "Products that help" — horizontal scroll of 3–5 relevant product cards
- "Learn more" → ArticleScreen on that concern topic

---

### 6.11 HomeScreen
**Purpose:** Daily hub. Greets user, shows skin score snapshot, surfaces the day's tasks.

**Layout (scrollable):**

**Section 1: Header**
- "Good morning, [Name] ☀️" (greeting changes by time of day)
- Date and streak badge: "🔥 7-day streak"
- Small notification bell icon (top right)

**Section 2: Skin Score Card**
- Large card with animated score ring (current score vs last scan)
- Delta indicator: "+3 since last scan ↑" (green) or "-2 ↓" (red)
- "Last scanned: 3 days ago" + "Scan Now" button
- If no scan yet → "Take your first scan" CTA card

**Section 3: Today's Routine**
- "Your Morning Routine" or "Evening Routine" (depends on time of day)
- Progress indicator: "2 of 5 steps complete"
- First 3 unchecked steps as compact cards with check-off button
- "View Full Routine" link

**Section 4: Weekly Insight**
- Card with AI-generated insight based on recent scans
- e.g., "Your hydration improved 12% this week. Keep using your hyaluronic acid serum."
- Only shows if user has 2+ scans

**Section 5: Quick Actions**
- Row of 4 icon buttons: Scan / Products / Progress / Chat

**Section 6: Learn Something New**
- 2 article cards (personalized to user's top skin concerns)
- Each shows: title, read time, concern tag

**Section 7: Community Highlight** *(V1.1, placeholder in V1.0)*
- Grayed out with "Coming soon" overlay

---

### 6.12 RoutineScreen
**Purpose:** User's personalized skincare routine — morning and evening.

**Layout:**
- Segmented control at top: "Morning" / "Evening"
- Streak display: "🔥 12 days consistent"
- Today's completion progress bar

**Routine Step List:**
Each step is a `RoutineStepCard`:
- Step number pill
- Product category icon (e.g., cleanser, toner, SPF)
- Step name: e.g., "1. Gentle Cleanser"
- Product recommendation: "Try: CeraVe Hydrating Cleanser" (or user's saved product)
- Why this step: 1-line reason tied to their skin concern
- Duration: e.g., "~1 min"
- Check-off circle (tap to mark complete) — checkmark animation on tap
- Tap card → `RoutineStepScreen` for detail

**Bottom area:**
- "All done for this session!" celebration animation when all steps checked
- "Edit Routine" button → `EditRoutineScreen`

**Empty state (no routine yet):** "Your routine is being built. Complete your first scan to unlock it."

---

### 6.13 RoutineStepScreen
**Purpose:** Full detail on one routine step.

**Layout:**
- Step name + icon (large)
- "Why it's in your routine" — personalized explanation referencing their scan results
- How to apply: numbered steps (e.g., "Apply 2 pumps to damp skin, massage in circles")
- How much: visual dosage guide
- When to use: AM / PM / Both + frequency
- Pro tip box
- Recommended products for this step (3 cards) → `ProductDetailScreen`
- "Mark as done" button

---

### 6.14 EditRoutineScreen
**Purpose:** Let users customize their routine.

**Layout:**
- Morning / Evening toggle
- Draggable step list (long-press to drag, reorder)
- Toggle each step on/off
- "Add a step" button → shows step type picker sheet
- "Reset to AI recommendation" button (with confirmation)
- "Save Changes" sticky bottom button

---

### 6.15 ProductsScreen
**Purpose:** Browse and discover skincare products matched to user's skin.

**Layout:**
- Search bar (top)
- Filter chips: Skin Type / Concern / Category / Price Range / Preferences (vegan, fragrance-free)
- Sort: Best Match / Rating / Price

**Product Grid (2 columns):**
Each `ProductCard` shows:
- Product image
- Brand name (small, gray)
- Product name
- Skin Match Score badge (e.g., "Match 92%") — color coded by score
- Star rating + review count
- Price
- "Add to Routine" quick button

- Tap card → `ProductDetailScreen`
- FAB: camera icon → `IngredientScannerScreen`

**Empty state (no results for filter):** "No products match these filters. Try widening your search."

---

### 6.16 ProductDetailScreen
**Purpose:** Full product information with personalized compatibility.

**Layout:**
- Product image (large, zoomable)
- Brand + product name
- Category tag + Skin Match Score ring (animated)
- "Why it matches your skin" — personalized paragraph referencing their concerns
- Price + "Buy on Sephora / Ulta / Amazon" buttons (affiliate links, clearly marked)
- Rating: stars + review count
- Tabs:
  - **Overview:** description, key benefits, how to use
  - **Ingredients:** full ingredient list, each ingredient tappable for a tooltip with plain-language explanation + safety rating
  - **Reviews:** user reviews with skin type filter
  - **Alternatives:** 3 similar products with comparison

**Sticky Bottom:**
- "Add to Routine" button → shows step picker sheet
- "Save" bookmark button

---

### 6.17 IngredientScannerScreen
**Purpose:** Point camera at any product label to analyze its ingredients.

**Layout:**
- Full screen camera (rear-facing)
- Guide overlay: "Point at ingredient list on product label"
- Real-time OCR (on-device via `@react-native-ml-kit/text-recognition`)
- "Scan" button → captures + processes
- Results slide up as bottom sheet:
  - Product name (if recognized)
  - Overall Safety Score (0–100)
  - Skin Match Score for their profile
  - Ingredient list with color-coded flags:
    - 🟢 Green: beneficial for your skin
    - 🟡 Yellow: neutral / watch
    - 🔴 Red: potentially problematic for your skin type or concerns
  - "What to watch out for" highlighted section
  - "Save this product" button

---

### 6.18 ProgressScreen
**Purpose:** Long-term skin health tracking and visual comparison.

**Layout:**

**Section 1: Skin Score Trend**
- Line chart (Victory Native) showing score over last 30/90/180 days
- Toggle between timeframes
- Annotated points: "Started new routine", "Changed products"

**Section 2: Concern Trends**
- Each tracked concern with its own mini trend bar
- Shows improvement / worsening with % change

**Section 3: Photo Timeline**
- Horizontal scroll of all scan photos with their date + score
- Photos are cropped/aligned for consistency
- Tap any photo → `CompareScreen` to compare with another date

**Section 4: Milestones**
- Badge gallery: earned milestones (e.g., "7-day streak", "Improved hydration", "First scan")
- Unearned milestones grayed out

**Section 5: AI Weekly Digest**
- Current week summary from AI: what improved, what needs attention, routine adherence %

---

### 6.19 CompareScreen
**Purpose:** Side-by-side before/after comparison of two scan dates.

**Layout:**
- Two panels side by side (or swipe slider middle handle for reveal effect)
- Date pickers for each panel
- Concern scores listed below each photo
- Delta table: shows change in each parameter
- "Share Progress" button → generates shareable image (removes private score data unless user wants it)

---

### 6.20 LearnScreen
**Purpose:** Educational content hub personalized to user's skin concerns.

**Layout:**
- Search bar
- Filter tabs: All / For Your Skin / Ingredients / Routines / Trends
- Featured article (large card, full-width)
- Article grid:
  - Thumbnail, title, concern tag, read time
  - "Recommended for you" badge on personalized articles
- "Ask AI" floating button → `AIChatScreen`

---

### 6.21 ArticleScreen
**Purpose:** Full article reading experience.

**Layout:**
- Hero image
- Category tag + read time
- Title (h1)
- "Reviewed by [Dermatologist Name], MD" badge
- Article body (rendered markdown/rich text)
  - Inline ingredient highlights (tappable)
  - Pull quotes
  - Product callout cards mid-article
- "Related to your skin" section at bottom
- "Related Articles" horizontal scroll
- Share button (top right)

---

### 6.22 AIChatScreen
**Purpose:** Conversational AI skincare advisor.

**Layout:**
- Chat interface (messages bubbles)
- User messages: right-aligned, `primaryPale` background
- AI messages: left-aligned, white card with small SkinSense logo avatar
- Suggested quick questions as chips above input on first open:
  - "What's causing my acne?"
  - "Is SPF important every day?"
  - "Can I mix retinol and vitamin C?"
- Text input with send button
- "Powered by SkinSense AI" disclaimer at top

**Behavior:**
- System context includes user's skin profile and recent scan results
- AI references user data: "Based on your recent scan showing mild dehydration…"
- AI recommends products from the user's saved routine
- AI never diagnoses medical conditions — includes disclaimer on first message: "I'm an AI skincare advisor, not a doctor. For medical concerns, please consult a dermatologist."
- Chat history persisted locally (MMKV) + synced to backend

**API:** POST `/ai/chat` with conversation history (last 10 messages) + user skin context

---

### 6.23 ProfileScreen
**Purpose:** User account overview and settings hub.

**Layout:**
- Profile photo (editable, tap → image picker)
- Name + email
- Member since date
- Skin type badge + Fitzpatrick type
- Stats row: Total Scans / Day Streak / Routine Adherence %
- Menu list:
  - 👤 Edit Profile → `EditProfileScreen`
  - 🧴 My Skin Profile → `SkinProfileScreen`
  - 🔔 Notification Settings → `SettingsScreen` (notifs tab)
  - 🔒 Privacy & Data → `PrivacyScreen`
  - ⚙️ App Settings → `SettingsScreen`
  - ❓ Help & Support → opens web support URL
  - 📋 Terms & Privacy Policy → opens web URL
  - 🚪 Sign Out (with confirmation alert)
  - 🗑️ Delete Account (destructive, at bottom in red)

---

### 6.24 EditProfileScreen
**Purpose:** Edit user details.

**Fields:** Profile photo, First name, Last name, Email (verified, requires re-auth to change), Date of birth, Gender (optional), Skin goals (multi-select, same as quiz question 5)

**Save:** PATCH `/users/me`

---

### 6.25 SkinProfileScreen
**Purpose:** View full skin profile built from quiz + all historical scans.

**Layout:**
- Skin type (with edit option — "Disagree? Tell us")
- Fitzpatrick scale with user's position highlighted
- Top 5 concerns (with severity and trend arrows)
- Sensitivities / known irritants
- Preferred product preferences (vegan, fragrance-free, etc.)
- "Retake Skin Quiz" button
- History of all scan dates with score

---

### 6.26 PrivacyScreen
**Purpose:** Full data transparency and control.

**Layout:**
- What data we collect (plain language, bullet list)
- "Your photos are processed on-device and NEVER uploaded" — prominent callout
- Data stored in cloud: list of what (skin scores, routine, preferences — NOT photos)
- Toggle: "Allow anonymized research data" (default ON, explained clearly)
- "Export My Data" button → triggers email with data export file
- "Delete All My Data" button → confirmation flow → DELETE `/users/me/data`
- Links: Privacy Policy, GDPR Rights, CCPA Rights

---

### 6.27 SettingsScreen
**Purpose:** App preferences and notification configuration.

**Sections:**

**Notifications:**
- Daily routine reminders (toggle + time picker)
- Weekly scan reminder (toggle + day picker)
- Skin tips and insights (toggle)
- Product restocking reminders (toggle)

**App:**
- Theme: Light / Dark / System
- Haptic feedback toggle
- Face ID / biometric login toggle
- Language selection (future)

**Routine:**
- Default routine view: Morning / Evening / Last used
- Auto-advance steps toggle

**Data & Sync:**
- Apple Health / Google Fit sync toggle
- Backup scan history toggle
- Clear local cache button

---

## 7. Core Features & Logic

### 7.1 Skin Score Calculation
```typescript
// src/utils/skinScore.ts
// Score is 0–100, higher = healthier skin
// Weighted average of all concern severity scores (inverted)

const CONCERN_WEIGHTS = {
  skinBarrier:        0.20,  // Most important
  hydration:          0.15,
  acne:               0.15,
  texture:            0.10,
  hyperpigmentation:  0.10,
  pores:              0.08,
  wrinkles:           0.08,
  redness:            0.07,
  darkCircles:        0.05,
  oiliness:           0.02,
};

// Each concern comes back as severity 0.0–1.0 from model
// score = (1 - weightedSeverity) * 100, rounded to integer
```

### 7.2 Routine Generation Logic
```
Input: quizAnswers + skinAnalysisResults + userPreferences
Output: orderedRoutineSteps (AM + PM)

AM routine order: Cleanser → Toner → Treatment Serum → Eye Cream → Moisturizer → SPF
PM routine order: Cleanser → Toner → Treatment Serum → Retinol (if applicable) → Eye Cream → Moisturizer → Face Oil (if dry)

Step inclusion rules:
- SPF: always included in AM
- Retinol: only if concern includes wrinkles AND age > 24
- Acid exfoliant: only if concern includes texture/hyperpigmentation, max 3x/week step
- Face oil: only if skin type is dry or very dry
- Spot treatment: only if acne severity > 0.4

Each included step → query Pinecone for top 3 matching products
  filtered by: userPreferences (vegan, fragrance-free), budget range, skin type
  ranked by: skinMatchScore for this user's profile
```

### 7.3 Skin Match Score Algorithm
```
skinMatchScore(product, userProfile) → 0–100

Factors:
1. Skin type compatibility (25%) — product's target skin type vs user's
2. Concern alignment (35%) — key ingredients known to address user's top concerns
3. Ingredient safety (25%) — absence of flagged ingredients for user's sensitivities
4. Community rating (15%) — average rating from users with similar skin profiles

Score < 60  → Not recommended (show with warning)
Score 60–79 → Compatible (show normally)
Score 80–94 → Great match (green badge)
Score 95+   → Perfect match (primary badge + highlight)
```

### 7.4 Streak System
- A "day" counts if user either: (a) completes 70%+ of their routine steps, OR (b) completes a check-in, OR (c) does a scan
- Streak stored in Zustand + synced to backend
- Streak broken if no qualifying activity for 24h past user's local midnight
- Grace period: one "freeze" per week (tap "Protect my streak" before midnight)

---

## 8. AI Integration

### 8.1 On-Device TFLite Models
```typescript
// src/services/ai/skinAnalyzer.ts

// Models bundled in assets/models/ at build time
const MODELS = {
  skinType:   'skin_type_classifier.tflite',   // Input: 224x224x3, Output: 5-class softmax
  concerns:   'concern_detector.tflite',        // Input: 224x224x3, Output: 15 severity floats
};

// Preprocessing pipeline:
// 1. Resize image to 224x224
// 2. Normalize pixel values to [0, 1]
// 3. Apply CLAHE for lighting normalization
// 4. Crop to face bounding box (from MediaPipe)

// Post-processing:
// 1. Apply temperature scaling for confidence calibration
// 2. If max confidence < 0.70 → flag for cloud refinement
// 3. Map raw outputs to typed SkinAnalysisResult
```

### 8.2 Cloud AI API (Low-confidence fallback)
```
POST /ai/analyze
Body: { scoreVector: float[], quizContext: QuizAnswers }
  // Note: NEVER send the actual image to the server
  // Only send the anonymized numeric output vector from on-device model

Response: RefinedAnalysisResult
```

### 8.3 AI Chat API
```
POST /ai/chat
Body: {
  messages: { role: 'user'|'assistant', content: string }[],  // last 10 messages
  skinContext: {
    skinType: string,
    topConcerns: string[],
    lastScanDate: string,
    currentRoutineSteps: string[],
  }
}
Response: { message: string }
```

---

## 9. State Management

### Zustand Stores

```typescript
// src/store/authStore.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: 'apple' | 'google') => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// src/store/skinStore.ts
interface SkinStore {
  latestAnalysis: SkinAnalysisResult | null;
  analysisHistory: SkinAnalysisResult[];
  isAnalyzing: boolean;
  currentScanImageUri: string | null;
  setScanImage: (uri: string) => void;
  setAnalysisResult: (result: SkinAnalysisResult) => void;
  loadHistory: () => Promise<void>;
}

// src/store/routineStore.ts
interface RoutineStore {
  morningSteps: RoutineStep[];
  eveningSteps: RoutineStep[];
  todayCompletedSteps: string[];  // step IDs
  streak: number;
  lastCompletedDate: string | null;
  toggleStepComplete: (stepId: string) => void;
  reorderSteps: (type: 'morning'|'evening', from: number, to: number) => void;
  toggleStepEnabled: (stepId: string) => void;
  resetToAIRecommendation: () => Promise<void>;
}

// src/store/onboardingStore.ts
interface OnboardingStore {
  isComplete: boolean;
  quizAnswers: QuizAnswers | null;
  currentStep: number;
  setQuizAnswers: (answers: QuizAnswers) => void;
  completeOnboarding: () => void;
}

// src/store/uiStore.ts
interface UIStore {
  theme: 'light' | 'dark' | 'system';
  toasts: Toast[];
  showToast: (toast: Toast) => void;
  dismissToast: (id: string) => void;
  setTheme: (theme: UIStore['theme']) => void;
}
```

### TanStack Query Keys
```typescript
// src/utils/queryKeys.ts
export const queryKeys = {
  user:           ['user'],
  skinHistory:    ['skin', 'history'],
  skinReport:     (id: string) => ['skin', 'report', id],
  routine:        (type: 'morning'|'evening') => ['routine', type],
  products:       (filters: ProductFilters) => ['products', filters],
  product:        (id: string) => ['product', id],
  articles:       (tag?: string) => ['articles', tag],
  article:        (id: string) => ['article', id],
  chatHistory:    ['chat', 'history'],
};
```

---

## 10. API & Backend

### Base URL
```
Development:  https://api-dev.skinsense.app/v1
Production:   https://api.skinsense.app/v1
```

### Auth Headers
```
Authorization: Bearer <JWT>
Content-Type: application/json
X-App-Version: <semver>
X-Platform: ios | android
```

### Endpoints

```
AUTH
POST   /auth/login                   { email, password } → { token, user }
POST   /auth/signup                  { name, email, password } → { token, user }
GET    /auth/me                      → User
POST   /auth/refresh                 { refreshToken } → { token }
DELETE /auth/logout

USERS
GET    /users/me                     → UserProfile
PATCH  /users/me                     { ...updates } → UserProfile
POST   /users/quiz                   { quizAnswers } → void
DELETE /users/me/data                → void (GDPR delete)
GET    /users/me/export              → triggers email

SCANS
POST   /scans                        { scoreVector, quizContext } → SkinAnalysisResult
GET    /scans                        → SkinAnalysisResult[]
GET    /scans/:id                    → SkinAnalysisResult

ROUTINE
GET    /routine                      → { morning: RoutineStep[], evening: RoutineStep[] }
PATCH  /routine                      { steps } → Routine
POST   /routine/reset                → Routine (AI-regenerated)
POST   /routine/complete             { stepIds, date } → void

PRODUCTS
GET    /products                     ?concern=&skinType=&category=&page= → Product[]
GET    /products/:id                 → ProductDetail
GET    /products/search              ?q= → Product[]
POST   /products/ingredient-scan     { ingredientText } → IngredientAnalysis

AI
POST   /ai/analyze                   { scoreVector, quizContext } → RefinedAnalysisResult
POST   /ai/chat                      { messages, skinContext } → { message }

LEARN
GET    /articles                     ?tag=&skinType=&page= → Article[]
GET    /articles/:id                 → ArticleDetail
GET    /articles/featured            → Article[]

PROGRESS
GET    /progress/summary             → ProgressSummary
GET    /progress/trends              ?days=30|90|180 → TrendData[]
```

---

## 11. Permissions & Device APIs

```typescript
// Request these at the appropriate moment, NOT all at app launch

CAMERA:
  - When: User taps "Open Camera" in ScanGuideScreen or IngredientScannerScreen
  - If denied: Show explanation sheet → link to Settings
  - Required for: CameraScreen, IngredientScannerScreen

PHOTO_LIBRARY:
  - When: User taps profile photo to edit
  - If denied: Show message, offer camera as alternative

NOTIFICATIONS:
  - When: After completing first scan (natural high point of engagement)
  - If denied: Show soft message, allow to enable later in Settings
  - Never ask again if denied twice

FACE_ID (iOS) / BIOMETRIC (Android):
  - When: User enables in Settings
  - Optional — gracefully degrade to PIN/password

HEALTH_KIT (iOS) / HEALTH_CONNECT (Android):
  - When: User taps "Connect Health App" in Settings
  - Fully optional, not required for core flow
  - Read: sleep hours, steps, heart rate variability
  - Purpose: correlate lifestyle data with skin trends
```

---

## 12. Data Models

```typescript
// src/types/user.ts
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  dateOfBirth?: string;        // ISO date
  gender?: string;
  createdAt: string;
  onboardingComplete: boolean;
  quizAnswers?: QuizAnswers;
  skinProfile?: SkinProfile;
}

interface SkinProfile {
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  fitzpatrickType: 1 | 2 | 3 | 4 | 5 | 6;
  topConcerns: SkinConcern[];
  sensitivities: string[];
  preferences: UserPreferences;
}

interface UserPreferences {
  vegan: boolean;
  crueltyfree: boolean;
  fragranceFree: boolean;
  budgetRange: 'low' | 'mid' | 'high' | 'any';
}

// src/types/skin.ts
interface SkinAnalysisResult {
  id: string;
  userId: string;
  createdAt: string;
  skinScore: number;           // 0–100
  skinType: SkinTypeResult;
  concerns: ConcernResult[];
  fitzpatrickType: number;
  positiveFindings: string[];
  imageLocalUri?: string;      // never sent to server, only local ref
  modelVersion: string;
  confidence: number;          // 0–1
}

interface SkinTypeResult {
  type: string;
  confidence: number;
  description: string;
  characteristics: string[];
}

interface ConcernResult {
  id: string;
  name: string;
  severity: number;            // 0.0–1.0
  affectedZones: FaceZone[];
  insight: string;
  improvement: 'better' | 'worse' | 'stable' | 'new';
}

type FaceZone = 'forehead' | 'leftCheek' | 'rightCheek' | 'nose' | 'chin' | 'underEye';

// src/types/routine.ts
interface RoutineStep {
  id: string;
  order: number;
  category: StepCategory;
  name: string;
  reason: string;              // personalized "why" for this user
  instructions: string[];
  dosage: string;
  duration: string;
  frequency: string;
  timeOfDay: 'morning' | 'evening' | 'both';
  enabled: boolean;
  recommendedProducts: Product[];
  userSelectedProduct?: Product;
}

type StepCategory = 'cleanser' | 'toner' | 'treatment' | 'serum' |
                    'eyecream' | 'moisturizer' | 'spf' | 'retinol' |
                    'exfoliant' | 'mask' | 'oil' | 'other';

// src/types/product.ts
interface Product {
  id: string;
  name: string;
  brand: string;
  category: StepCategory;
  imageUrl: string;
  price: number;
  currency: string;
  skinMatchScore: number;      // 0–100, personalized to user
  rating: number;              // 0–5
  reviewCount: number;
  keyIngredients: string[];
  fullIngredients: Ingredient[];
  targetSkinTypes: string[];
  targetConcerns: string[];
  isVegan: boolean;
  isCrueltyFree: boolean;
  isFragranceFree: boolean;
  affiliateLinks: { [store: string]: string };
}

interface Ingredient {
  inci: string;                // International Nomenclature name
  commonName: string;
  function: string;
  safetyRating: 1 | 2 | 3 | 4 | 5;   // 1=safe, 5=avoid
  beneficialFor: string[];
  concernFor: string[];
  description: string;
}
```

---

## 13. Notifications

### Notification Types & Payload Structure
```typescript
// All local notifications via expo-notifications or @notifee/react-native

type NotificationType =
  | 'routine_reminder_am'       // "Time for your morning routine ☀️"
  | 'routine_reminder_pm'       // "Don't skip your evening routine 🌙"
  | 'weekly_scan_reminder'      // "Your weekly scan is ready. How's your skin? 📸"
  | 'streak_at_risk'            // "Your 7-day streak ends tonight! Quick check-in?"
  | 'scan_result_ready'         // (local, post-analysis) "Your skin report is ready ✨"
  | 'article_recommendation';   // "New tip for [concern] skin 📖"

// All notifications deep-link to the relevant screen:
// routine_reminder → RoutineScreen
// weekly_scan     → ScanGuideScreen
// streak_at_risk  → HomeScreen
// article         → ArticleScreen/:id
```

### Notification Scheduling
- Routine reminders: use user-set time (default AM 8:00, PM 21:00)
- Weekly scan: Sundays at 10:00 AM
- Streak at risk: 3 hours before midnight if no activity logged that day
- Never send more than 2 notifications per day
- Respect quiet hours (22:00–08:00 unless user changes this)

---

## 14. Analytics

### Events to Track (Mixpanel)

```typescript
// src/services/analytics.ts

// Onboarding
track('onboarding_started')
track('quiz_completed', { answers: QuizAnswers })
track('first_scan_completed', { skinScore: number, topConcerns: string[] })
track('onboarding_completed')

// Core loop
track('scan_initiated')
track('scan_completed', { scanId, skinScore, duration_ms })
track('routine_step_completed', { stepId, stepCategory, timeOfDay })
track('routine_fully_completed', { timeOfDay, stepCount })
track('streak_milestone', { days: number })

// Products
track('product_viewed', { productId, skinMatchScore })
track('product_affiliate_tapped', { productId, store })
track('ingredient_scanner_used')
track('product_added_to_routine', { productId, stepCategory })

// Content
track('article_opened', { articleId, concern })
track('ai_chat_message_sent', { messageIndex })

// Engagement
track('app_opened', { source: 'push_notification' | 'organic' })
track('compare_screen_viewed')
track('progress_photo_compared')
```

---

## 15. Performance Requirements

| Metric | Target |
|---|---|
| App cold start → interactive | < 2.5 seconds |
| Camera preview launch | < 1 second |
| On-device skin analysis | < 4 seconds |
| API response time (p95) | < 800ms |
| Home screen FPS while scrolling | 60fps |
| Image load (product thumbnails) | < 300ms (cached) |
| App size (iOS IPA) | < 80MB |
| App size (Android APK) | < 60MB |
| Crash-free sessions | > 99.5% |

### Optimization Notes
- TFLite models: quantize to INT8 to reduce size and inference time
- Images: use WebP format, serve via CloudFront CDN with size variants
- Lists: use `FlashList` from Shopify (not FlatList) for all long lists
- Lazy load all non-critical screens (React.lazy equivalent in RN)
- Prefetch next screen's data using TanStack Query prefetching
- MMKV for all local storage (10x faster than AsyncStorage)

---

## 16. Error Handling

### Global Error Boundaries
```typescript
// Wrap each navigator in an ErrorBoundary
// On error: show friendly error screen with "Retry" and "Report" options
// Log to error tracking (Sentry)
```

### API Error Handling (Axios Interceptors)
```typescript
// 401 → clear token → navigate to LoginScreen
// 403 → show "Access denied" toast
// 429 → show "Too many requests, try again in X seconds" toast
// 500+ → show "Something went wrong. We've been notified." toast + log to Sentry
// Network error → show offline banner at top of screen
```

### Offline Mode
- App works offline for: viewing last scan report, viewing saved routine, checking off routine steps, reading cached articles
- Show persistent "Offline — some features unavailable" banner when no network
- Queue routine completion events and sync when back online
- Gracefully disable: new scans, product search, AI chat, article loading

---

## 17. Testing Requirements

### Unit Tests (Jest + React Native Testing Library)
- All utility functions in `src/utils/` → 100% coverage
- Zustand store actions → test all state transitions
- Skin score calculation → test edge cases (all healthy, all severe, missing data)
- Routine generation logic → test all skin type + concern combinations

### Component Tests
- All `src/components/ui/` primitives
- SkinScoreRing → test animation trigger
- FaceMap → test zone tap interactions
- RoutineStepCard → test check-off interaction

### E2E Tests (Detox)
Critical user flows to automate:
1. Signup → Quiz → Scan → Report → Routine (full onboarding)
2. Login with existing account
3. Home → Scan → View Report
4. Check off all routine steps → verify streak increments
5. Search products → filter → view detail → tap affiliate link
6. Navigate all bottom tabs

### Manual QA Checklist (Pre-launch)
- Test on: iPhone 14, iPhone SE (small), Pixel 7, Samsung Galaxy S23
- Dark mode on all screens
- All form validation errors
- Camera permission denied flow
- Offline mode behavior
- Deep links from notifications
- App background/foreground transitions during scan
- Memory usage during camera session

---

## 18. Launch Checklist

### By June 20 (Project Complete)
- [ ] All P0 screens implemented and passing QA
- [ ] TFLite models integrated and tested on real devices
- [ ] All API endpoints integrated (no mock data in production code)
- [ ] Push notifications working (both iOS and Android)
- [ ] Analytics events firing correctly
- [ ] Error tracking (Sentry) configured
- [ ] All deep links working
- [ ] App icons and splash screen finalized
- [ ] Privacy Policy and Terms of Service URLs live
- [ ] GDPR data deletion flow working end-to-end
- [ ] Performance benchmarks met (see §15)
- [ ] All E2E tests passing

### By June 21 (App Store Submission)
- [ ] iOS: Increment build number, `react-native run-ios --configuration Release`
- [ ] iOS: Test on physical device with TestFlight
- [ ] App Store Connect: screenshots for all device sizes (6.7", 6.1", iPad if applicable)
- [ ] App Store Connect: app preview video (30 sec)
- [ ] App Store metadata: title, subtitle, description, keywords, category (Health & Fitness)
- [ ] Age rating: 4+ (no objectionable content)
- [ ] Privacy nutrition label filled accurately (camera use, health data)
- [ ] Submit for review with note: "Please prioritize — launch planned June 27"

### Android (Google Play — can launch same day if review faster)
- [ ] Generate signed APK/AAB (`./gradlew bundleRelease`)
- [ ] Play Console: fill all store listing fields
- [ ] Internal testing track → Production track

### Launch Day (June 27)
- [ ] Monitor Crashlytics / Sentry in real-time
- [ ] Have hotfix branch ready
- [ ] Team on-call for first 48 hours
- [ ] Respond to all App Store reviews within 24 hours

---

## Environment Variables

```bash
# .env (never commit — use .env.example as template)
API_BASE_URL=https://api.skinsense.app/v1
AUTH0_DOMAIN=skinsense.auth0.com
AUTH0_CLIENT_ID=<your_client_id>
MIXPANEL_TOKEN=<your_token>
SENTRY_DSN=<your_dsn>
FIREBASE_PROJECT_ID=skinsense-app
AWS_CLOUDFRONT_URL=https://cdn.skinsense.app
```

---

*Last updated: June 2026 | SkinSense v1.0 — MVP Launch*
