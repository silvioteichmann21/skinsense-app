import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaceScanGuide } from '@/components/scan/FaceScanGuide';
import { GradientButton } from '@/components/ui/GradientButton';
import { getPosePhase } from '@/components/scan/facePoseScan';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import type { RootStackParamList } from '@/core/navigation/types';
import { useSkinAnalysis } from '@/hooks/useSkinAnalysis';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  ANALYZING_PLACEHOLDER_IMAGE,
  ANALYZING_STAGES,
} from '@/screens/scan/analyzingContent';
import { scanErrorHintKey, scanErrorTitleKey } from '@/screens/scan/scanAnalysisErrors';
import type { AppColors } from '@/theme/palettes';
import {
  fontFamilies,
  radius,
  spacing,
  touchTarget,
  typography,
  useAnalyzingFrameSize,
  useThemedStyles,
  useAppTheme,
} from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Analyzing'>;
type Route = RouteProp<RootStackParamList, 'Analyzing'>;

const STAGE_KEYS: TranslationKey[] = [
  'scan.stageDetecting',
  'scan.stageType',
  'scan.stageConcerns',
  'scan.stageProfile',
  'scan.stageReady',
];

const FACT_KEYS: TranslationKey[] = [
  'scan.factTurnover',
  'scan.factSpf',
  'scan.factHydration',
  'scan.factSleep',
  'scan.factConsistency',
];

function stageForProgress(progress: number, t: ReturnType<typeof useTranslation>['t']): string {
  const stageIndex = ANALYZING_STAGES.findIndex(
    (s) => progress >= s.min && (progress < s.max || s.max === 100),
  );
  const index = stageIndex >= 0 ? stageIndex : ANALYZING_STAGES.length - 1;
  return t(STAGE_KEYS[index] ?? 'scan.stageReady');
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    minHeight: touchTarget,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.onPrimaryContainer,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  scanFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanPhoto: {
    position: 'absolute',
    opacity: 0.55,
  },
  progressBlock: {
    marginTop: spacing.xxl,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stageLabel: {
    ...typography.label,
    color: colors.onPrimaryContainer,
    flex: 1,
    paddingRight: spacing.sm,
    letterSpacing: 1.4,
  },
  percentLabel: {
    fontFamily: fontFamilies.mono,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ctaGradientMid,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  factWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
  },
  factCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    maxWidth: 360,
    alignSelf: 'center',
  },
  factCardInner: {
    padding: spacing.xl,
    backgroundColor: colors.glassFill,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  factBadge: {
    fontFamily: fontFamilies.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.primaryLight,
  },
  factText: {
    ...typography.bodyLg,
    color: colors.onPrimaryContainer,
    textAlign: 'center',
    lineHeight: 26,
  },
  errorBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.textInverse,
    textAlign: 'center',
  },
  errorHint: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryBtn: {
    minWidth: 200,
  },
  retryLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
  retakeBtn: {
    paddingVertical: spacing.sm,
  },
  retakeLabel: {
    ...typography.body,
    color: colors.primaryPale,
  },
});
}

export function AnalyzingScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const frame = useAnalyzingFrameSize();

  const imageUri = route.params?.imageUri ?? ANALYZING_PLACEHOLDER_IMAGE;
  const { progress, error, result, retry } = useSkinAnalysis(imageUri);

  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (result) {
      navigation.replace('SkinReport', { result });
    }
  }, [result, navigation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % FACT_KEYS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stageLabel = useMemo(() => {
    if (progress < 100) {
      return t(getPosePhase(progress).labelKey);
    }
    return stageForProgress(progress, t);
  }, [progress, t]);

  if (error) {
    return (
      <View style={styles.root}>
        <StatusBar style={statusBarStyle} />
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <ScreenBackButton variant="inverse" style={styles.closeBtn} />
          <Text style={styles.headerTitle}>{t('scan.analyzing')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.errorBody, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.primaryPale} />
          <Text style={styles.errorTitle}>{t(scanErrorTitleKey(error))}</Text>
          <Text style={styles.errorHint}>{t(scanErrorHintKey(error))}</Text>
          <GradientButton onPress={retry} style={styles.retryBtn}>
            <Text style={styles.retryLabel}>{t('scan.retryAnalysis')}</Text>
          </GradientButton>
          <Pressable
            style={styles.retakeBtn}
            onPress={() => navigation.replace('Camera')}
          >
            <Text style={styles.retakeLabel}>{t('scan.retakePhoto')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <View style={StyleSheet.absoluteFill}>
        <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.dimOverlay} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ScreenBackButton variant="inverse" style={styles.closeBtn} />
        <Text style={styles.headerTitle}>{t('scan.analyzing')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.scanFrame}>
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.scanPhoto,
              {
                width: frame.width,
                height: frame.height,
                borderRadius: frame.height / 2,
              },
            ]}
            contentFit="cover"
          />
          <FaceScanGuide
            progress={progress}
            width={frame.width}
            height={frame.height}
            showAiTag={false}
          />
        </View>

        <View style={[styles.progressBlock, { width: frame.progressWidth }]}>
          <View style={styles.progressRow}>
            <Text style={styles.stageLabel}>{stageLabel}</Text>
            <Text style={styles.percentLabel}>{t('common.percent', { percent: Math.floor(progress) })}</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
              locations={[0, 0.48, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>
      </View>

      <View style={[styles.factWrap, { paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg }]}>
        <View style={styles.factCard}>
          <BlurView intensity={56} tint="dark" style={styles.factCardInner}>
            <View style={styles.factHeader}>
              <MaterialCommunityIcons name="lightbulb-outline" size={18} color={colors.ctaGradientMid} />
              <Text style={styles.factBadge}>{t('scan.skinInsight')}</Text>
            </View>
            <Text style={styles.factText}>{t(FACT_KEYS[factIndex])}</Text>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

