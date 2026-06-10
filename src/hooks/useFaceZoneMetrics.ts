import { useEffect, useState } from 'react';

import {
  extractFaceZoneMetrics,
  type FaceZoneId,
  type FaceZoneMetricsMap,
  type ZoneIssueType,
} from '@/services/ai/faceZoneMetrics';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';

function fallbackFromResult(result?: SkinAnalysisResult): FaceZoneMetricsMap {
  const base = {
    brightness: 0.5,
    redness: 0.3,
    variance: 0.1,
    issue: 'balanced' as ZoneIssueType,
    tint: 'balanced' as const,
  };

  const map: FaceZoneMetricsMap = {
    forehead: { ...base },
    leftCheek: { ...base },
    rightCheek: { ...base },
    nose: { ...base },
    chin: { ...base },
  };

  if (!result) return map;

  const skinType = result.skinTypeId ?? 'combination';
  const hydration = result.concerns.find((c) => c.id === 'hydration');
  const acne = result.concerns.find((c) => c.id === 'acne');
  const texture = result.concerns.find((c) => c.id === 'texture');

  const elevateTZone = () => {
    const issue: ZoneIssueType =
      acne && acne.severity !== 'healthy' ? 'texture' : 'oil';
    const patch = { issue, tint: 'elevated' as const };
    map.forehead = { ...map.forehead, ...patch };
    map.nose = { ...map.nose, ...patch };
    map.chin = { ...map.chin, ...patch };
  };

  if (skinType === 'oily' || skinType === 'combination') {
    elevateTZone();
  }

  if (skinType === 'dry') {
    map.leftCheek = { ...map.leftCheek, issue: 'dryness', tint: 'elevated' };
    map.rightCheek = { ...map.rightCheek, issue: 'dryness', tint: 'elevated' };
  }

  if (hydration && hydration.severity !== 'healthy' && hydration.severity !== 'low') {
    map.leftCheek = { ...map.leftCheek, issue: 'dryness', tint: 'elevated' };
    map.rightCheek = { ...map.rightCheek, issue: 'dryness', tint: 'elevated' };
  }

  if (texture && texture.severity !== 'healthy') {
    (['forehead', 'chin'] as FaceZoneId[]).forEach((id) => {
      if (map[id].tint === 'balanced') {
        map[id] = { ...map[id], issue: 'texture', tint: 'elevated' };
      }
    });
  }

  if (acne && acne.severity !== 'healthy') {
    elevateTZone();
  }

  return map;
}

export function useFaceZoneMetrics(imageUri?: string, result?: SkinAnalysisResult) {
  const [metrics, setMetrics] = useState<FaceZoneMetricsMap | null>(null);
  const [loading, setLoading] = useState(Boolean(imageUri));

  useEffect(() => {
    if (!imageUri) {
      setMetrics(fallbackFromResult(result));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void extractFaceZoneMetrics(imageUri).then((parsed) => {
      if (cancelled) return;
      setMetrics(parsed ?? fallbackFromResult(result));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [imageUri, result]);

  return { metrics, loading };
}
