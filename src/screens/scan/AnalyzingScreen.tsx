import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { colors, radius, spacing, touchTarget, typography } from '@/theme';

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

export function AnalyzingScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { t } = useTranslation();

  const imageUri = route.params?.imageUri ?? ANALYZING_PLACEHOLDER_IMAGE;
  const { progress, error, result, retry } = useSkinAnalysis(imageUri);

  const [factIndex, setFactIndex] = useState(0);

  const frameWidth = Math.min(screenWidth - spacing.base * 2, 320);
  const frameHeight = frameWidth * 1.25;

  const scanY = useSharedValue(0);

  useEffect(() => {
    scanY.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [scanY]);

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

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${scanY.value * 100}%`,
  }));

  const stageLabel = useMemo(() => stageForProgress(progress, t), [progress, t]);

  if (error) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <ScreenBackButton variant="inverse" style={styles.closeBtn} />
          <Text style={styles.headerTitle}>{t('scan.analyzing')}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={[styles.errorBody, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.primaryPale} />
          <Text style={styles.errorTitle}>{t(scanErrorTitleKey(error))}</Text>
          <Text style={styles.errorHint}>{t(scanErrorHintKey(error))}</Text>
          <Pressable style={styles.retryBtn} onPress={retry}>
            <Text style={styles.retryLabel}>{t('scan.retryAnalysis')}</Text>
          </Pressable>
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
      <StatusBar style="light" />

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
        <View
          style={[
            styles.frame,
            {
              width: frameWidth,
              height: frameHeight,
            },
          ]}
        >
          <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <Animated.View style={[styles.scanLine, scanLineStyle]} />
          <CornerAccent style={styles.cornerTL} />
          <CornerAccent style={styles.cornerTR} />
          <CornerAccent style={styles.cornerBL} />
          <CornerAccent style={styles.cornerBR} />
        </View>

        <View style={[styles.progressBlock, { width: frameWidth }]}>
          <View style={styles.progressRow}>
            <Text style={styles.stageLabel}>{stageLabel}</Text>
            <Text style={styles.percentLabel}>{t('common.percent', { percent: Math.floor(progress) })}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <View style={[styles.factWrap, { paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg }]}>
        <View style={styles.factCard}>
          <View style={styles.factHeader}>
            <MaterialCommunityIcons name="lightbulb-outline" size={18} color={colors.primaryPale} />
            <Text style={styles.factBadge}>{t('scan.skinInsight')}</Text>
          </View>
          <Text style={styles.factText}>&ldquo;{t(FACT_KEYS[factIndex])}&rdquo;</Text>
        </View>
      </View>
    </View>
  );
}

function CornerAccent({ style }: { style: object }) {
  return <View style={[styles.corner, style]} />;
}

const styles = StyleSheet.create({
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
    color: colors.textInverse,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
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
  frame: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primaryPale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primaryLight,
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    zIndex: 2,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cornerTL: {
    top: spacing.base,
    left: spacing.base,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    top: spacing.base,
    right: spacing.base,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    bottom: spacing.base,
    left: spacing.base,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: spacing.base,
    right: spacing.base,
    borderBottomWidth: 2,
    borderRightWidth: 2,
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
    color: colors.textInverse,
    flex: 1,
    paddingRight: spacing.sm,
  },
  percentLabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    lineHeight: 20,
    color: colors.primaryPale,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryPale,
    borderRadius: 3,
  },
  factWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
  },
  factCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: spacing.xl,
    maxWidth: 360,
    alignSelf: 'center',
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  factBadge: {
    ...typography.label,
    color: colors.primaryPale,
  },
  factText: {
    ...typography.bodyLg,
    color: colors.textInverse,
    textAlign: 'center',
    fontStyle: 'italic',
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
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minWidth: 200,
    alignItems: 'center',
  },
  retryLabel: {
    ...typography.h3,
    color: colors.primaryDark,
  },
  retakeBtn: {
    paddingVertical: spacing.sm,
  },
  retakeLabel: {
    ...typography.body,
    color: colors.primaryPale,
  },
});
