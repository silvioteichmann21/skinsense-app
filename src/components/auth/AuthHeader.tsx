import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useThemedStyles } from '@/theme';

type Props = {
  title: string;
  subtitle: string;
  titleSize?: 'h1' | 'h2';
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      maxWidth: 400,
      width: '100%',
    },
    logo: {
      width: 48,
      height: 48,
      marginBottom: spacing.lg,
    },
    titleH1: {
      ...typography.h1,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    titleH2: {
      ...typography.h2,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });
}

export function AuthHeader({ title, subtitle, titleSize = 'h1' }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <Image
        source={require('../../../assets/icon-skinsense-v2.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={titleSize === 'h2' ? styles.titleH2 : styles.titleH1}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}
