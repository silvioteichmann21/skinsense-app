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

export const WELCOME_SLIDES: WelcomeSlide[] = [
  {
    id: '1',
    title: 'Know Your Skin',
    subtitle: 'AI analyzes 15+ factors from one selfie',
    image: require('../../../assets/welcome/slide-1.png'),
    imageFit: 'cover',
    frameStyle: 'glass',
    showAiBadge: true,
  },
  {
    id: '2',
    title: 'Routines Built for You',
    subtitle: 'Morning and evening steps matched to your skin',
    image: require('../../../assets/welcome/slide-2.jpg'),
    imageFit: 'contain',
    frameStyle: 'solid',
  },
  {
    id: '3',
    title: 'Track Real Progress',
    subtitle: 'See real change over weeks, not guesswork',
    image: require('../../../assets/welcome/slide-3.jpg'),
    imageFit: 'cover',
    frameStyle: 'glass',
  },
];
