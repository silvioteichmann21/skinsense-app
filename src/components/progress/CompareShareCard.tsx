import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { CompareDeltaRow } from '@/screens/progress/compareMockData';

export type CompareShareData = {
  brand: string;
  title: string;
  initialLabel: string;
  currentLabel: string;
  beforeDate: string;
  afterDate: string;
  beforeScore: number;
  afterScore: number;
  scoreDelta: number;
  pointsSinceInitial: string;
  metricTitle: string;
  concernLabel: string;
  beforeColumn: string;
  afterColumn: string;
  changeLabel: string;
  deltas: CompareDeltaRow[];
  footer: string;
};

type Props = {
  data: CompareShareData;
};

/** Fixed-size card captured for sharing (no face photos — scores only). */
export const CompareShareCard = forwardRef<View, Props>(function CompareShareCard(
  { data },
  ref,
) {
  const scoreDeltaText =
    data.scoreDelta === 0
      ? '—'
      : `${data.scoreDelta > 0 ? '+' : ''}${data.scoreDelta}`;

  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <Text style={styles.brand}>{data.brand}</Text>
      <Text style={styles.title}>{data.title}</Text>

      <View style={styles.scoreRow}>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreLabel}>{data.initialLabel}</Text>
          <Text style={styles.scoreDate}>{data.beforeDate}</Text>
          <Text style={styles.scoreValue}>{data.beforeScore}</Text>
          <Text style={styles.scoreUnit}>/100</Text>
        </View>

        <View style={styles.arrowCol}>
          <Text style={styles.arrow}>→</Text>
          <Text style={[styles.delta, data.scoreDelta >= 0 ? styles.deltaUp : styles.deltaDown]}>
            {scoreDeltaText}
          </Text>
        </View>

        <View style={styles.scoreCol}>
          <Text style={[styles.scoreLabel, styles.scoreLabelActive]}>{data.currentLabel}</Text>
          <Text style={styles.scoreDate}>{data.afterDate}</Text>
          <Text style={[styles.scoreValue, styles.scoreValueActive]}>{data.afterScore}</Text>
          <Text style={styles.scoreUnit}>/100</Text>
        </View>
      </View>

      {data.scoreDelta !== 0 ? (
        <Text style={styles.pointsLine}>{data.pointsSinceInitial}</Text>
      ) : null}

      <Text style={styles.metricTitle}>{data.metricTitle}</Text>
      <View style={styles.table}>
        <View style={styles.tableHead}>
          <Text style={[styles.headCell, styles.concernCell]}>{data.concernLabel}</Text>
          <Text style={styles.headCell}>{data.beforeColumn}</Text>
          <Text style={styles.headCell}>{data.afterColumn}</Text>
          <Text style={[styles.headCell, styles.changeCell]}>{data.changeLabel}</Text>
        </View>
        {data.deltas.slice(0, 6).map((row, index, rows) => (
          <View
            key={row.id}
            style={[styles.tableRow, index === rows.length - 1 && styles.tableRowLast]}
          >
            <Text style={[styles.bodyCell, styles.concernCell]} numberOfLines={1}>
              {row.concern}
            </Text>
            <Text style={styles.bodyCell}>{row.before}</Text>
            <Text style={styles.bodyCell}>{row.after}</Text>
            <Text
              style={[
                styles.bodyCell,
                styles.changeCell,
                row.changePositive ? styles.changeGood : styles.changeWarn,
              ]}
            >
              {row.change}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>{data.footer}</Text>
    </View>
  );
});

const CARD_WIDTH = 360;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#0F1410',
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  brand: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4ADE80',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F4F7F4',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A211C',
    borderRadius: 16,
    padding: 16,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA89E',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scoreLabelActive: {
    color: '#4ADE80',
  },
  scoreDate: {
    fontSize: 11,
    color: '#7A857C',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#D1D9D3',
    lineHeight: 40,
  },
  scoreValueActive: {
    color: '#4ADE80',
  },
  scoreUnit: {
    fontSize: 12,
    color: '#7A857C',
  },
  arrowCol: {
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  arrow: {
    fontSize: 20,
    color: '#4ADE80',
  },
  delta: {
    fontSize: 14,
    fontWeight: '700',
  },
  deltaUp: {
    color: '#4ADE80',
  },
  deltaDown: {
    color: '#F59E0B',
  },
  pointsLine: {
    fontSize: 14,
    color: '#4ADE80',
    textAlign: 'center',
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA89E',
  },
  table: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A332C',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: '#1A211C',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A332C',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  headCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    color: '#7A857C',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  bodyCell: {
    flex: 1,
    fontSize: 12,
    color: '#E8EDE9',
    textAlign: 'center',
  },
  concernCell: {
    flex: 1.3,
    textAlign: 'left',
  },
  changeCell: {
    textAlign: 'right',
    fontWeight: '600',
  },
  changeGood: {
    color: '#4ADE80',
  },
  changeWarn: {
    color: '#F59E0B',
  },
  footer: {
    fontSize: 11,
    color: '#7A857C',
    textAlign: 'center',
    marginTop: 4,
  },
});
