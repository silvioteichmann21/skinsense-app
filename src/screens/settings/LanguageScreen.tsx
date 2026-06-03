import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LanguageOptionRow } from '@/components/settings/LanguageOptionRow';
import { LanguageSearchBar } from '@/components/settings/LanguageSearchBar';
import { LanguageSectionHeader } from '@/components/settings/LanguageSectionHeader';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { getAppLanguage } from '@/core/storage/languagePreferences';
import { useTranslation } from '@/i18n/useTranslation';
import {
  filterLanguagesBySection,
  type LanguageCode,
} from '@/screens/settings/languages';
import { colors, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Language'>;

function LanguageList({
  languages,
  pending,
  onSelect,
}: {
  languages: ReturnType<typeof filterLanguagesBySection>['suggested'];
  pending: LanguageCode;
  onSelect: (code: LanguageCode) => void;
}) {
  if (languages.length === 0) return null;
  return (
    <View style={styles.listCard}>
      {languages.map((lang, index) => (
        <LanguageOptionRow
          key={lang.code}
          language={lang}
          selected={pending === lang.code}
          onPress={() => onSelect(lang.code)}
          isLast={index === languages.length - 1}
        />
      ))}
    </View>
  );
}

export function LanguageScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t, setLocale } = useTranslation();
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<LanguageCode>('en');
  const [saved, setSaved] = useState<LanguageCode>('en');

  const sections = useMemo(() => filterLanguagesBySection(query), [query]);
  const hasResults = sections.suggested.length > 0 || sections.all.length > 0;
  const canSave = pending !== saved;

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAppLanguage()
        .then((code) => {
          if (!active) return;
          setPending(code);
          setSaved(code);
        })
        .catch(() => {
          if (!active) return;
          setPending('en');
          setSaved('en');
        });
      return () => {
        active = false;
      };
    }, []),
  );

  const onSave = async () => {
    await setLocale(pending);
    setSaved(pending);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader topInset={insets.top} title={t('language.title')} />

      <View style={styles.searchWrap}>
        <LanguageSearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={t('language.searchPlaceholder')}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + touchTarget + spacing.xxl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!hasResults ? (
          <Text style={styles.emptyText}>{t('language.noResults')}</Text>
        ) : (
          <>
            {sections.suggested.length > 0 ? (
              <>
                <LanguageSectionHeader title={t('language.suggested')} />
                <LanguageList
                  languages={sections.suggested}
                  pending={pending}
                  onSelect={setPending}
                />
              </>
            ) : null}
            {sections.all.length > 0 ? (
              <>
                <LanguageSectionHeader title={t('language.allLanguages')} />
                <LanguageList
                  languages={sections.all}
                  pending={pending}
                  onSelect={setPending}
                />
              </>
            ) : null}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <Pressable
          onPress={onSave}
          disabled={!canSave}
          style={({ pressed }) => [
            styles.saveBtn,
            !canSave && styles.saveBtnDisabled,
            pressed && canSave && styles.saveBtnPressed,
          ]}
        >
          <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
            {t('common.save')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderMuted,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xxl,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    overflow: 'hidden',
  },
  saveBtn: {
    height: touchTarget,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  saveBtnDisabled: {
    backgroundColor: colors.borderMuted,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  saveText: {
    ...typography.h3,
    color: colors.textInverse,
  },
  saveTextDisabled: {
    color: colors.textTertiary,
  },
});
