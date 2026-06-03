import { SkinScoreRing } from '@/components/report/SkinScoreRing';

type Props = {
  matchPercent: number;
  size?: number;
};

export function ProductMatchRing({ matchPercent, size = 64 }: Props) {
  return <SkinScoreRing score={matchPercent} size={size} />;
}
