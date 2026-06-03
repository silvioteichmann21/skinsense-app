import { IconArrowUpRight, IconShare } from '@/components/icons';

import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo}>
          SkinSense
        </a>
        <nav className={styles.links} aria-label="Legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="mailto:hello@skinsense.app">Contact</a>
        </nav>
        <div className={styles.end}>
          <div className={styles.social} aria-label="Share">
            <button type="button" className={styles.iconBtn} aria-label="Open">
              <IconArrowUpRight />
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Share">
              <IconShare />
            </button>
          </div>
          <p className={styles.copy}>© {year} SkinSense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
