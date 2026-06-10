import { useEffect, useState } from 'react';

import {
  computeTargetScore,
  generateIdealPortrait,
} from '@/services/profile/idealPortraitService';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';

type Options = {
  progressRatio?: number;
};

export function useIdealPortrait(scan: SkinAnalysisResult | null, options?: Options) {
  const [idealUri, setIdealUri] = useState<string | null>(null);
  const [rawUri, setRawUri] = useState<string | null>(null);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);

  const progressRatio = options?.progressRatio ?? 0;

  useEffect(() => {
    if (!scan?.imageUri) {
      setIdealUri(null);
      setRawUri(null);
      setTargetScore(null);
      return;
    }

    let active = true;
    setGenerating(true);

    void generateIdealPortrait({
      imageUri: scan.imageUri,
      cacheKey: scan.id,
      skinScore: scan.skinScore,
      progressRatio,
    })
      .then((result) => {
        if (!active) return;
        setIdealUri(result.idealUri);
        setRawUri(result.rawUri);
        setTargetScore(result.targetScore);
      })
      .catch(() => {
        if (!active) return;
        setIdealUri(scan.imageUri);
        setRawUri(scan.imageUri);
        setTargetScore(computeTargetScore(scan.skinScore, progressRatio));
      })
      .finally(() => {
        if (active) setGenerating(false);
      });

    return () => {
      active = false;
    };
  }, [scan?.id, scan?.imageUri, scan?.skinScore, progressRatio]);

  return { idealUri, rawUri, targetScore, generating };
}
