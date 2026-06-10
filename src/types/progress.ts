import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type TrendPeriod = '30d' | '90d' | '180d';

export type ScoreTrendPoint = {
  label: string;
  score: number;
};

export type ConcernTrend = {
  id: string;
  name: string;
  status: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  change: string;
  changePositive: boolean;
  sparkline: number[];
  sparkStroke?: string;
};

export type TimelinePhoto = {
  id: string;
  dateLabel: string;
  score: number;
  imageUri: string;
  dimmed?: boolean;
};

export type Milestone = {
  id: string;
  label: string;
  icon: IconName;
  unlocked: boolean;
};

export type CompareScanOption = {
  id: string;
  dateLabel: string;
  score: number;
  imageUri: string;
  badge: string;
};

export type CompareDeltaRow = {
  id: string;
  concern: string;
  before: string;
  after: string;
  change: string;
  changePositive?: boolean;
};
