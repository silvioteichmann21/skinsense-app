import { PROFILE_USER } from '@/screens/profile/profileMockData';
import type { GenderValue } from '@/types/profile';

export type { GenderValue } from '@/types/profile';

export const GENDER_OPTIONS: { value: GenderValue; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const EDIT_PROFILE_DEFAULTS = {
  firstName: 'Alex',
  lastName: 'Johnson',
  email: PROFILE_USER.email,
  dateOfBirth: '1992-06-15',
  gender: 'male' as GenderValue,
  avatarUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBA88QLGhVbw4DwGiBC-4oh3txA-65wAPp2N_OxcwPLYBjSFNy3INMREZyCT4f2lW0Zz8ITk-WQJrOXT3oUAbvZll_hZdP8fW4ubi9s13K5G6gX2w9WqjQLV6w9z0wcmRtSZNfozjxKVhW14KynFEcAhiXUDHRWBbPzA7eZUw1j10s9Zt6IA4okyNdnDmc9ols-45kwL18Id2E0B-m_KJDB6-gGjtez3U9wDKoF91uywyD13IxALQkcRWj1yKqVmZJynUSu5JUJ134',
  skinGoals: ['anti-aging', 'hydration'],
};

export function genderLabel(value: GenderValue): string {
  return GENDER_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
