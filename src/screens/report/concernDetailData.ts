import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { ReportConcern } from '@/types/skinAnalysis';
import type { AppColors } from '@/theme/palettes';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type CauseChip = {
  icon: IconName;
  label: string;
};

export type ImprovementStep = {
  title: string;
  body: string;
};

export type ConcernDetailContent = {
  displayTitle: string;
  whatIs: string;
  causes: CauseChip[];
  yourResult: string;
  highlightPhrase?: string;
  improvements: ImprovementStep[];
  ingredientIds: string[];
  libraryTopic: string;
};

export function severityShortLabel(severity: ReportConcern['severity']): string {
  switch (severity) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'healthy':
      return 'Healthy';
    default:
      return 'Low';
  }
}

export function severityBadgeColors(severity: ReportConcern['severity'], colors: AppColors) {
  switch (severity) {
    case 'medium':
      return { bg: 'rgba(255, 171, 105, 0.2)', text: colors.accentTagText, icon: '#8E4E14' };
    case 'high':
      return { bg: 'rgba(186, 26, 26, 0.12)', text: colors.error, icon: colors.error };
    case 'healthy':
      return { bg: colors.primaryPale, text: colors.primaryDark, icon: colors.primary };
    default:
      return { bg: colors.primaryPale, text: colors.primaryDark, icon: colors.primary };
  }
}
