import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { radius, spacing, touchTarget, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  visible: boolean;
  title: string;
  hasScans: boolean;
  useScanLabel: string;
  chooseLabel: string;
  cancelLabel: string;
  onUseScan: () => void;
  onChooseLibrary: () => void;
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
    handle: {
      alignSelf: 'center',
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h3,
      color: colors.textPrimary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    option: {
      height: touchTarget,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    optionPrimary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    optionLabel: {
      ...typography.bodyLg,
      color: colors.textPrimary,
      fontFamily: typography.h3.fontFamily,
    },
    optionLabelPrimary: {
      color: colors.textInverse,
    },
    cancel: {
      alignItems: 'center',
      paddingVertical: spacing.md,
      marginTop: spacing.xs,
    },
    cancelLabel: {
      ...typography.body,
      color: colors.textTertiary,
    },
  });
}

export function ProfilePhotoSheet({
  visible,
  title,
  hasScans,
  useScanLabel,
  chooseLabel,
  cancelLabel,
  onUseScan,
  onChooseLibrary,
  onClose,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          {hasScans ? (
            <Pressable
              onPress={() => {
                onClose();
                onUseScan();
              }}
              style={[styles.option, styles.optionPrimary]}
            >
              <MaterialCommunityIcons name="face-recognition" size={20} color={colors.textInverse} />
              <Text style={[styles.optionLabel, styles.optionLabelPrimary]}>{useScanLabel}</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => {
              onClose();
              onChooseLibrary();
            }}
            style={styles.option}
          >
            <MaterialCommunityIcons name="image-multiple" size={20} color={colors.primary} />
            <Text style={styles.optionLabel}>{chooseLabel}</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelLabel}>{cancelLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
