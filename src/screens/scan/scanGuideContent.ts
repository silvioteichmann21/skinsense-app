import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ImageSource } from 'expo-image';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Bundled scan-prep photo shown before opening the camera. */
export const SCAN_GUIDE_HERO_IMAGE: ImageSource = require('../../../assets/scan/guide-hero-v2.png');

export type ScanTip = {
  id: string;
  icon: IconName;
  text: string;
};

/** English defaults; screens use `useScanTips()` for localized copy. */
export const scanTips: ScanTip[] = [
  { id: 'light', icon: 'white-balance-sunny', text: 'Find natural light or face a bright lamp' },
  { id: 'makeup', icon: 'face-woman-shimmer', text: 'Remove makeup if possible for best results' },
  { id: 'expression', icon: 'emoticon-neutral-outline', text: 'Keep face neutral, no big smiles' },
  { id: 'distance', icon: 'cellphone', text: "Hold phone at eye level, arm's length away" },
];
