import type { ImageContentFit, ImageSource } from 'expo-image';

export type WelcomeSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSource;
  imageFit: ImageContentFit;
  /** Glass = translucent (slides 1 & 3). Solid = white product card (slide 2). */
  frameStyle: 'glass' | 'solid';
  showAiBadge?: boolean;
};
