import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { colors, radius, spacing, typography } from '@/theme';

type ZoneId = 'forehead' | 'leftCheek' | 'rightCheek' | 'nose' | 'chin';

const ZONE_LAYOUT: Record<
  ZoneId,
  { style: object; tint: 'elevated' | 'balanced'; labelKey: TranslationKey }
> = {
  forehead: {
    style: { top: '10%', left: '25%', width: '50%', height: '20%' },
    tint: 'elevated',
    labelKey: 'report.zoneForehead',
  },
  leftCheek: {
    style: { top: '35%', left: '20%', width: '25%', height: '30%' },
    tint: 'balanced',
    labelKey: 'report.zoneLeftCheek',
  },
  rightCheek: {
    style: { top: '35%', right: '20%', width: '25%', height: '30%' },
    tint: 'balanced',
    labelKey: 'report.zoneRightCheek',
  },
  nose: {
    style: { top: '30%', left: '45%', width: '10%', height: '40%' },
    tint: 'elevated',
    labelKey: 'report.zoneNose',
  },
  chin: {
    style: { bottom: '12%', left: '35%', width: '30%', height: '14%' },
    tint: 'balanced',
    labelKey: 'report.zoneChin',
  },
};

const ZONE_IDS: ZoneId[] = ['forehead', 'leftCheek', 'rightCheek', 'nose', 'chin'];

export function FaceMap() {
  const { t } = useTranslation();
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const zones = useMemo(
    () =>
      ZONE_IDS.map((id) => ({
        id,
        label: t(ZONE_LAYOUT[id].labelKey),
        style: ZONE_LAYOUT[id].style,
        tint: ZONE_LAYOUT[id].tint,
      })),
    [t],
  );

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{t('report.faceMapTitle')}</Text>
      <View style={styles.mapWrap}>
        <View style={styles.faceOutline} />
        {zones.map((zone) => (
          <Pressable
            key={zone.id}
            onPress={() => setActiveZone(zone.label)}
            style={[
              styles.zone,
              zone.style,
              zone.tint === 'elevated' ? styles.zoneElevated : styles.zoneBalanced,
              activeZone === zone.label && styles.zoneActive,
            ]}
          />
        ))}
      </View>
      {activeZone ? <Text style={styles.tooltip}>{activeZone}</Text> : null}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotElevated]} />
          <Text style={styles.legendText}>{t('report.elevatedActivity')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotBalanced]} />
          <Text style={styles.legendText}>{t('report.optimalBalance')}</Text>
        </View>
      </View>
    </View>
  );
}

const MAP_WIDTH = 192;
const MAP_HEIGHT = 256;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F1F3FF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heading: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  mapWrap: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOutline: {
    width: MAP_WIDTH * 0.9,
    height: MAP_HEIGHT * 0.92,
    borderRadius: MAP_WIDTH * 0.45,
    borderWidth: 2,
    borderColor: 'rgba(112, 121, 115, 0.3)',
  },
  zone: {
    position: 'absolute',
    borderRadius: 999,
  },
  zoneElevated: {
    backgroundColor: 'rgba(142, 78, 20, 0.35)',
  },
  zoneBalanced: {
    backgroundColor: 'rgba(183, 228, 199, 0.55)',
  },
  zoneActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tooltip: {
    ...typography.body,
    color: colors.primaryDark,
    marginTop: spacing.md,
    fontFamily: typography.bodyLg.fontFamily,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.xl,
    width: '100%',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '48%',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotElevated: {
    backgroundColor: '#8E4E14',
  },
  dotBalanced: {
    backgroundColor: colors.primaryPale,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: typography.bodyLg.fontFamily,
  },
});
