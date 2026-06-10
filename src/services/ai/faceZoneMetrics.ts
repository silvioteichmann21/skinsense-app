import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

export type FaceZoneId = 'forehead' | 'leftCheek' | 'rightCheek' | 'nose' | 'chin';

export type ZoneIssueType = 'oil' | 'dryness' | 'texture' | 'redness' | 'balanced';

export type ZonePixelStats = {
  brightness: number;
  redness: number;
  variance: number;
};

export type FaceZoneAnalysis = ZonePixelStats & {
  issue: ZoneIssueType;
  tint: 'elevated' | 'balanced';
};

export type FaceZoneMetricsMap = Record<FaceZoneId, FaceZoneAnalysis>;

const ZONE_REGIONS: Record<
  FaceZoneId,
  { y0: number; y1: number; x0: number; x1: number }
> = {
  forehead: { y0: 0.06, y1: 0.28, x0: 0.22, x1: 0.78 },
  leftCheek: { y0: 0.3, y1: 0.62, x0: 0.08, x1: 0.42 },
  rightCheek: { y0: 0.3, y1: 0.62, x0: 0.58, x1: 0.92 },
  nose: { y0: 0.28, y1: 0.58, x0: 0.4, x1: 0.6 },
  chin: { y0: 0.68, y1: 0.9, x0: 0.28, x1: 0.72 },
};

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function sampleZone(
  data: Uint8Array,
  width: number,
  height: number,
  y0: number,
  y1: number,
  x0: number,
  x1: number,
): ZonePixelStats {
  const ys = Math.floor(height * y0);
  const ye = Math.floor(height * y1);
  const xs = Math.floor(width * x0);
  const xe = Math.floor(width * x1);

  let sumBright = 0;
  let sumRed = 0;
  let sumGreen = 0;
  let sumBlue = 0;
  let count = 0;
  const samples: number[] = [];

  for (let y = ys; y < ye; y++) {
    for (let x = xs; x < xe; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;
      const bright = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      sumBright += bright;
      sumRed += r / 255;
      sumGreen += g / 255;
      sumBlue += b / 255;
      samples.push(bright);
      count++;
    }
  }

  if (count === 0) {
    return { brightness: 0.5, redness: 0.3, variance: 0.1 };
  }

  const mean = sumBright / count;
  let varSum = 0;
  for (const s of samples) {
    varSum += (s - mean) ** 2;
  }
  const variance = clamp01(Math.sqrt(varSum / count) / 0.18);

  const rednessRaw =
    (sumRed / count) / ((sumGreen + sumBlue) / (2 * count) + 0.08);
  const redness = clamp01((rednessRaw - 0.85) / 0.55);

  return { brightness: mean, redness, variance };
}

function classifyZone(
  stats: ZonePixelStats,
  zoneId: FaceZoneId,
  cheekBaseline: number,
): Pick<FaceZoneAnalysis, 'issue' | 'tint'> {
  const isTZone = zoneId === 'forehead' || zoneId === 'nose' || zoneId === 'chin';

  if (isTZone) {
    const shine = stats.brightness - cheekBaseline;
    if (shine > 0.05) return { issue: 'oil', tint: 'elevated' };
    if (stats.variance > 0.13) return { issue: 'texture', tint: 'elevated' };
    if (stats.redness > 0.42) return { issue: 'redness', tint: 'elevated' };
    return { issue: 'balanced', tint: 'balanced' };
  }

  if (stats.redness > 0.44) return { issue: 'redness', tint: 'elevated' };
  const hydration = stats.brightness * 0.5 + (1 - stats.variance) * 0.35 + (1 - stats.redness) * 0.15;
  if (hydration < 0.4 || stats.brightness < cheekBaseline - 0.04) {
    return { issue: 'dryness', tint: 'elevated' };
  }
  if (stats.variance > 0.14) return { issue: 'texture', tint: 'elevated' };
  return { issue: 'balanced', tint: 'balanced' };
}

function buildZoneMap(raw: Record<FaceZoneId, ZonePixelStats>): FaceZoneMetricsMap {
  const cheekBaseline =
    (raw.leftCheek.brightness + raw.rightCheek.brightness) / 2;

  return (Object.keys(raw) as FaceZoneId[]).reduce((acc, zoneId) => {
    const stats = raw[zoneId];
    const { issue, tint } = classifyZone(stats, zoneId, cheekBaseline);
    acc[zoneId] = { ...stats, issue, tint };
    return acc;
  }, {} as FaceZoneMetricsMap);
}

/** Sample each facial zone from the scan photo on-device. */
export async function extractFaceZoneMetrics(
  imageUri: string,
): Promise<FaceZoneMetricsMap | null> {
  try {
    const manipulated = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 256, height: 320 } }],
      {
        compress: 0.85,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    if (!manipulated.base64) return null;

    const bytes = base64ToUint8Array(manipulated.base64);
    const decoded = jpeg.decode(bytes, { useTArray: true });
    if (!decoded?.data || decoded.width < 8 || decoded.height < 8) return null;

    const raw = (Object.keys(ZONE_REGIONS) as FaceZoneId[]).reduce(
      (acc, zoneId) => {
        const r = ZONE_REGIONS[zoneId];
        acc[zoneId] = sampleZone(
          decoded.data,
          decoded.width,
          decoded.height,
          r.y0,
          r.y1,
          r.x0,
          r.x1,
        );
        return acc;
      },
      {} as Record<FaceZoneId, ZonePixelStats>,
    );

    return buildZoneMap(raw);
  } catch {
    return null;
  }
}
