import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const SCAN_GUIDE_HERO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAPzjz89X1K-hQoyjAfuJsRL43FCq-zk9vBMscY-OADQx4vlXznPRLA9dIWSZLKEHX1cs9jHXHM2x3ybfA6y7YXRy8vBmdNglWFy-sSy3_3KGx0hfveL7ONfuapP2l5fcPfku0YOfzbUKN8m8ebfV3_d0VEgFey6mh35_BU2KgE0HYhA2MnAp9lKOJiaHuD2Uc5FAR285_DlCdFFA9B59GxHbmcNxEu-UC5PAdsRybKVkCAoAjZRLntmZq8HNCMWx4Xu1XjzsRPfk';

export type ScanTip = {
  id: string;
  icon: IconName;
  text: string;
};

export const scanTips: ScanTip[] = [
  { id: 'light', icon: 'white-balance-sunny', text: 'Find natural light or face a bright lamp' },
  { id: 'makeup', icon: 'face-woman-shimmer', text: 'Remove makeup if possible for best results' },
  { id: 'expression', icon: 'emoticon-neutral-outline', text: 'Keep face neutral, no big smiles' },
  { id: 'distance', icon: 'cellphone', text: "Hold phone at eye level, arm's length away" },
];
