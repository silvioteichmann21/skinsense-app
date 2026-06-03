import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { ChatMessage } from '@/screens/learn/chatMockData';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  message: ChatMessage;
};

export function ChatMessageBubble({ message }: Props) {
  if (message.role === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiRow}>
      <View style={styles.aiAvatar}>
        <MaterialCommunityIcons name="leaf" size={16} color={colors.white} />
      </View>
      <View style={styles.aiBubble}>
        <Text style={styles.aiText}>{message.text}</Text>
        {message.showInsight ? (
          <View style={styles.insight}>
            <MaterialCommunityIcons name="flask-outline" size={14} color={colors.primary} />
            <Text style={styles.insightLabel}>Botanical Precision Insight</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userBubble: {
    maxWidth: '85%',
    backgroundColor: colors.primaryPale,
    borderTopRightRadius: radius.lg,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: 4,
    padding: spacing.lg,
    ...shadows.sm,
  },
  userText: {
    ...typography.body,
    color: colors.primaryDark,
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
    backgroundColor: colors.primary,
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
    color: colors.primaryDark,
    letterSpacing: 1.2,
  },
});
