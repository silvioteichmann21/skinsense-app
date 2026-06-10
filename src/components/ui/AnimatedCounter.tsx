import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

import { motion } from '@/theme';

type Props = {
  value: number;
  /** Animation length in ms. Default `motion.duration.count`. */
  duration?: number;
  /** Decimal places to display. Default 0. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: StyleProp<TextStyle>;
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Counts a number up from its previous value to the target with an ease-out
 * curve. Great for scores and stats so they feel earned, not just printed.
 */
export function AnimatedCounter({
  value,
  duration = motion.duration.count,
  decimals = 0,
  prefix = '',
  suffix = '',
  style,
}: Props) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = Date.now();
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(from + (to - from) * easeOutCubic(progress));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const text = decimals > 0 ? display.toFixed(decimals) : String(Math.round(display));

  return (
    <Text style={style}>
      {prefix}
      {text}
      {suffix}
    </Text>
  );
}
