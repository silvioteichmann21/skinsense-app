import Svg, { Polyline } from 'react-native-svg';

import { useAppTheme } from '@/theme';

type Props = {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
};

export function Sparkline({ values, width = 60, height = 24, stroke }: Props) {
  const { colors } = useAppTheme();
  const strokeColor = stroke ?? colors.primary;

  if (values.length < 2) return null;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline points={points} fill="none" stroke={strokeColor} strokeWidth={2} />
    </Svg>
  );
}
