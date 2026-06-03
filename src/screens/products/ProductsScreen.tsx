import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductGridCard } from '@/components/products/ProductGridCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { PRODUCT_CATALOG, type Product } from '@/types/product';
import { colors, radius, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Products'>;

const FILTER_KEYS: { id: string; labelKey: TranslationKey }[] = [
  { id: 'Skin Type', labelKey: 'products.filterSkinType' },
  { id: 'Concern', labelKey: 'products.filterConcern' },
  { id: 'Category', labelKey: 'products.filterCategory' },
  { id: 'Price', labelKey: 'products.filterPrice' },
  { id: 'Vegan', labelKey: 'products.filterVegan' },
  { id: 'Fragrance-free', labelKey: 'products.filterFragranceFree' },
];

export function ProductsScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Skin Type');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCT_CATALOG.filter((p) => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const openProduct = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScreenHeader
        topInset={insets.top}
        title={t('products.title')}
        style={styles.headerBar}
        right={
          <Pressable
            accessibilityLabel={t('profile.menu.editProfile')}
            onPress={() =>
              Alert.alert(t('profile.menu.editProfile'), t('common.comingSoon', { feature: t('profile.menu.editProfile') }))
            }
            style={styles.accountBtn}
          >
            <MaterialCommunityIcons name="account-circle-outline" size={28} color={colors.textSecondary} />
          </Pressable>
        }
      />

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={22} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('products.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {FILTER_KEYS.map((item) => {
                const active = activeFilter === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => {
                      setActiveFilter(item.id);
                      if (item.id !== 'Skin Type') {
                        Alert.alert(t(item.labelKey), t('products.filtersSoon'));
                      }
                    }}
                  >
                    <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                      {t(item.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={styles.sortRow}>
              <Text style={styles.count}>
                {filtered.length === 1
                  ? t('products.showingOne', { count: filtered.length })
                  : t('products.showingMany', { count: filtered.length })}
              </Text>
              <Pressable onPress={() => Alert.alert(t('products.sortBestMatch'), t('products.sortSoon'))}>
                <View style={styles.sortBtn}>
                  <Text style={styles.sortLabel}>{t('products.sortBestMatch')}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={18} color={colors.primary} />
                </View>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.gridCell}>
            <ProductGridCard
              product={item}
              onPress={() => openProduct(item.id)}
              onAddToRoutine={() =>
                Alert.alert(t('products.addToRoutine'), t('products.addSoon', { name: item.name }))
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>{t('products.empty')}</Text>
        }
      />

      <Pressable
        style={[styles.fab, { bottom: insets.bottom + 88 }]}
        accessibilityLabel={t('products.scanLabel')}
        onPress={() => navigation.navigate('IngredientScanner')}
      >
        <MaterialCommunityIcons name="image-filter-center-focus" size={28} color={colors.textInverse} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    backgroundColor: colors.background,
  },
  accountBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginBottom: spacing.lg,
    height: touchTarget,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  searchIcon: {
    marginLeft: spacing.lg,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    height: '100%',
  },
  list: {
    paddingHorizontal: spacing.base,
  },
  chips: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  chipActive: {
    backgroundColor: colors.primaryPale,
    borderColor: colors.primaryPale,
  },
  chipLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  chipLabelActive: {
    color: colors.primaryDark,
    fontFamily: typography.h3.fontFamily,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  count: {
    ...typography.body,
    color: colors.textSecondary,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sortLabel: {
    ...typography.label,
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
    textTransform: 'none',
  },
  gridRow: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  gridCell: {
    flex: 1,
  },
  empty: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
