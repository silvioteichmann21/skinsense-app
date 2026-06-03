# SkinSense — Design Requirements (Stitch)

> Use this document when creating each screen in **Google Stitch**.  
> One Stitch project (or frame group) per **Screen ID** below.  
> Source: [REQUIREMENTS.md](./REQUIREMENTS.md) · [plan.md](./plan.md)

---

## How to use this doc in Stitch

1. Read **§1 Global design system** once — apply to every screen.
2. Pick a screen from **§3 Screen index**.
3. Open that screen’s section — design **Default** first, then every row in **States to design**.
4. Use **exact copy** where quoted; use **placeholder content** where sample text is given.
5. Frame size: **390 × 844** (iPhone 14). Also export key screens at **360 × 800** (Android) if time allows.
6. Name frames: `{ScreenID} — {State}` (e.g. `HOME — Default`).

---

## 1. Global design system

### Brand
| Item | Value |
|------|--------|
| App name | **SkinSense** |
| Tagline | **Know your skin. Own your glow.** |
| Personality | Calm, clinical-trustworthy, natural/wellness — not flashy beauty influencer |

### Colors (hex)

| Token | Hex | Use |
|-------|-----|-----|
| Primary | `#2D6A4F` | Primary buttons, active tab, key icons |
| Primary Light | `#52B788` | Secondary accents, progress fills |
| Primary Pale | `#B7E4C7` | Chips, user chat bubbles, soft backgrounds |
| Primary Dark | `#1B4332` | Headings on light bg, gradient end |
| Accent | `#F4A261` | Highlights, special CTAs |
| Accent Light | `#FDDCBC` | Tags, warm badges |
| Background | `#F8FAF9` | App screen background |
| Surface | `#FFFFFF` | Cards |
| Surface Alt | `#F0FFF4` | Tinted cards |
| Border | `#E5E7EB` | Dividers, tab bar top border |
| Text Primary | `#111827` | Headings, body |
| Text Secondary | `#4B5563` | Subcopy |
| Text Tertiary | `#9CA3AF` | Placeholders, inactive tabs |
| Text Inverse | `#FFFFFF` | Text on primary buttons |
| Success | `#10B981` | Positive delta, low severity, match 80%+ |
| Warning | `#F59E0B` | Medium severity |
| Error | `#EF4444` | Errors, high severity, destructive actions |
| Info | `#3B82F6` | Info callouts |
| Overlay | `rgba(0,0,0,0.5)` | Modals, camera dim |

**Severity bars:** Low = Success · Medium = Warning · High = Error  

**Product match badge:**  
- 95+ → Primary green pill “Perfect match”  
- 80–94 → Success “Great match”  
- 60–79 → Neutral “Compatible”  
- &lt;60 → Warning style + caution copy  

### Typography
| Style | Font | Size / Line | Use |
|-------|------|-------------|-----|
| H1 | DM Sans Bold | 28 / 36 | Screen titles |
| H2 | DM Sans Bold | 22 / 30 | Section titles |
| H3 | DM Sans SemiBold | 18 / 26 | Card titles |
| H4 | DM Sans SemiBold | 16 / 24 | List row titles |
| Body Large | DM Sans Regular | 16 / 24 | Intro paragraphs |
| Body | DM Sans Regular | 14 / 22 | Default body |
| Body Small | DM Sans Regular | 13 / 20 | Meta, hints |
| Caption | DM Sans Regular | 12 / 18 | Timestamps, labels |
| Label | DM Sans Medium, UPPERCASE, +0.5 letter-spacing | 12 / 16 | Section labels |
| Score | Space Mono Regular | 36 / 44 | Large skin scores |

### Spacing & shape
- Base unit: **4px**. Common padding: **16px** screen horizontal, **12px** card inner.
- Radius: cards **12–16px**, buttons **12px**, chips **full pill**, bottom sheet top **24px**.

### Core components (reuse across screens)
Design these once as a **Stitch component library**, then reference on pages:

| Component | Spec |
|-----------|------|
| **Primary button** | Full-width or auto; height 48px; bg Primary; text Inverse; 16px SemiBold |
| **Secondary button** | Outline Primary or text-only Primary |
| **Text input** | Height 48px; border `#E5E7EB`; radius 12px; placeholder Tertiary |
| **Card** | Surface, radius 16px, shadow sm, padding 16px |
| **Chip** | Primary Pale bg or outline; 32px height; pill |
| **Progress bar** | 4px height; track borderLight; fill Primary Light |
| **Skin score ring** | Circular; score in Space Mono; ring stroke Primary Light → Primary by % |
| **Severity bar** | 4–6px tall; filled segment colored by level |
| **Bottom tab bar** | See §2 — design as separate frame |
| **Toast** | Top or bottom; Surface + shadow; icon + one line |
| **Bottom sheet** | Drag handle; radius 24px top; max ~90% height |

### Icons
- Style: **Material Community Icons** (outlined), consistent 24px (tabs 24, FAB 28).
- Tab set: Home, Scan (camera), Calendar-check (routine), Chart-line (progress), Menu (more).

### Photography & illustration
- Onboarding: friendly **flat illustrations** (face, products, before/after) — not stock photos.
- User face scans: **realistic placeholder face** (diverse, neutral expression, even lighting).
- Product shots: clean packshots on white/light gray.

### Accessibility
- Min touch target **44×44px**.
- Text contrast ≥ 4.5:1 on backgrounds.
- Don’t rely on color alone for severity — include label (Low / Medium / High).

---

## 2. App chrome (design once)

### Bottom tab bar — `CHROME_TABBAR`
- Height **64px** + safe area.
- Background **Surface**, top border **1px Border**.
- 5 items: **Home** · **Scan** (center) · **Routine** · **Progress** · **More**
- **Scan (center):** pill button, bg **Primary**, white camera icon, **elevated** above bar (~8px), slightly larger.
- Active: icon + label **Primary**. Inactive: **Text Tertiary**.
- Labels: 11px caption under icons.

### Main app screens
Most main flows show tab bar. **Hide tab bar** on: full-screen camera, analyzing, article reading (optional), chat (optional), auth/onboarding stacks.

---

## 3. Screen index

| ID | Screen | Stitch priority | States |
|----|--------|-----------------|--------|
| SPLASH | Splash | P0 | Default only |
| WELCOME | Welcome | P0 | Slide 1–3 |
| LOGIN | Login | P0 | Default, Error, Loading |
| SIGNUP | Signup | P0 | Default, Error |
| QUIZ | Skin Quiz (×5 steps) | P0 | Q1–Q5, Selected |
| QUIZ_RESULT | Quiz Results | P0 | Default |
| SCAN_GUIDE | Scan Guide | P0 | Default |
| CAMERA | Camera (selfie) | P0 | Aligning, Ready, Countdown, Permission denied |
| ANALYZING | Analyzing | P0 | Progress, Error |
| REPORT | Skin Report | P0 | Default, Scroll mid |
| REPORT_DETAIL | Concern Detail | P0 | Default |
| ROUTINE_REVEAL | Routine Reveal | P0 | Default |
| HOME | Home | P0 | Default, No scan, Empty routine |
| ROUTINE | Routine | P0 | Morning, Evening, All done, Empty |
| ROUTINE_STEP | Routine Step Detail | P0 | Default |
| EDIT_ROUTINE | Edit Routine | P1 | Default |
| PRODUCTS | Products | P0 | Default, Empty filters |
| PRODUCT_DETAIL | Product Detail | P0 | Overview tab (+ optional Ingredients tab) |
| INGREDIENT_SCAN | Ingredient Scanner | P1 | Camera, Results sheet |
| PROGRESS | Progress | P0 | Default |
| COMPARE | Compare | P1 | Side-by-side, Slider |
| LEARN | Learn | P1 | Default |
| ARTICLE | Article | P1 | Default |
| AI_CHAT | AI Chat | P1 | Empty, With messages |
| PROFILE | Profile | P0 | Default |
| EDIT_PROFILE | Edit Profile | P0 | Default |
| SKIN_PROFILE | Skin Profile | P0 | Default |
| PRIVACY | Privacy & Data | P0 | Default |
| SETTINGS | Settings | P0 | Default |

---

## 4. Per-screen design requirements

---

### SPLASH — Splash Screen

**User goal:** Brand moment while app loads.

**Navigation:** First screen on cold start. No user taps. Auto-advances.

**Layout (top → bottom)**
| Zone | Content |
|------|---------|
| Full bleed | Background **Primary** `#2D6A4F` |
| Center | Logo wordmark **SkinSense** (white) |
| Below logo | Tagline: *Know your skin. Own your glow.* |
| Center overlay | Subtle **leaf/glow** Lottie-style animation (soft pulse) |

**States to design**
- Default only (no buttons)

**Notes**
- No status bar clutter; optional white status icons.
- Minimum visible time ~1.5s (motion can loop).

---

### WELCOME — Welcome / Onboarding intro

**User goal:** Understand app value before signing up.

**Navigation:** After splash if not logged in. CTAs → Signup, Login, Guest quiz.

**Layout**
| Zone | Content |
|------|---------|
| Background | Vertical gradient **Primary** → **Primary Dark** |
| Middle 70% | **Carousel** (3 slides), swipe horizontal |
| Bottom fixed | 3 actions stacked |

**Slide content (design 3 frames or 1 with dots)**

| Slide | Headline | Subcopy (suggested) | Visual |
|-------|----------|---------------------|--------|
| 1 | **Know Your Skin** | AI analyzes 15+ factors from one selfie | Face illustration + scan lines |
| 2 | **Routines Built for You** | Morning and evening steps matched to your skin | Product steps illustration |
| 3 | **Track Real Progress** | See real change over weeks, not guesswork | Before/after illustration |

**Pagination:** 3 dots; active dot elongated or Primary on white/20% track.

**Bottom CTAs**
1. **Primary button:** `Get Started`
2. **Text button:** `I already have an account`
3. **Text link (smaller):** `Continue as Guest`

**States to design**
- Slide 1, 2, 3 (can be one frame with note for carousel)

**Do not**
- Login form on this screen
- Paywall

---

### LOGIN — Login

**User goal:** Sign in to existing account.

**Layout**
| Zone | Content |
|------|---------|
| Top left | Back chevron |
| Top center | Small SkinSense logo |
| Title | **Welcome back** (H1) |
| Form | Email, Password (with show/hide eye) |
| Link | `Forgot password?` right-aligned or under password |
| Button | **Sign In** (primary) |
| Divider | `or` centered with lines |
| Social | **Continue with Apple** (black), **Continue with Google** (white outline) |
| Optional | **Sign in with Face ID** icon button (if enabled) |
| Footer | `Don't have an account?` **`Sign up`** (link) |

**Field labels / placeholders**
- Email: placeholder `you@email.com`
- Password: placeholder `Password`

**States to design**
| State | What to show |
|-------|----------------|
| Default | Empty fields |
| Error | Red inline under form: `Email or password incorrect` |
| Loading | Primary button spinner, disabled fields |
| Lockout | Banner: too many attempts + countdown timer |

**Validation hints (for dev, optional in design)**
- Email format error under field
- Password min 8 chars

---

### SIGNUP — Sign Up

**User goal:** Create account.

**Layout:** Same shell as Login.

**Fields**
| Field | Placeholder |
|-------|-------------|
| First name | `First name` |
| Last name | `Last name` |
| Email | `you@email.com` |
| Password | `Password` |
| Confirm password | `Confirm password` |

**Checkbox row:** `I agree to the` **`Terms of Service`** `and` **`Privacy Policy`** (links underlined)

**Button:** **Create Account**

**Footer:** `Already have an account?` **`Log in`**

**Social:** Same as Login.

**States to design**
- Default
- Error: email already registered (under email field)
- Error: password requirements hint (8+ chars, 1 upper, 1 number)
- Error: passwords don’t match

---

### QUIZ — Skin Quiz (5 steps)

**User goal:** Tell the app about skin so AI can personalize.

**Navigation:** After signup or guest welcome. 5 steps → Quiz Results.

**Shared chrome (every step)**
| Element | Spec |
|---------|------|
| Top | Back (steps 2–5 only) |
| Progress | Bar + label **`Step X of 5`** |
| Question | H2, max 2 lines |
| Answers | **Large selection cards** (not radio dots) — min height ~56px, icon optional |
| Bottom | **Continue** primary (disabled until valid selection) |
| Steps 4–5 only | Text link **`Skip`** top-right or under Continue |

---

#### QUIZ — Step 1
**Question:** `What's your main skin concern?`  
**Helper:** `Choose up to 3`

**Options (cards, multi-select, max 3 selected — show selected border Primary + checkmark):**
- Acne
- Oiliness
- Dryness
- Uneven tone
- Dark spots
- Wrinkles
- Redness
- Sensitivity
- Large pores

---

#### QUIZ — Step 2
**Question:** `How would you describe your skin type right now?`  
**Single select**

- Very oily · Oily · Combination · Normal · Dry · Very dry · Not sure

---

#### QUIZ — Step 3
**Question:** `What's your current routine like?`  
**Single select**

- No routine
- Cleanser only
- Basic (3 steps)
- Full routine (5+ steps)
- I don't know where to start

---

#### QUIZ — Step 4
**Question:** `What's your age range?`  
**Single select** · **Skip available**

- Under 18 · 18–24 · 25–34 · 35–44 · 45–54 · 55+

---

#### QUIZ — Step 5
**Question:** `What matters most to you?`  
**Helper:** `Choose up to 2` · **Skip available**

- Clearing acne · Anti-aging · Brightening · Hydration · Minimizing pores · Calming redness · Going natural/clean · Keeping it simple

**States to design**
- One frame per step (or Figma variants Step 1–5)
- Card **selected** vs **unselected**
- Continue **disabled** vs **enabled**

---

### QUIZ_RESULT — Quiz Results Summary

**User goal:** Confirm answers before first scan.

**Layout**
| Zone | Content |
|------|---------|
| Title | **You're all set, [Name]** or **Here's your skin profile** |
| Body | Short line: *We'll personalize your scan and routine based on this.* |
| Summary card | Chips for selected **concerns** (max 3), **skin type**, **top goals** |
| Secondary | Text link **`Edit answers`** |
| Primary CTA | **Continue to Skin Scan** |

**Sample chips:** Acne · Combination · Hydration

**States:** Default only

---

### SCAN_GUIDE — Scan Guide

**User goal:** Learn how to take a good selfie scan.

**Layout**
| Zone | Content |
|------|---------|
| Hero illustration | Face in ideal lighting (front-facing guide) |
| Title | **Get ready for your scan** (H2) |
| Tip cards ×4 | Icon + one line each (see below) |
| Primary CTA | **I'm Ready — Open Camera** |
| Footer toggle | Checkbox **`Skip tips next time`** |

**Tip copy**
1. Find natural light or face a bright lamp  
2. Remove makeup if possible for best results  
3. Keep face neutral, no big smiles  
4. Hold phone at eye level, arm's length away  

**States**
- Default
- Optional: permission **sheet** overlay (title + body + **Open Settings** + Cancel)

---

### CAMERA — Selfie Camera

**User goal:** Capture face for analysis.

**Layout**
| Zone | Content |
|------|---------|
| Full screen | Live camera preview (dark UI chrome) |
| Center | **Dashed oval** face guide (turn **solid green** when “aligned”) |
| Above oval | Dynamic hint text (one line, white) |
| Top left | Close **X** |
| Top right | Brightness / flash toggle |
| Right or top | **Lighting indicator** — 3 vertical bars (green/amber/red) |
| Bottom center | Large **shutter** circle (disabled = dimmed) |

**Hint text variants (design 2–3)**
- `Move closer`
- `Center your face`
- `Good light`
- `Hold still`
- Countdown overlay: **`3` · `2` · `1`**

**States to design**
| State | Visual |
|-------|--------|
| Aligning | Dashed oval, hint text, shutter disabled |
| Ready | Green oval, shutter enabled |
| Countdown | Large numerals center |
| Permission denied | Full-screen or sheet explaining camera need |

**Do not**
- Gallery picker on this screen (V1)

---

### ANALYZING — Analyzing Scan

**User goal:** Wait confidently while AI runs.

**Layout**
| Zone | Content |
|------|---------|
| Background | User's captured photo **blurred + dimmed** |
| Foreground | Face crop sharper, **horizontal scan line** animation sweeping |
| Progress | Bar + **stage label** (one visible at a time) |
| Bottom | Rotating **skin fact** (caption, centered) |

**Stage labels (show one; design at ~60% progress)**
1. Detecting skin regions…  
2. Analyzing skin type…  
3. Checking for concerns…  
4. Building your profile…  
5. Almost ready…  

**Sample skin fact:** `Your skin renews itself roughly every 28 days.`

**States**
- In progress (bar ~60%, label 3)
- **Error:** icon, `Something went wrong`, **Try Again**, **Contact support**

---

### REPORT — Skin Report

**User goal:** See full results of latest scan.

**Layout:** Long **scroll**; sticky bottom CTA.

| Section | Content |
|---------|---------|
| **1. Score header** | Left: circular **user photo**. Right: **score ring** + `Skin Health Score: **74** / 100`. Sub: `Combination Skin · Fitzpatrick Type III`. Meta: `Scanned Jun 3, 2026` + link **`View History`** |
| **2. Skin type card** | Icon, title **Combination Skin**, 2-sentence description, **3 chips** (e.g. T-zone oily, Cheeks normal, Seasonal dryness) |
| **3. Concerns** | Heading **Your Skin Concerns**. Rows: icon, name, **severity bar**, one-line insight. Include **Healthy** rows (green). Chevron → detail |
| **4. Face map** | SVG-style **face outline**, colored zones (forehead, cheeks, nose, chin, under-eye). Legend or tooltip on tap |
| **5. What's working** | Heading **What's Working**. Bullets with check icons (e.g. Strong skin barrier, Good elasticity) |
| **6. Next steps** | 3 horizontal **action cards**: Start Your Routine · Explore Products · Scan Again in 7 Days |
| **Sticky bottom** | Primary **See My Personalized Routine →** |

**Sample concern row**
- **Hydration** · Medium · *Mild dehydration detected around cheeks*

**States**
- Default (filled with sample data)
- Optional: first-time variant with more celebratory header

---

### REPORT_DETAIL — Concern Detail

**User goal:** Understand one concern deeply.

**Layout (scroll)**
| Block | Heading | Content |
|-------|---------|---------|
| Header | — | Concern name + **severity badge** (Low/Medium/High) |
| 1 | **What is this?** | 2–3 sentences plain language |
| 2 | **What causes it?** | 3–4 bullets |
| 3 | **Your result** | Personalized paragraph (sample references cheeks) |
| 4 | **How to improve it** | Numbered tips ×3 |
| 5 | **Products that help** | Horizontal product cards ×3–5 (image, name, match %) |
| Footer link | **Learn more** → article |

**Sample header:** Dehydration · Medium

---

### ROUTINE_REVEAL — Routine Reveal (first time)

**User goal:** Celebrate personalized routine after first report.

**Layout**
| Zone | Content |
|------|---------|
| Top | Confetti / subtle celebration illustration |
| Title | **Your personalized routine is ready** |
| Sub | *Built for combination skin with focus on hydration and calming redness.* |
| Tabs or two blocks | **Morning** (5 steps summary) · **Evening** (4 steps summary) |
| Step preview | Compact list: icon, step name, ~1 min (no checkboxes yet) |
| CTA | **Start My Routine** |
| Secondary | Small note: *You can edit anytime* |

**Sample steps:** Gentle Cleanser · Hydrating Toner · Vitamin C Serum · Moisturizer · SPF 30

**States:** Default

---

### HOME — Home Dashboard

**User goal:** Daily overview — score, routine, insights.

**Shows:** Bottom tab bar, **Home** active.

**Layout (scroll)**

| Section | Elements |
|---------|----------|
| **Header** | `Good morning, Alex ☀️` (variant: afternoon/evening). Date `Wednesday, Jun 3`. Badge **`🔥 7-day streak`**. Bell icon |
| **Score card** | Score ring **74**, delta **`+3 since last scan ↑`** (green). `Last scanned: 3 days ago`. Button **Scan Now** |
| **Today's routine** | Label **Your Morning Routine**. `2 of 5 steps complete` progress. **3 compact step rows** with circle checkbox (unchecked). Link **View Full Routine** |
| **Weekly insight** | Card (Surface Alt). AI copy sample: *Your hydration improved 12% this week. Keep using your hyaluronic acid serum.* |
| **Quick actions** | 4 icons + labels: **Scan** · **Products** · **Progress** · **Chat** |
| **Learn** | Heading **Learn something new**. 2 article cards: thumbnail, title, read time, concern chip |
| **Community** | Card **grayed** + overlay **Coming soon** |

**States to design**
| State | Change |
|-------|--------|
| Default | As above |
| No scan yet | Score card → **Take your first scan** CTA, no delta |
| No insight | Hide weekly insight section |
| Evening | Header + **Your Evening Routine** |

**Sample article:** *Why hyaluronic acid works for dehydrated skin* · 4 min · Hydration

---

### ROUTINE — Routine List

**User goal:** Complete morning or evening skincare steps.

**Tab bar:** **Routine** active.

**Layout**
| Zone | Content |
|------|---------|
| Top | Segmented control **Morning | Evening** |
| Subheader | **`🔥 12 days consistent`** + thin progress bar (today's session) |
| List | **Routine step cards** (see card spec) |
| Bottom | **Edit Routine** (secondary) |

**Routine step card**
| Part | Content |
|------|---------|
| Left | Step number pill + category icon |
| Center | **1. Gentle Cleanser** · `Try: CeraVe Hydrating Cleanser` · Why line · `~1 min` |
| Right | Empty circle → checked green checkmark |

**Sample why line:** *Targets dryness from your last scan*

**States**
| State | Visual |
|-------|--------|
| Morning / Evening | Segment selected |
| All done | Celebration banner **All done for this session!** 🎉 |
| Empty | Illustration + *Complete your first scan to unlock your routine.* |

---

### ROUTINE_STEP — Routine Step Detail

**User goal:** Learn how to perform one step.

**Layout**
| Block | Content |
|-------|---------|
| Header | Large category icon + **Gentle Cleanser** |
| Why | **Why it's in your routine** + personalized paragraph |
| How | **How to apply** numbered list (3–4 steps) |
| Dosage | **How much** — visual (e.g. “2 pumps” diagram or simple graphic) |
| When | Chips **AM** **PM** · `Daily` |
| Pro tip | Tinted callout box |
| Products | **Recommended for this step** — 3 small product cards |
| Bottom sticky | **Mark as done** primary |

**Sample how-to:** 1. Wet face with lukewarm water. 2. Apply 2 pumps…

---

### EDIT_ROUTINE — Edit Routine (P1)

**User goal:** Reorder, enable/disable, add steps.

**Layout**
| Element | Spec |
|---------|------|
| Toggle | Morning / Evening |
| List | Rows with **drag handle**, step name, **on/off switch** |
| Actions | **+ Add a step** · **Reset to AI recommendation** (text, warning color on confirm) |
| Sticky | **Save Changes** |

**States:** Default with 5–6 rows

---

### PRODUCTS — Products Browse

**User goal:** Find products matched to skin.

**Access:** More menu / drawer → Products (or quick action).

**Layout**
| Zone | Content |
|------|---------|
| Search | `Search products…` |
| Filters | Horizontal chips: Skin Type · Concern · Category · Price · Vegan · Fragrance-free |
| Sort row | `Sort: Best Match ▾` |
| Grid | **2 columns** product cards |
| FAB | Bottom-right **camera** (ingredient scan) |

**Product card**
- Image · Brand (caption gray) · Product name · **Match 92%** badge · ★ 4.5 (2.1k) · **$18.99** · **Add to Routine** text button

**States**
- Default grid (6+ cards)
- **Empty:** *No products match these filters. Try widening your search.*

---

### PRODUCT_DETAIL — Product Detail

**User goal:** Decide if product fits; buy or add to routine.

**Layout**
| Zone | Content |
|------|---------|
| Hero | Large product image (pinch-zoom hint optional) |
| Title block | Brand · Product name · category chip · **Match ring 92%** |
| Personal | **Why it matches your skin** paragraph |
| Price | **$18.99** |
| Retailers | Buttons **Sephora** · **Ulta** · **Amazon** (small “Affiliate” label) |
| Rating | ★★★★☆ 4.5 · 2,120 reviews |
| Tabs | **Overview** · **Ingredients** · **Reviews** · **Alternatives** |
| Tab content | Overview: description, benefits, how to use (design Overview only for P0) |
| Sticky bar | **Add to Routine** primary · Bookmark icon |

**States:** Overview tab selected; optional second frame Ingredients list

---

### INGREDIENT_SCAN — Ingredient Scanner (P1)

**States as 2 frames**

**Frame A — Camera**
- Rear camera preview
- Overlay text: **Point at ingredient list on product label**
- Bottom **Scan** button

**Frame B — Results bottom sheet**
- Product name (if known): **CeraVe Hydrating Cleanser**
- Scores: **Safety 88** · **Your match 92**
- Scrollable ingredient rows with 🟢🟡🔴 dots
- Section **What to watch out for**
- **Save this product**

---

### PROGRESS — Progress

**User goal:** See trends and history.

**Tab bar:** **Progress** active.

**Layout (scroll)**
| Section | Content |
|---------|---------|
| **Score trend** | Line chart, toggles **30d | 90d | 180d**. Annotations on chart: flags “Started new routine” |
| **Concern trends** | Rows: concern name, mini sparkline/bar, **+12%** green or **-5%** red |
| **Photo timeline** | Horizontal cards: date, score badge, face thumb |
| **Milestones** | Badge grid earned (color) vs locked (gray) |
| **Weekly digest** | Card: AI summary + routine adherence **78%** |

**Sample milestones:** 7-day streak · First scan · Improved hydration

---

### COMPARE — Compare Scans (P1)

**User goal:** Compare two dates visually.

**Design 2 variants (pick one for MVP)**
1. **Side-by-side:** two face photos, date dropdown each, scores below, **delta table** below
2. **Slider:** before/after with draggable center handle

**Footer CTA:** **Share Progress**

**Sample delta table columns:** Concern · Before · After · Change

---

### LEARN — Learn Hub (P1)

**Layout**
| Zone | Content |
|------|---------|
| Search | `Search articles…` |
| Tabs | **All · For Your Skin · Ingredients · Routines · Trends** |
| Featured | Full-width large card |
| Grid | 2-col or list: thumb, title, concern tag, read time, **Recommended for you** badge (some) |
| FAB | **Ask AI** floating button (bottom right, Primary) |

---

### ARTICLE — Article Reader (P1)

**Layout**
| Zone | Content |
|------|---------|
| Top right | Share |
| Hero | Full-width image |
| Meta | Category chip · `5 min read` |
| Title | H1 sample |
| Badge | **Reviewed by Dr. Sarah Chen, MD** |
| Body | Rich text: paragraphs, **pull quote**, inline ingredient highlight, **product callout card** |
| Footer sections | **Related to your skin** · **Related articles** horizontal scroll |

---

### AI_CHAT — AI Chat (P1)

**Layout**
| Zone | Content |
|------|---------|
| Top | **Powered by SkinSense AI** caption |
| Disclaimer (first visit) | AI bubble: *I'm an AI skincare advisor, not a doctor…* |
| Messages | User right (Primary Pale bubble), AI left (white card + small logo avatar) |
| Chips (empty state) | Suggested questions ×3 |
| Input bar | Text field + send icon |

**Sample chips**
- What's causing my acne?
- Is SPF important every day?
- Can I mix retinol and vitamin C?

**Sample AI reply:** *Based on your recent scan showing mild dehydration…*

**States:** Empty with chips · Conversation with 3+ messages

---

### PROFILE — Profile

**User goal:** Account hub.

**Layout**
| Zone | Content |
|------|---------|
| Top | Circular **avatar** (edit affordance), **Alex Johnson**, email, `Member since Jan 2026` |
| Badges | **Combination** skin · **Fitzpatrick III** |
| Stats row | 3 columns: **12** Total Scans · **7** Day Streak · **85%** Routine Adherence |
| Menu list | Rows with icon + label + chevron (see list) |

**Menu items (exact labels)**
- Edit Profile  
- My Skin Profile  
- Notification Settings  
- Privacy & Data  
- App Settings  
- Help & Support  
- Terms & Privacy Policy  
- Sign Out  
- **Delete Account** (red, bottom, no chevron or destructive style)

---

### EDIT_PROFILE — Edit Profile

**Layout:** Form scroll + sticky **Save**

| Field | Type |
|-------|------|
| Profile photo | Tap to change |
| First name · Last name | Text |
| Email | Text + note “Verified” |
| Date of birth | Date picker |
| Gender | Optional dropdown |
| Skin goals | Multi-select chips (same options as quiz Q5) |

---

### SKIN_PROFILE — My Skin Profile

**Layout (scroll)**
| Block | Content |
|-------|---------|
| Skin type | **Combination** + link **Disagree? Tell us** |
| Fitzpatrick | Visual scale 1–6, **III highlighted** |
| Top concerns | 5 rows: name, severity bar, trend arrow ↑↓ |
| Sensitivities | Tags: Fragrance · Alcohol · Essential oils |
| Preferences | Vegan · Fragrance-free chips |
| CTA | **Retake Skin Quiz** |
| History | List: date + score per scan |

---

### PRIVACY — Privacy & Data

**Layout (scroll)**
| Block | Content |
|-------|---------|
| Intro | **Your privacy matters** (H2) |
| Collect | Bullet list plain language (account, quiz, scores, routine — **not photos**) |
| Callout card | Prominent: **Your photos are processed on-device and NEVER uploaded** (icon lock) |
| Cloud data | Short list what syncs |
| Toggle | **Allow anonymized research data** ON by default + explanation |
| Buttons | **Export My Data** (secondary) · **Delete All My Data** (destructive) |
| Links | Privacy Policy · GDPR Rights · CCPA Rights |

---

### SETTINGS — Settings

**Layout:** Grouped list sections

**Notifications**
| Row | Control |
|-----|---------|
| Morning routine reminder | Toggle + time `8:00 AM` |
| Evening routine reminder | Toggle + time `9:00 PM` |
| Weekly scan reminder | Toggle + day `Sunday` |
| Skin tips and insights | Toggle |
| Product restocking reminders | Toggle |

**App**
| Row | Control |
|-----|---------|
| Theme | Light / Dark / System |
| Haptic feedback | Toggle |
| Face ID login | Toggle |
| Language | Disabled “Coming soon” |

**Routine**
| Row | Control |
|-----|---------|
| Default routine view | Morning / Evening / Last used |
| Auto-advance steps | Toggle |

**Data & Sync**
| Row | Control |
|-----|---------|
| Apple Health / Google Fit | Toggle |
| Backup scan history | Toggle |
| Clear local cache | Button |

---

## 5. Overlays & shared patterns (Stitch components)

Design these as reusable overlays referenced by multiple screens:

| ID | Pattern | Use on |
|----|---------|--------|
| SHEET_PERMISSION | Icon, title, body, **Allow** / **Not now**, link **Open Settings** | Camera, notifications |
| SHEET_STEP_PICKER | List of routine step types to add product | Product detail |
| TOAST_ERROR | Red accent, one line message | Login, network |
| TOAST_SUCCESS | Green check, one line | Saved, routine complete |
| DIALOG_CONFIRM | Title, body, Cancel / Confirm | Sign out, delete data, reset routine |
| OFFLINE_BANNER | Top strip: *Offline — some features unavailable* | Any main screen |
| LOADING_OVERLAY | Semi-transparent + spinner | Form submit |

---

## 6. Content placeholders (use in all mocks)

| Type | Sample |
|------|--------|
| User name | Alex Johnson |
| Skin score | 74 |
| Skin type | Combination |
| Fitzpatrick | Type III |
| Date | Jun 3, 2026 |
| Product | CeraVe Hydrating Cleanser · $18.99 · Match 92% |
| Streak | 7 days |
| Concerns | Hydration (Medium), Acne (Low), Texture (Low) |

---

## 7. Stitch delivery checklist

For each screen ID, export:
- [ ] Default state (light mode)
- [ ] Required variants from **States to design**
- [ ] Dark mode (optional V1.0 — Settings supports theme; prioritize Home + Report if limited time)
- [ ] Specs use **global colors & type** (§1)
- [ ] Frame named `{ID} — {State}`
- [ ] Link to next screen noted in Figma/Stitch comment (matching navigation in §2 of plan)

**Recommended Stitch order**
1. Global components + tab bar  
2. SPLASH → WELCOME → LOGIN → SIGNUP  
3. QUIZ (5) → QUIZ_RESULT → SCAN_GUIDE → CAMERA → ANALYZING  
4. REPORT → REPORT_DETAIL → ROUTINE_REVEAL  
5. HOME → ROUTINE → ROUTINE_STEP  
6. PRODUCTS → PRODUCT_DETAIL  
7. PROGRESS → PROFILE → SKIN_PROFILE → PRIVACY → SETTINGS  
8. P1: LEARN, ARTICLE, AI_CHAT, INGREDIENT_SCAN, COMPARE, EDIT_ROUTINE  

---

*Design spec v1.0 — aligned with SkinSense REQUIREMENTS (June 2026 MVP)*
