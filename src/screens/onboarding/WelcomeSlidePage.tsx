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
import type { AppColors } from '@/theme/palettes';
import { fontFamilies, radius, spacing, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  item: WelcomeSlide;
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
  slideHeight: number;
  heroWidth: number;
  heroHeight: number;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    slide: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.base,
    },
    heroBlock: {
      maxWidth: '100%',
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
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadowColor,
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
      color: colors.textSecondary,
    },
  });
}

/** Image-only slide — title/subtitle render outside the carousel on WelcomeScreen */
export function WelcomeSlidePage({
  item,
  index,
  scrollX,
  slideWidth,
  slideHeight,
  heroWidth,
  heroHeight,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const animatedHero = useAnimatedStyle(() => {
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
      <Animated.View style={[styles.heroBlock, { width: heroWidth }, animatedHero]}>
        <View
          style={[
            styles.imageFrame,
            { width: heroWidth, height: heroHeight },
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
                color={colors.primaryLight}
              />
              <Text style={styles.aiBadgeText}>{t('onboarding.aiBadge')}</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
}
