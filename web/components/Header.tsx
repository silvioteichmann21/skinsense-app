import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#" className={styles.logo}>
          SkinSense
        </a>
        <nav className={styles.nav} aria-label="Primary">
          <a href="#about">About</a>
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#science">Science</a>
        </nav>
        <a href="#waitlist" className={styles.cta}>
          Join Waitlist
        </a>
      </div>
    </header>
  );
}
