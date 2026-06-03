import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { WelcomeSlide } from '@/screens/onboarding/welcomeSlides';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, fontFamilies, radius, spacing, typography } from '@/theme';

/** Keeps title + subtitle area the same height on every slide */
const COPY_BLOCK_HEIGHT = 108;

type Props = {
  item: WelcomeSlide;
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
  slideHeight: number;
  imageSize: number;
};

export function WelcomeSlidePage({
  item,
  index,
  scrollX,
  slideWidth,
  slideHeight,
  imageSize,
}: Props) {
  const { t } = useTranslation();
  const animatedContent = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * slideWidth,
      index * slideWidth,
      (index + 1) * slideWidth,
    ];

    const opacity = interpolate(scrollX.value, inputRange, [0.35, 1, 0.35], Extrapolation.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.96, 1, 0.96], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const frameSolid = item.frameStyle === 'solid';

  return (
    <View style={[styles.slide, { width: slideWidth, height: slideHeight }]}>
      <Animated.View style={[styles.content, animatedContent]}>
        <View style={[styles.heroBlock, { width: imageSize }]}>
          <View
            style={[
              styles.imageFrame,
              { width: imageSize, height: imageSize },
              frameSolid ? styles.imageFrameSolid : styles.imageFrameGlass,
            ]}
          >
            <Image
              source={item.image}
              style={styles.image}
              contentFit={item.imageFit}
              contentPosition="center"
              transition={280}
            />
            {item.showAiBadge ? (
              <View style={styles.aiBadge}>
                <MaterialCommunityIcons
                  name="face-recognition"
                  size={14}
                  color={colors.primaryPale}
                />
                <Text style={styles.aiBadgeText}>{t('onboarding.aiBadge')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.copy}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  heroBlock: {
    marginBottom: spacing.xxl,
  },
  imageFrame: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  imageFrameGlass: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassFill,
  },
  imageFrameSolid: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  aiBadge: {
    position: 'absolute',
    top: spacing.base,
    left: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  aiBadgeText: {
    fontFamily: fontFamilies.mono,
    fontSize: 11,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.85)',
  },
  copy: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: COPY_BLOCK_HEIGHT,
    maxWidth: 280,
    gap: spacing.md,
  },
  slideTitle: {
    ...typography.h1,
    color: colors.textInverse,
    textAlign: 'center',
  },
  slideSubtitle: {
    ...typography.bodyLg,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontFamily: fontFamilies.body,
  },
});
