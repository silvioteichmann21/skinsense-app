import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { setOnboardingComplete } from '@/core/storage/onboardingPreferences';
import type { RootStackParamList } from '@/core/navigation/types';
import { useLocalizedPersonalizedRoutine } from '@/i18n/content/useLocalizedRoutine';
import { useTranslation } from '@/i18n/useTranslation';
import type { RoutineStep } from '@/types/routine';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RoutineReveal'>;
type Route = RouteProp<RootStackParamList, 'RoutineReveal'>;
type RoutineTab = 'morning' | 'evening';

function ConfettiPiece({
  leftPercent,
  color,
  size,
  delay,
  duration,
  round,
  styles,
}: {
  leftPercent: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  round: boolean;
  styles: { confettiPiece: object };
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        1,
        false,
      ),
    );
  }, [delay, duration, progress]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: progress.value * 160 },
      { rotate: `${progress.value * 360}deg` },
    ],
    opacity: 1 - progress.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          left: `${leftPercent}%`,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: round ? size / 2 : 2,
        },
        style,
      ]}
    />
  );
}

function CelebrationConfetti() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const [tick, setTick] = useState(0);

  const confettiPieces = useMemo(() => {
    const palette = [
      colors.primary,
      colors.primaryLight,
      colors.primaryPale,
      colors.accent,
      '#92F7C3',
    ];
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      leftPercent: 8 + ((i * 2.5) % 84),
      color: palette[i % palette.length],
      size: 4 + (i % 3) * 2,
      delay: (i % 8) * 40,
      duration: 1500 + (i % 5) * 200,
    }));
  }, [colors]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.confettiLayer} pointerEvents="none">
      {confettiPieces.map((p) => (
        <ConfettiPiece
          key={`${p.id}-${tick}`}
          leftPercent={p.leftPercent}
          color={p.color}
          size={p.size}
          delay={p.delay}
          duration={p.duration}
          round={p.id % 2 === 0}
          styles={styles}
        />
      ))}
    </View>
  );
}

function RoutineStepRow({ step }: { step: RoutineStep }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={styles.stepCard}>
      <View style={styles.stepIcon}>
        <MaterialCommunityIcons name={step.icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.stepText}>
        <Text style={styles.stepName}>{step.name}</Text>
        <Text style={styles.stepCategory}>{step.category}</Text>
      </View>
      <Text style={styles.stepDuration}>{step.duration}</Text>
    </View>
  );
}

function RoutineTabs({
  active,
  onChange,
}: {
  active: RoutineTab;
  onChange: (tab: RoutineTab) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.tabs}>
      <Pressable
        onPress={() => onChange('morning')}
        style={[styles.tab, active === 'morning' && styles.tabActive]}
      >
        <Text style={[styles.tabLabel, active === 'morning' && styles.tabLabelActive]}>
          {t('routine.morning')}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('evening')}
        style={[styles.tab, active === 'evening' && styles.tabActive]}
      >
        <Text style={[styles.tabLabel, active === 'evening' && styles.tabLabelActive]}>
          {t('routine.evening')}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    backgroundColor: colors.background,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    backgroundColor: colors.primaryPale,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  celebration: {
    height: 160,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  confettiPiece: {
    position: 'absolute',
    top: -12,
  },
  blobTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryPale,
    opacity: 0.2,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#FFDCC4',
    opacity: 0.2,
  },
  celebrationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadows.sm,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabLabel: {
    ...typography.label,
    color: colors.textTertiary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  tabLabelActive: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  stepList: {
    gap: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  stepText: {
    flex: 1,
  },
  stepName: {
    fontFamily: typography.h3.fontFamily,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  stepCategory: {
    ...typography.label,
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 2,
  },
  stepDuration: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderMuted,
  },
  cta: {
    width: '100%',
    marginBottom: spacing.md,
  },
  ctaLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
  editNote: {
    ...typography.body,
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
}

export function RoutineRevealScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [tab, setTab] = useState<RoutineTab>('morning');

  const routine = useLocalizedPersonalizedRoutine(route.params.result);

  const steps = tab === 'morning' ? routine.morning : routine.evening;
  const footerBottom = Math.max(insets.bottom, spacing.base);

  const handleStart = async () => {
    await setOnboardingComplete(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <ScreenHeader
        topInset={insets.top}
        title={t('common.brand')}
        style={styles.headerBar}
        right={
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: route.params.result.imageUri }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: touchTarget + footerBottom + spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.celebration}>
          <CelebrationConfetti />
          <View style={styles.blobTop} />
          <View style={styles.blobBottom} />
          <View style={styles.celebrationIcon}>
            <MaterialCommunityIcons name="auto-fix" size={40} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>{t('routine.revealTitle')}</Text>
        <Text style={styles.subtitle}>{routine.subtitle}</Text>

        <RoutineTabs active={tab} onChange={setTab} />

        <View style={styles.stepList}>
          {steps.map((step) => (
            <RoutineStepRow key={step.id} step={step} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerBottom }]}>
        <GradientButton onPress={handleStart} style={styles.cta}>
          <Text style={styles.ctaLabel}>{t('routine.startMyRoutine')}</Text>
        </GradientButton>
        <Text style={styles.editNote}>{t('routine.editAnytime')}</Text>
      </View>
    </View>
  );
}
