import styles from './SectionHeader.module.css';

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'center',
  id,
}: {
  eyebrow?: string;
  title: string;
  lead: string;
  align?: 'center' | 'left';
  id?: string;
}) {
  return (
    <header
      id={id}
      className={`${styles.header} ${align === 'left' ? styles.alignLeft : styles.alignCenter}`}
    >
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.lead}>{lead}</p>
    </header>
  );
}
