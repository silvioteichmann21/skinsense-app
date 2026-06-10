import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientButton } from '@/components/ui/GradientButton';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, touchTarget, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  visible: boolean;
  title: string;
  body: string;
  icon?: 'image-multiple' | 'camera-outline';
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  cancelLabel: string;
  onClose: () => void;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.scrim,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.surfaceElevated,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: colors.hairline,
      padding: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: radius.lg,
      overflow: 'hidden',
      marginBottom: spacing.lg,
    },
    iconInner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.ctaTint,
    },
    title: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    body: {
      ...typography.body,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      lineHeight: 22,
    },
    primary: {
      marginBottom: spacing.md,
    },
    primaryLabel: {
      ...typography.h3,
      color: colors.textInverse,
    },
    secondary: {
      height: touchTarget,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    secondaryLabel: {
      ...typography.bodyLg,
      color: colors.textPrimary,
      fontFamily: typography.h3.fontFamily,
    },
    cancel: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    cancelLabel: {
      ...typography.body,
      color: colors.textTertiary,
    },
  });
}

export function PermissionSheet({
  visible,
  title,
  body,
  icon = 'camera-outline',
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  cancelLabel,
  onClose,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.iconWrap, styles.iconInner]}>
            <MaterialCommunityIcons name={icon} size={26} color={colors.ctaGradientStart} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <GradientButton onPress={onPrimary} style={styles.primary}>
            <Text style={styles.primaryLabel}>{primaryLabel}</Text>
          </GradientButton>
          {secondaryLabel && onSecondary ? (
            <Pressable onPress={onSecondary} style={styles.secondary}>
              <Text style={styles.secondaryLabel}>{secondaryLabel}</Text>
            </Pressable>
          ) : null}
          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelLabel}>{cancelLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
