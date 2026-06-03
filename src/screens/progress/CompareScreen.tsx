import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompareDeltaRow } from '@/components/progress/CompareDeltaRow';
import { CompareScanPanel } from '@/components/progress/CompareScanPanel';
import { MetricScoreRing } from '@/components/products/MetricScoreRing';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useTranslation } from '@/i18n/useTranslation';
import {
  COMPARE_DELTAS,
  COMPARE_SCAN_OPTIONS,
  DEFAULT_COMPARE_AFTER_ID,
  DEFAULT_COMPARE_BEFORE_ID,
} from '@/screens/progress/compareMockData';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

export function CompareScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [beforeId, setBeforeId] = useState(DEFAULT_COMPARE_BEFORE_ID);
  const [afterId, setAfterId] = useState(DEFAULT_COMPARE_AFTER_ID);

  const before = useMemo(
    () => COMPARE_SCAN_OPTIONS.find((s) => s.id === beforeId) ?? COMPARE_SCAN_OPTIONS[0],
    [beforeId],
  );
  const after = useMemo(
    () =>
      COMPARE_SCAN_OPTIONS.find((s) => s.id === afterId) ??
      COMPARE_SCAN_OPTIONS[COMPARE_SCAN_OPTIONS.length - 1],
    [afterId],
  );

  const pickScan = (side: 'before' | 'after') => {
    Alert.alert(
      side === 'before' ? t('compare.selectInitial') : t('compare.selectCurrent'),
      undefined,
      [
        ...COMPARE_SCAN_OPTIONS.map((opt) => ({
          text: `${opt.dateLabel} (${opt.score})`,
          onPress: () => {
            if (side === 'before') setBeforeId(opt.id);
            else setAfterId(opt.id);
          },
        })),
        { text: t('common.cancel'), style: 'cancel' },
      ],
    );
  };

  const scoreDelta = after.score - before.score;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader
        topInset={insets.top}
        title={t('compare.title')}
        right={
          <Pressable
            style={styles.bellBtn}
            onPress={() => Alert.alert(t('common.notifications'), t('common.notificationsSoon'))}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.primary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.panels}>
          <CompareScanPanel
            scan={{ ...before, badge: t('compare.initial') }}
            variant="initial"
            onPickDate={() => pickScan('before')}
          />
          <CompareScanPanel
            scan={{ ...after, badge: t('compare.current') }}
            variant="current"
            onPickDate={() => pickScan('after')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('compare.healthScoreComparison')}</Text>
          <View style={styles.scoreCard}>
            <View style={styles.scoreCol}>
              <MetricScoreRing
                score={before.score}
                size={80}
                progressColor={colors.primaryPale}
                textColor={colors.textSecondary}
              />
              <Text style={styles.scoreLabel}>{t('compare.initial')}</Text>
            </View>
            <MaterialCommunityIcons name="trending-up" size={32} color={colors.primaryPale} />
            <View style={styles.scoreCol}>
              <MetricScoreRing score={after.score} size={96} />
              <Text style={[styles.scoreLabel, styles.scoreLabelActive]}>{t('compare.latest')}</Text>
            </View>
          </View>
          {scoreDelta !== 0 ? (
            <Text style={styles.scoreDelta}>
              {t('compare.pointsSinceInitial', { delta: `${scoreDelta > 0 ? '+' : ''}${scoreDelta}` })}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('compare.metricBreakdown')}</Text>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={[styles.headCell, styles.headConcern]}>{t('compare.concern')}</Text>
              <Text style={styles.headCell}>{t('compare.initial')}</Text>
              <Text style={styles.headCell}>{t('compare.current')}</Text>
              <Text style={[styles.headCell, styles.headRight]}>{t('compare.change')}</Text>
            </View>
            {COMPARE_DELTAS.map((row, i) => (
              <CompareDeltaRow
                key={row.id}
                row={row}
                isLast={i === COMPARE_DELTAS.length - 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.shareWrap, { bottom: insets.bottom + 88 }]}>
        <Pressable
          style={styles.shareBtn}
          onPress={() => Alert.alert(t('compare.shareProgress'), t('common.shareSoon'))}
        >
          <MaterialCommunityIcons name="share-variant" size={22} color={colors.white} />
          <Text style={styles.shareLabel}>{t('compare.shareProgress')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bellBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingTop: spacing.lg,
  },
  panels: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  scoreCol: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    fontSize: 11,
  },
  scoreLabelActive: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  scoreDelta: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
  },
  table: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
    ...shadows.sm,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#F1F3FF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  headCell: {
    flex: 1,
    ...typography.label,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'none',
    opacity: 0.85,
  },
  headConcern: {
    textAlign: 'left',
    flex: 1.2,
  },
  headRight: {
    textAlign: 'right',
  },
  shareWrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: touchTarget,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  shareLabel: {
    ...typography.bodyLg,
    fontFamily: typography.h3.fontFamily,
    color: colors.white,
  },
});
