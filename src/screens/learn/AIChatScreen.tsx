import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatDisclaimer } from '@/components/chat/ChatDisclaimer';
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble';
import { ChatTypingIndicator } from '@/components/chat/ChatTypingIndicator';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  INITIAL_CHAT_MESSAGES,
  type ChatMessage,
} from '@/screens/learn/chatMockData';
import { PROFILE_USER } from '@/screens/profile/profileMockData';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AIChat'>;

const PROMPT_KEYS: TranslationKey[] = [
  'chat.promptAcne',
  'chat.promptSpf',
  'chat.promptRoutine',
];

let messageId = 100;

function nextId() {
  messageId += 1;
  return `msg-${messageId}`;
}

function getLocalizedReply(
  userText: string,
  t: ReturnType<typeof useTranslation>['t'],
): Pick<ChatMessage, 'text' | 'showInsight'> {
  const lower = userText.toLowerCase();

  if (lower.includes('acne') || lower.includes('breakout')) {
    return { text: t('chat.replyAcne'), showInsight: true };
  }
  if (lower.includes('spf') || lower.includes('sun') || lower.includes('uv')) {
    return { text: t('chat.replySpf'), showInsight: true };
  }
  if (lower.includes('routine') || lower.includes('morning') || lower.includes('evening')) {
    return { text: t('chat.replyRoutine') };
  }
  return { text: t('chat.replyFallback') };
}

export function AIChatScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  const suggestedPrompts = useMemo(() => PROMPT_KEYS.map((key) => t(key)), [t]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      const userMsg: ChatMessage = { id: nextId(), role: 'user', text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setDraft('');
      setTyping(true);
      scrollToEnd();

      const reply = getLocalizedReply(trimmed, t);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            text: reply.text,
            showInsight: reply.showInsight,
          },
        ]);
        setTyping(false);
        scrollToEnd();
      }, 1200);
    },
    [typing, scrollToEnd, t],
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <ScreenBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{t('chat.title')}</Text>
        <View style={styles.headerAvatar}>
          <Image
            source={{ uri: PROFILE_USER.avatarUri }}
            style={styles.avatarImg}
            contentFit="cover"
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
        >
          <ChatDisclaimer />
          {messages.map((msg) => (
            <ChatMessageBubble key={msg.id} message={msg} />
          ))}
          {typing ? <ChatTypingIndicator /> : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {suggestedPrompts.map((prompt) => (
              <Pressable
                key={prompt}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                onPress={() => sendText(prompt)}
                disabled={typing}
              >
                <Text style={styles.chipText}>{prompt}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={t('chat.placeholder')}
              placeholderTextColor={colors.textTertiary}
              value={draft}
              onChangeText={setDraft}
              editable={!typing}
              returnKeyType="send"
              onSubmitEditing={() => sendText(draft)}
            />
            <Pressable
              style={[styles.sendBtn, (!draft.trim() || typing) && styles.sendBtnDisabled]}
              onPress={() => sendText(draft)}
              disabled={!draft.trim() || typing}
              accessibilityRole="button"
              accessibilityLabel={t('chat.sendMessage')}
            >
              <MaterialCommunityIcons name="send" size={20} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  headerTitle: {
    ...typography.h2,
    flex: 1,
    color: colors.primaryDark,
    marginLeft: spacing.sm,
    letterSpacing: -0.3,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BFC9C1',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.xl,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  chips: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primaryPale,
  },
  chipPressed: {
    backgroundColor: colors.primaryPale,
  },
  chipText: {
    ...typography.label,
    color: colors.primaryDark,
    textTransform: 'none',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#F1F3FF',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.full,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    minHeight: touchTarget,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
});
