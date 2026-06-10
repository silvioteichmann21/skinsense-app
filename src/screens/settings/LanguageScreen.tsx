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
import { GradientButton } from '@/components/ui/GradientButton';
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
import type { AppColors } from '@/theme/palettes';
import { spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

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
  const styles = useThemedStyles(createStyles);

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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
    width: '100%',
  },
  saveText: {
    ...typography.h3,
    color: colors.textInverse,
  },
});
}

export function LanguageScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle, blurTint } = useAppTheme();

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
      <StatusBar style={statusBarStyle} />
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
        <BlurView intensity={80} tint={blurTint} style={StyleSheet.absoluteFill} />
        <GradientButton onPress={onSave} disabled={!canSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>{t('common.save')}</Text>
        </GradientButton>
      </View>
    </View>
  );
}
