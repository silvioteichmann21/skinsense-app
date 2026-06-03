import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { IconCheck } from '@/components/icons';
import { LandingImage } from '@/components/LandingImage';
import { WaitlistForm } from '@/components/WaitlistForm';
import { LANDING_IMAGES } from '@/lib/landing-assets';

import styles from './page.module.css';

const APP_STEPS = [
  {
    step: '1',
    title: 'Scan your face',
    body: 'Take a guided selfie in natural light. SkinSense maps hydration, texture, and sensitivity on your device—your photos never leave your phone.',
  },
  {
    step: '2',
    title: 'Get your skin report',
    body: 'See a clear health score, skin type, and concern breakdown in seconds—written for humans, grounded in clinical signals.',
  },
  {
    step: '3',
    title: 'Follow your routine',
    body: 'Morning and evening steps matched to your scan and skin quiz. Track progress and rescan to see real change over time.',
  },
];

const CLINICAL_POINTS = [
  {
    title: 'On-device privacy',
    body: 'Analysis runs on your phone. We never upload your selfies to our servers.',
  },
  {
    title: 'Dermatological precision',
    body: '15+ factors scored in seconds—from barrier health to texture—for a blueprint you can trust.',
  },
];

const RITUAL_CARDS = [
  {
    title: 'Personalized Routines',
    body: 'AI-matched cleanser, serum, and moisturizer steps curated for your skin type, concerns, and goals.',
    image: LANDING_IMAGES.routineProducts,
    alt: 'Personalized cleanser, serum, and moisturizer routine',
  },
  {
    title: 'Real Progress Tracking',
    body: 'Before-and-after scans and monthly reports so you can see hydration, glow, and concern trends—not guesswork.',
    image: LANDING_IMAGES.progress,
    alt: 'Before and after skin analysis comparison',
  },
  {
    title: 'Guided skin insights',
    body: 'Every metric in your report explained in plain language—so you know what to do next, like a coach in your pocket.',
    image: LANDING_IMAGES.expertGuidance,
    alt: 'In-app face scan with guided skin analysis',
  },
];

export default function LandingPage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.heroBadge}>The future of skincare</p>
            <h1 className={styles.heroTitle}>Know your skin. Own your glow.</h1>
            <p className={styles.heroLead}>
              <strong>SkinSense</strong> is an AI skin-analysis app for iOS and Android.
              Scan your face, get a clinical-style report, and a personalized morning &amp;
              evening routine—built for you, private by design.
            </p>
            <WaitlistForm variant="inline" id="hero" />
            <p className={styles.heroNote}>Join the waitlist for early access and beta invites.</p>
            <div className={styles.heroMockup}>
              <LandingImage
                src={LANDING_IMAGES.appScan}
                alt="SkinSense in-app face scan with analysis guides"
                variant="heroScan"
                priority
              />
            </div>
          </div>
        </section>

        <section className={styles.intro} aria-labelledby="intro-heading">
          <div className="container">
            <h2 id="intro-heading" className={styles.introTitle}>
              How SkinSense works
            </h2>
            <p className={styles.introLead}>
              Three steps from first scan to a routine you can start tonight—no generic
              templates, no photo uploads to the cloud.
            </p>
            <ol className={styles.introSteps}>
              {APP_STEPS.map((item) => (
                <li key={item.step} className={styles.introStep}>
                  <span className={styles.introStepNum}>{item.step}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="science" className={styles.clinical}>
          <div className={`container ${styles.clinicalGrid}`}>
            <LandingImage
              src={LANDING_IMAGES.clinical}
              alt="Clinical face scan with dermatological grid overlay"
              variant="clinical"
            />
            <div className={styles.clinicalCopy}>
              <p className={styles.labelCaps}>Clinical precision</p>
              <h2 className={styles.clinicalTitle}>
                Clinical analysis for your skin—not a one-size-fits-all quiz
              </h2>
              <p className={styles.clinicalBody}>
                Our AI reads real pixels from your scan—hydration, texture, sensitivity,
                and more—then blends your skin profile so recommendations fit{' '}
                <em>you</em>, not an average face.
              </p>
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
            <h2 className={styles.ritualTitle}>Designed for your daily ritual</h2>
            <p className={styles.ritualLead}>
              Everything in the app is built to turn analysis into action—products, timing,
              and education you can trust.
            </p>
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

        <section id="reviews" className={styles.reviewsAnchor} aria-hidden />

        <section id="waitlist" className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>Ready to own your glow?</h2>
              <p className={styles.ctaLead}>
                Be among the first to try SkinSense. Waitlist members get early access, beta
                invites, and a personalized skin baseline when we launch.
              </p>
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
