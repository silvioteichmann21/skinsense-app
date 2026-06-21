import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Sparkline } from '@/components/progress/Sparkline';
import type { ConcernTrend } from '@/screens/progress/progressMockData';
import type { AppColors } from '@/theme/palettes';
import { flatCard, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  concern: ConcernTrend;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  row: {
    ...flatCard(colors),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.bodyLg,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  status: {
    ...typography.body,
    color: colors.textSecondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  change: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    minWidth: 40,
    textAlign: 'right',
  },
  changeUp: {
    color: colors.primary,
  },
  changeDown: {
    color: colors.accent,
  },
});
}

export function ConcernTrendRow({
 concern }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: concern.iconBg }]}>
          <MaterialCommunityIcons name={concern.icon} size={22} color={concern.iconColor} />
        </View>
        <View>
          <Text style={styles.name}>{concern.name}</Text>
          <Text style={styles.status}>{concern.status}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Sparkline values={concern.sparkline} stroke={concern.sparkStroke ?? colors.primary} />
        <Text
          style={[
            styles.change,
            concern.changePositive ? styles.changeUp : styles.changeDown,
          ]}
        >
          {concern.change}
        </Text>
      </View>
    </View>
  );
}
