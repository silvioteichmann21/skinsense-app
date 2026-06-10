import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { CompareShareCard } from '@/components/progress/CompareShareCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { SkinScoreRing } from '@/components/report/SkinScoreRing';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCompareScans } from '@/hooks/useCompareScans';
import { shareCompareProgress } from '@/utils/shareCompareProgress';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
    backgroundColor: colors.surfaceMuted,
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
    width: '100%',
  },
  shareBtnContent: {
    gap: spacing.sm,
  },
  shareCapture: {
    position: 'absolute',
    left: -2000,
    top: 0,
    opacity: 1,
  },
  shareLabel: {
    ...typography.bodyLg,
    fontFamily: typography.h3.fontFamily,
    color: colors.white,
  },
  emptyState: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'Compare'>;

export function CompareScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();

  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [beforeId, setBeforeId] = useState('');
  const [afterId, setAfterId] = useState('');
  const [sharing, setSharing] = useState(false);
  const shareCardRef = useRef<View>(null);

  const compare = useCompareScans(beforeId, afterId);

  useEffect(() => {
    if (!beforeId && compare.defaultBeforeId) setBeforeId(compare.defaultBeforeId);
    if (!afterId && compare.defaultAfterId) setAfterId(compare.defaultAfterId);
  }, [compare.defaultBeforeId, compare.defaultAfterId, beforeId, afterId]);

  const before = compare.before;
  const after = compare.after;

  const pickScan = (side: 'before' | 'after') => {
    Alert.alert(
      side === 'before' ? t('compare.selectInitial') : t('compare.selectCurrent'),
      undefined,
      [
        ...compare.options.map((opt) => ({
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

  const scoreDelta = before && after ? after.score - before.score : 0;
  const canShare = compare.hasEnoughScans && before != null && after != null;

  const shareCardData = useMemo(() => {
    if (!before || !after) return null;
    return {
      brand: t('common.brand'),
      title: t('compare.title'),
      initialLabel: t('compare.initial'),
      currentLabel: t('compare.current'),
      beforeDate: before.dateLabel,
      afterDate: after.dateLabel,
      beforeScore: before.score,
      afterScore: after.score,
      scoreDelta,
      pointsSinceInitial: t('compare.pointsSinceInitial', {
        delta: `${scoreDelta > 0 ? '+' : ''}${scoreDelta}`,
      }),
      metricTitle: t('compare.metricBreakdown'),
      concernLabel: t('compare.concern'),
      beforeColumn: t('compare.initial'),
      afterColumn: t('compare.current'),
      changeLabel: t('compare.change'),
      deltas: compare.deltas,
      footer: t('compare.shareFooter'),
    };
  }, [after, before, compare.deltas, scoreDelta, t]);

  const textSummary = useMemo(() => {
    if (!before || !after) return '';
    const lines = [
      `${t('common.brand')} — ${t('compare.title')}`,
      '',
      `${t('compare.initial')}: ${before.dateLabel} — ${before.score}/100`,
      `${t('compare.current')}: ${after.dateLabel} — ${after.score}/100`,
    ];
    if (scoreDelta !== 0) {
      lines.push(
        t('compare.pointsSinceInitial', {
          delta: `${scoreDelta > 0 ? '+' : ''}${scoreDelta}`,
        }),
      );
    }
    if (compare.deltas.length) {
      lines.push('', t('compare.metricBreakdown'));
      for (const row of compare.deltas) {
        lines.push(`${row.concern}: ${row.before} → ${row.after} (${row.change})`);
      }
    }
    lines.push('', t('compare.shareFooter'));
    return lines.join('\n');
  }, [after, before, compare.deltas, scoreDelta, t]);

  const handleShare = async () => {
    if (!canShare || sharing) return;
    setSharing(true);
    const result = await shareCompareProgress({
      cardRef: shareCardRef,
      textSummary,
      dialogTitle: t('compare.shareProgress'),
    });
    setSharing(false);
    if (!result.ok) {
      Alert.alert(t('compare.shareProgress'), t('compare.shareFailed'));
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader
        topInset={insets.top}
        title={t('compare.title')}
        right={
          <Pressable
            style={styles.bellBtn}
            onPress={() => navigation.navigate('Notifications')}
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
        {!compare.hasEnoughScans || !before || !after ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('compare.needMoreScans')}</Text>
          </View>
        ) : (
          <>
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
                  <SkinScoreRing score={before.score} size={80} />
                  <Text style={styles.scoreLabel}>{t('compare.initial')}</Text>
                </View>
                <MaterialCommunityIcons name="trending-up" size={32} color={colors.primaryPale} />
                <View style={styles.scoreCol}>
                  <SkinScoreRing score={after.score} size={96} />
                  <Text style={[styles.scoreLabel, styles.scoreLabelActive]}>
                    {t('compare.latest')}
                  </Text>
                </View>
              </View>
              {scoreDelta !== 0 ? (
                <Text style={styles.scoreDelta}>
                  {t('compare.pointsSinceInitial', {
                    delta: `${scoreDelta > 0 ? '+' : ''}${scoreDelta}`,
                  })}
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
                {compare.deltas.map((row, i) => (
                  <CompareDeltaRow
                    key={row.id}
                    row={row}
                    isLast={i === compare.deltas.length - 1}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {shareCardData ? (
        <View style={styles.shareCapture} pointerEvents="none">
          <CompareShareCard ref={shareCardRef} data={shareCardData} />
        </View>
      ) : null}

      <View style={[styles.shareWrap, { bottom: insets.bottom + 88 }]}>
        <GradientButton
          style={styles.shareBtn}
          contentStyle={styles.shareBtnContent}
          disabled={!canShare || sharing}
          onPress={() => void handleShare()}
        >
          {sharing ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <MaterialCommunityIcons name="share-variant" size={22} color={colors.white} />
          )}
          <Text style={styles.shareLabel}>
            {sharing ? t('compare.sharePreparing') : t('compare.shareProgress')}
          </Text>
        </GradientButton>
      </View>
    </View>
  );
}
