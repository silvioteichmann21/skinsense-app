import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { BentoOption, GridOption, ListOption } from '@/screens/onboarding/quiz/quizSteps';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

const GRID_GAP = spacing.md;
const GRID_H_PAD = spacing.base;
const GRID_CARD_MIN_HEIGHT = 132;

type GridProps = {
  options: GridOption[];
  selected: string[];
  maxSelect: number;
  onToggle: (id: string) => void;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: GRID_GAP,
    rowGap: GRID_GAP,
  },
  gridCardBase: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    padding: spacing.xl,
  },
  gridCardColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: GRID_CARD_MIN_HEIGHT,
  },
  gridCardRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
  },
  gridRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardSelected: {
    backgroundColor: colors.ctaTint,
    borderWidth: 2,
    borderColor: colors.ctaGradientStart,
  },
  gridCardDisabled: {
    opacity: 0.55,
  },
  gridCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  gridIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.periodTrack,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  gridIconWrapInline: {
    marginBottom: 0,
    marginRight: spacing.base,
  },
  gridIconWrapSelected: {
    backgroundColor: colors.ctaTint,
  },
  gridLabel: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  gridLabelInline: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'left',
  },
  gridLabelSelected: {
    color: colors.ctaGradientEnd,
  },
  list: {
    gap: spacing.base,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
  },
  listCardSelected: {
    backgroundColor: colors.ctaTint,
    borderWidth: 2,
    borderColor: colors.ctaGradientStart,
  },
  listCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  listIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primaryPale}33`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  listIconWrapSelected: {
    backgroundColor: colors.ctaGradientMid,
  },
  listText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  listTextWithIcon: {
    paddingRight: spacing.md,
  },
  listTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  listTitleSelected: {
    color: colors.ctaGradientEnd,
  },
  listDesc: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listDescSelected: {
    color: colors.ctaGradientEnd,
    opacity: 0.85,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BFC9C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.ctaGradientStart,
    backgroundColor: colors.ctaGradientMid,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textInverse,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  bentoCard: {
    width: '47%',
    height: 144,
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    justifyContent: 'flex-end',
  },
  bentoCardSelected: {
    backgroundColor: colors.ctaTint,
    borderWidth: 2,
    borderColor: colors.ctaGradientStart,
  },
  bentoCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ctaGradientMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoIcon: {
    position: 'absolute',
    top: spacing.base,
    left: spacing.base,
  },
  bentoLabel: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  bentoLabelSelected: {
    color: colors.onPrimaryPale,
  },
  helpCard: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.xxl,
    padding: spacing.base,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    fontFamily: typography.h3.fontFamily,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  helpBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
}

export function ConcernGrid({ options, selected, maxSelect, onToggle }: GridProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { width: screenWidth } = useWindowDimensions();
  const columnWidth = (screenWidth - GRID_H_PAD * 2 - GRID_GAP) / 2;

  return (
    <View style={styles.grid}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.id);
        const atMax = selected.length >= maxSelect && !isSelected;

        return (
          <Pressable
            key={opt.id}
            onPress={() => !atMax && onToggle(opt.id)}
            disabled={atMax}
            style={[
              styles.gridCardBase,
              isSelected && styles.gridCardSelected,
              atMax && styles.gridCardDisabled,
              opt.fullWidth
                ? styles.gridCardRow
                : [styles.gridCardColumn, { width: columnWidth }],
            ]}
          >
            {isSelected && (
              <View style={styles.gridCheck}>
                <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
              </View>
            )}
            {opt.fullWidth ? (
              <View style={styles.gridRowContent}>
                <View
                  style={[
                    styles.gridIconWrap,
                    styles.gridIconWrapInline,
                    isSelected && styles.gridIconWrapSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={opt.icon}
                    size={24}
                    color={isSelected ? colors.onPrimaryPale : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.gridLabelInline,
                    isSelected && styles.gridLabelSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </View>
            ) : (
              <>
                <View
                  style={[styles.gridIconWrap, isSelected && styles.gridIconWrapSelected]}
                >
                  <MaterialCommunityIcons
                    name={opt.icon}
                    size={24}
                    color={isSelected ? colors.onPrimaryPale : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.gridLabel,
                    isSelected && styles.gridLabelSelected,
                  ]}
                >
                  {opt.label}
                </Text>
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

type ListProps = {
  options: ListOption[];
  selected: string | null;
  onSelect: (id: string) => void;
  showIcon?: boolean;
};

export function QuizListOptions({ options, selected, onSelect, showIcon }: ListProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={styles.list}>
      {options.map((opt) => {
        const isSelected = selected === opt.id;

        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            style={[styles.listCard, isSelected && styles.listCardSelected]}
          >
            {isSelected && (
              <View style={styles.listCheckBadge}>
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
              </View>
            )}
            {showIcon && opt.icon ? (
              <View style={[styles.listIconWrap, isSelected && styles.listIconWrapSelected]}>
                <MaterialCommunityIcons
                  name={opt.icon}
                  size={24}
                  color={isSelected ? colors.textInverse : colors.primary}
                />
              </View>
            ) : null}
            <View style={[styles.listText, showIcon && styles.listTextWithIcon]}>
              <Text style={[styles.listTitle, isSelected && styles.listTitleSelected]}>
                {opt.label}
              </Text>
              {opt.description ? (
                <Text style={[styles.listDesc, isSelected && styles.listDescSelected]}>
                  {opt.description}
                </Text>
              ) : null}
            </View>
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected ? <View style={styles.radioDot} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

type BentoProps = {
  options: BentoOption[];
  selected: string[];
  maxSelect: number;
  onToggle: (id: string) => void;
};

export function GoalBentoGrid({ options, selected, maxSelect, onToggle }: BentoProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={styles.bentoGrid}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.id);
        const atMax = selected.length >= maxSelect && !isSelected;

        return (
          <Pressable
            key={opt.id}
            onPress={() => !atMax && onToggle(opt.id)}
            disabled={atMax}
            style={[
              styles.bentoCard,
              isSelected && styles.bentoCardSelected,
              atMax && styles.gridCardDisabled,
            ]}
          >
            {isSelected && (
              <View style={styles.bentoCheck}>
                <MaterialCommunityIcons name="check" size={14} color={colors.textInverse} />
              </View>
            )}
            <MaterialCommunityIcons
              name={opt.icon}
              size={28}
              color={colors.primaryContainer}
              style={styles.bentoIcon}
            />
            <Text style={[styles.bentoLabel, isSelected && styles.bentoLabelSelected]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function QuizHelpCard() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.helpCard}>
      <MaterialCommunityIcons name="information-outline" size={22} color={colors.primary} />
      <View style={styles.helpText}>
        <Text style={styles.helpTitle}>{t('onboarding.helpTitle')}</Text>
        <Text style={styles.helpBody}>{t('onboarding.helpBody')}</Text>
      </View>
    </View>
  );
}
