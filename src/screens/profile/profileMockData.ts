import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: IconName;
  action: 'products' | 'editProfile' | 'skinProfile' | 'privacy' | 'settings' | 'placeholder' | 'signOut';
};

export const PROFILE_USER = {
  displayName: 'Alex Johnson',
  email: 'alex.j@email.com',
  memberSince: 'Member since Jan 2026',
  avatarUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBnA_skBcOEpZQkaImXJ_UwiJpbfppMMtXbI9afSziB_TlzHvIIZMnnsLT4rU-qhqGGh4yMGqilB2RE_uuX7yNpMp7k5BaIoTodXBWIg6RNyLOI1FsR0rQcsmK1FTrDdzcS7DazIQHCFZbrnf6wnXyazz9h1XARPyewPTv818R8WFAtGY4aN0ojL-jyIA8SB4xcbc20buosRWup7X62g4z9WIiGTR5of--YOsjvqQiF2oHKaszN6hgkFNYmPelIXRQAMN3e_ArXe3g',
  skinType: 'Combination Skin',
  fitzpatrick: 'Fitzpatrick Type III',
  totalScans: 12,
  streakDays: 7,
  adherencePercent: 85,
};

export const PROFILE_MENU: ProfileMenuItem[] = [
  { id: 'edit', label: 'Edit Profile', icon: 'pencil-outline', action: 'editProfile' },
  { id: 'skin', label: 'My Skin Profile', icon: 'face-man-outline', action: 'skinProfile' },
  { id: 'notif', label: 'Notification Settings', icon: 'bell-ring-outline', action: 'settings' },
  { id: 'privacy', label: 'Privacy & Data', icon: 'shield-outline', action: 'privacy' },
  { id: 'products', label: 'Products', icon: 'shopping-outline', action: 'products' },
  { id: 'settings', label: 'App Settings', icon: 'cog-outline', action: 'settings' },
  { id: 'help', label: 'Help & Support', icon: 'help-circle-outline', action: 'placeholder' },
  { id: 'terms', label: 'Terms & Privacy Policy', icon: 'file-document-outline', action: 'placeholder' },
  { id: 'signout', label: 'Sign Out', icon: 'logout', action: 'signOut' },
];
