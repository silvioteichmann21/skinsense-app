import Image from 'next/image';

import styles from './LandingImage.module.css';

type LandingImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  variant?: 'clinical' | 'card' | 'hero' | 'heroScan';
};

export function LandingImage({
  src,
  alt,
  priority = false,
  variant = 'card',
}: LandingImageProps) {
  const variantClass = styles[variant] ?? styles.card;

  return (
    <div className={`${styles.wrap} ${variantClass}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={
          variant === 'clinical'
            ? '(min-width: 900px) 45vw, 100vw'
            : variant === 'hero' || variant === 'heroScan'
              ? '(min-width: 900px) 720px, 100vw'
              : '(min-width: 768px) 30vw, 100vw'
        }
        className={styles.img}
      />
    </div>
  );
}
