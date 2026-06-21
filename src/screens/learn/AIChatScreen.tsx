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
import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import type { RootStackParamList } from '@/core/navigation/types';
import { useGeminiChatReply } from '@/hooks/useGeminiChatReply';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { layout, radius, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';
import type { ChatMessage } from '@/types/chat';

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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  headerTitle: {
    ...typography.h2,
    flex: 1,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    letterSpacing: -0.3,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  headerAvatarPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.onPrimaryPale,
    textTransform: 'none',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
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
    flexShrink: 0,
  },
});
}

export function AIChatScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const displayName = useUserDisplayName();
  const guestName = t('profile.guestName');
  const chatUserName = displayName || guestName;
  const { displayUri: profilePhotoUri } = useProfilePhoto();
  const { getReply } = useGeminiChatReply(chatUserName);
  const scrollRef = useRef<ScrollView>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const initialMessages = useMemo<ChatMessage[]>(
    () => [
      {
        id: 'ai-greeting',
        role: 'assistant',
        text: t('chat.replyGreeting', { name: chatUserName }),
      },
    ],
    [t, chatUserName],
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  messagesRef.current = messages;

  const suggestedPrompts = useMemo(() => PROMPT_KEYS.map((key) => t(key)), [t]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      const userMsg: ChatMessage = { id: nextId(), role: 'user', text: trimmed };
      const priorMessages = messagesRef.current;
      setMessages((prev) => [...prev, userMsg]);
      setDraft('');
      setTyping(true);
      scrollToEnd();

      try {
        const reply = await getReply(trimmed, priorMessages);
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            text: reply.text,
            showInsight: reply.showInsight,
          },
        ]);
      } finally {
        setTyping(false);
        scrollToEnd();
      }
    },
    [typing, scrollToEnd, getReply],
  );

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <ScreenBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>{t('chat.title')}</Text>
        {profilePhotoUri ? (
          <View style={styles.headerAvatar}>
            <Image source={{ uri: profilePhotoUri }} style={styles.avatarImg} contentFit="cover" />
          </View>
        ) : (
          <View style={[styles.headerAvatar, styles.headerAvatarPlaceholder]}>
            <MaterialCommunityIcons name="account" size={18} color={colors.textTertiary} />
          </View>
        )}
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
                onPress={() => void sendText(prompt)}
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
              onSubmitEditing={() => void sendText(draft)}
            />
            <GradientButton
              shape="circle"
              style={styles.sendBtn}
              onPress={() => void sendText(draft)}
              disabled={!draft.trim() || typing}
              haptic="light"
            >
              <MaterialCommunityIcons name="send" size={20} color={colors.white} />
            </GradientButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
