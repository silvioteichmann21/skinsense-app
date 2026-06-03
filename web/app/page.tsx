import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import {
  IconCheck,
  IconReport,
  IconRoutine,
  IconScan,
  IconShield,
  IconSparkle,
} from '@/components/icons';
import { LandingImage } from '@/components/LandingImage';
import { SectionHeader } from '@/components/SectionHeader';
import { WaitlistForm } from '@/components/WaitlistForm';
import { LANDING_IMAGES } from '@/lib/landing-assets';

import styles from './page.module.css';

const HERO_STATS = [
  { value: '15+', label: 'Skin signals analyzed per scan' },
  { value: '100%', label: 'On-device photo processing' },
  { value: 'AM & PM', label: 'Personalized daily routines' },
];

const APP_STEPS = [
  {
    step: '01',
    title: 'Scan your face',
    icon: IconScan,
    body: 'Open the guided camera in natural light. SkinSense aligns your face, crops securely, and analyzes hydration, texture, sensitivity, and more—all on your phone.',
  },
  {
    step: '02',
    title: 'Read your skin report',
    icon: IconReport,
    body: 'Get an easy-to-read health score, skin type, and concern breakdown in seconds. Every metric is explained so you understand what it means for your routine.',
  },
  {
    step: '03',
    title: 'Follow your routine',
    icon: IconRoutine,
    body: 'Receive morning and evening steps matched to your scan plus onboarding quiz. Check off products daily and rescan to track real progress over weeks.',
  },
];

const IN_APP_FEATURES = [
  {
    title: 'On-device face analysis',
    body: 'Vision models run locally. Your selfies are not uploaded to SkinSense servers for analysis.',
    icon: IconScan,
    wide: true,
  },
  {
    title: 'Skin health score',
    body: 'One number to track overall condition, with detail on hydration, barrier, and texture.',
    icon: IconSparkle,
    wide: false,
  },
  {
    title: '5-step skin quiz',
    body: 'Goals, concerns, and lifestyle feed into recommendations—not a generic skin-type label alone.',
    icon: IconReport,
    wide: false,
  },
  {
    title: 'Morning & evening routines',
    body: 'Step-by-step product guidance with timing, curated from your unique profile.',
    icon: IconRoutine,
    wide: false,
  },
  {
    title: 'Progress & compare scans',
    body: 'Side-by-side visits show what changed—so you know if your routine is working.',
    icon: IconCheck,
    wide: false,
  },
  {
    title: 'Privacy-first account',
    body: 'Optional sign-in syncs scores and routines—not your face photos. Sign out anytime.',
    icon: IconShield,
    wide: true,
  },
];

const CLINICAL_POINTS = [
  {
    title: 'Real pixels, not guesses',
    body: 'We analyze your actual scan image alongside your quiz—so advice reflects your face today.',
  },
  {
    title: 'On-device privacy',
    body: 'Processing stays on your phone. Only anonymized scores sync when you choose to sign in.',
  },
  {
    title: 'Clinical-style clarity',
    body: 'Reports use dermatological language made simple—strengths, concerns, and what to prioritize.',
  },
];

const RITUAL_CARDS = [
  {
    title: 'Personalized routines',
    body: 'Cleanser, treatment, and moisturizer steps chosen for your skin type, concerns, climate, and goals.',
    image: LANDING_IMAGES.routineProducts,
    alt: 'Personalized skincare routine products',
  },
  {
    title: 'Real progress tracking',
    body: 'Before-and-after scans and trend lines for hydration and glow—see change, not vanity metrics.',
    image: LANDING_IMAGES.progress,
    alt: 'Before and after skin analysis',
  },
  {
    title: 'Guided skin insights',
    body: 'In-app coaching explains each result so you know why SPF, hydration, or barrier care matters for you.',
    image: LANDING_IMAGES.expertGuidance,
    alt: 'Guided in-app skin analysis',
  },
];

const WAITLIST_PERKS = [
  'Early beta access on iOS & Android',
  'Personalized skin baseline at launch',
  'Direct line for feedback before public release',
];

export default function LandingPage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden />
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.heroBadge}>
                <span className={styles.badgeDot} />
                The future of skincare
              </p>
              <h1 className={styles.heroTitle}>
                Know your skin.
                <span className={styles.heroTitleAccent}> Own your glow.</span>
              </h1>
              <p className={styles.heroLead}>
                <strong>SkinSense</strong> is a mobile app that turns a 60-second face scan
                into a clinical-style skin report and a personalized AM/PM routine—private,
                on your device, built for real results.
              </p>
              <WaitlistForm variant="inline" id="hero" />
              <p className={styles.heroNote}>
                Free to join · No spam · Be first when we open the beta
              </p>
              <ul className={styles.heroStats}>
                {HERO_STATS.map((s) => (
                  <li key={s.label}>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroVisualGlow} aria-hidden />
              <LandingImage
                src={LANDING_IMAGES.appScan}
                alt="SkinSense in-app face scan with analysis guides"
                variant="heroScan"
                priority
              />
            </div>
          </div>
        </section>

        <section id="about" className={styles.about}>
          <div className="container">
            <SectionHeader
              eyebrow="What is SkinSense"
              title="Skincare that starts with your skin—not a generic quiz"
              lead="Most apps ask five questions and recommend the same routine. SkinSense reads your face, scores what matters, and builds steps you can follow tonight."
              align="left"
            />
            <div className={styles.aboutGrid}>
              <div className={styles.aboutProse}>
                <p>
                  Whether you struggle with dryness, uneven tone, sensitivity, or just want a
                  routine you can trust, SkinSense gives you a{' '}
                  <strong>clear starting point</strong>: a scan, a report, and daily guidance
                  tuned to you.
                </p>
                <p>
                  We combine <strong>on-device computer vision</strong> with your skin profile
                  (type, concerns, goals) so product and timing recommendations reflect{' '}
                  <em>your</em> data—not trends or influencer lists.
                </p>
                <p className={styles.aboutDisclaimer}>
                  SkinSense supports your skincare decisions; it does not replace care from a
                  licensed dermatologist.
                </p>
              </div>
              <aside className={styles.aboutHighlight}>
                <p className={styles.aboutHighlightLabel}>You get in every session</p>
                <ul>
                  <li>Instant skin health score</li>
                  <li>Hydration, texture & sensitivity readout</li>
                  <li>Personalized morning & evening steps</li>
                  <li>Progress when you rescan</li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section id="how-it-works" className={styles.howItWorks}>
          <div className="container">
            <SectionHeader
              eyebrow="How it works"
              title="From first scan to tonight's routine in three steps"
              lead="No photo uploads to our servers for analysis. No endless product quizzes without feedback. Just scan, learn, and act."
            />
            <ol className={styles.stepTimeline}>
              {APP_STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.step} className={styles.stepCard}>
                    <div className={styles.stepIconWrap}>
                      <Icon className={styles.stepIcon} />
                    </div>
                    <span className={styles.stepNum}>{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className={styles.bentoSection}>
          <div className="container">
            <SectionHeader
              eyebrow="Inside the app"
              title="Everything you need to understand and improve your skin"
              lead="SkinSense is a full daily companion—not a one-off scan. Here's what you'll use after you download."
            />
            <div className={styles.bento}>
              {IN_APP_FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <article
                    key={f.title}
                    className={`${styles.bentoCard} ${f.wide ? styles.bentoWide : ''}`}
                  >
                    <div className={styles.bentoIcon}>
                      <Icon />
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="science" className={styles.clinical}>
          <div className={`container ${styles.clinicalGrid}`}>
            <div className={styles.clinicalVisual}>
              <LandingImage
                src={LANDING_IMAGES.clinical}
                alt="Clinical face scan with dermatological analysis grid"
                variant="clinical"
              />
            </div>
            <div className={styles.clinicalCopy}>
              <SectionHeader
                eyebrow="Clinical precision"
                title="Analysis built for individual faces—not averages"
                lead="Our pipeline scores hydration, texture, sensitivity, and more from your scan, then merges your quiz so routines match your real profile."
                align="left"
              />
              <ul className={styles.clinicalList}>
                {CLINICAL_POINTS.map((item) => (
                  <li key={item.title}>
                    <IconCheck className={styles.checkIcon} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className={styles.ritual}>
          <div className="container">
            <SectionHeader
              eyebrow="Your daily ritual"
              title="Designed to fit your life—not overwhelm it"
              lead="Turn analysis into habits: the right steps, at the right time, with context you can trust."
            />
            <div className={styles.ritualGrid}>
              {RITUAL_CARDS.map((card) => (
                <article key={card.title} className={styles.ritualCard}>
                  <div className={styles.ritualCardArt}>
                    <LandingImage src={card.image} alt={card.alt} variant="card" />
                  </div>
                  <div className={styles.ritualCardBody}>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.trust}>
          <div className="container">
            <div className={styles.trustCard}>
              <IconShield className={styles.trustIcon} />
              <div>
                <h2>Your face stays on your phone</h2>
                <p>
                  Scan images are processed on-device. We designed SkinSense so you can explore
                  your skin with confidence—before you ever share an email on the waitlist.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="waitlist" className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <p className={styles.ctaEyebrow}>Early access</p>
              <h2 className={styles.ctaTitle}>Ready to own your glow?</h2>
              <p className={styles.ctaLead}>
                Join the SkinSense waitlist. We&apos;re finishing the beta for iOS and Android—
                get invited first and start with a personalized skin baseline when we launch.
              </p>
              <ul className={styles.ctaPerks}>
                {WAITLIST_PERKS.map((perk) => (
                  <li key={perk}>
                    <IconCheck className={styles.ctaCheck} />
                    {perk}
                  </li>
                ))}
              </ul>
              <WaitlistForm variant="card" id="bottom" />
              <p className={styles.ctaNote}>Limited spots for our next beta release.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
