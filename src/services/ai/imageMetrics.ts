import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

export type ImageSkinMetrics = {
  meanBrightness: number;
  redness: number;
  textureVariance: number;
  tZoneShine: number;
  cheekHydrationProxy: number;
  confidence: number;
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

function zoneStats(
  data: Uint8Array,
  width: number,
  height: number,
  yStartRatio: number,
  yEndRatio: number,
  xStartRatio = 0,
  xEndRatio = 1,
): { brightness: number; redness: number; variance: number } {
  const y0 = Math.floor(height * yStartRatio);
  const y1 = Math.floor(height * yEndRatio);
  const x0 = Math.floor(width * xStartRatio);
  const x1 = Math.floor(width * xEndRatio);

  let sumBright = 0;
  let sumRed = 0;
  let sumGreen = 0;
  let sumBlue = 0;
  let count = 0;
  const samples: number[] = [];

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
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
  const variance = Math.sqrt(varSum / count);

  const redness =
    sumRed / count / ((sumGreen + sumBlue) / (2 * count) + 0.08);

  return {
    brightness: mean,
    redness: clamp01((redness - 0.85) / 0.55),
    variance: clamp01(variance / 0.18),
  };
}

function metricsFromRgba(data: Uint8Array, width: number, height: number): ImageSkinMetrics {
  const forehead = zoneStats(data, width, height, 0.05, 0.35, 0.25, 0.75);
  const cheeks = zoneStats(data, width, height, 0.32, 0.72, 0.1, 0.9);
  const centerT = zoneStats(data, width, height, 0.2, 0.5, 0.35, 0.65);

  const meanBrightness = cheeks.brightness;
  const redness = clamp01((cheeks.redness * 0.6 + forehead.redness * 0.4));
  const textureVariance = clamp01((cheeks.variance * 0.7 + forehead.variance * 0.3));
  const tZoneShine = clamp01(centerT.brightness - cheeks.brightness + 0.08);
  const cheekHydrationProxy = clamp01(
    cheeks.brightness * 0.55 + (1 - cheeks.variance) * 0.25 + (1 - redness) * 0.2,
  );

  const flatImage = textureVariance < 0.03 && meanBrightness > 0.92;
  const confidence = flatImage
    ? 0.48
    : clamp01(0.62 + textureVariance * 0.25 + (1 - Math.abs(meanBrightness - 0.55)) * 0.12);

  return {
    meanBrightness,
    redness,
    textureVariance,
    tZoneShine,
    cheekHydrationProxy,
    confidence,
  };
}

/** Sample face photo pixels on-device (no upload). Returns null if decode fails. */
export async function extractImageMetrics(imageUri: string): Promise<ImageSkinMetrics | null> {
  try {
    const manipulated = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 192, height: 192 } }],
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

    return metricsFromRgba(decoded.data, decoded.width, decoded.height);
  } catch {
    return null;
  }
}
