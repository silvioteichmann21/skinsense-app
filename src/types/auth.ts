import type { GenderValue } from '@/types/profile';

export type UserProfile = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  gender: GenderValue | null;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: GenderValue;
};
