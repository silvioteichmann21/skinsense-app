import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FITZPATRICK_TONES } from '@/screens/profile/skinProfileMockData';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  activeType: number;
  label: string;
  description: string;
};

export function FitzpatrickScale({ activeType, label, description }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.scale}>
        {FITZPATRICK_TONES.map((tone) => {
          const active = tone.type === activeType;
          return (
            <View key={tone.type} style={styles.toneCol}>
              {active ? (
                <MaterialCommunityIcons
                  name="menu-down"
                  size={18}
                  color={colors.primary}
                  style={styles.arrow}
                />
              ) : (
                <View style={styles.arrowSpacer} />
              )}
              <View
                style={[
                  styles.tone,
                  { backgroundColor: tone.color, height: active ? 48 : 32 },
                  active && styles.toneActive,
                ]}
              >
                <Text style={[styles.toneNum, { color: tone.labelColor }]}>{tone.type}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.meta}>
        <View style={styles.metaText}>
          <Text style={styles.typeLabel}>{label}</Text>
          <Text style={styles.typeDesc}>{description}</Text>
        </View>
        <MaterialCommunityIcons name="information-outline" size={22} color={colors.textSecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
  scale: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    minHeight: 72,
  },
  toneCol: {
    flex: 1,
    alignItems: 'center',
  },
  arrow: {
    marginBottom: 2,
  },
  arrowSpacer: {
    height: 20,
  },
  tone: {
    width: '100%',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toneActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  toneNum: {
    fontSize: 10,
    fontFamily: typography.h3.fontFamily,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  metaText: {
    flex: 1,
    gap: spacing.xs,
  },
  typeLabel: {
    ...typography.h3,
    color: colors.primary,
  },
  typeDesc: {
    ...typography.body,
    color: colors.textSecondary,
    maxWidth: 240,
  },
});
