import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { GradientSurface } from '@/components/ui/GradientButton';
import type { ChatMessage } from '@/screens/learn/chatMockData';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  message: ChatMessage;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userBubble: {
    maxWidth: '85%',
    borderTopRightRadius: radius.lg,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
    ...shadows.sm,
  },
  userBubbleInner: {
    padding: spacing.lg,
  },
  userText: {
    ...typography.body,
    color: colors.textInverse,
    lineHeight: 22,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    maxWidth: '100%',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  aiBubble: {
    flex: 1,
    maxWidth: '85%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderTopLeftRadius: 4,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  aiText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  insightLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.ctaGradientEnd,
    letterSpacing: 1.2,
  },
});
}

export function ChatMessageBubble({
 message }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <LinearGradient
            colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
            locations={[0, 0.48, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <View style={styles.userBubbleInner}>
              <Text style={styles.userText}>{message.text}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiRow}>
      <GradientSurface style={styles.aiAvatar} borderRadius={radius.full}>
        <MaterialCommunityIcons name="leaf" size={16} color={colors.white} />
      </GradientSurface>
      <View style={styles.aiBubble}>
        <Text style={styles.aiText}>{message.text}</Text>
        {message.showInsight ? (
          <View style={styles.insight}>
            <MaterialCommunityIcons name="flask-outline" size={14} color={colors.ctaGradientStart} />
            <Text style={styles.insightLabel}>Botanical Precision Insight</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
