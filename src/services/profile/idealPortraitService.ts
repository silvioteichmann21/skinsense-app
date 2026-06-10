import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

import { getActiveUserScope } from '@/core/storage/userScope';

export type IdealPortraitInput = {
  imageUri: string;
  cacheKey: string;
  skinScore?: number;
  /** 0–1 routine/scan consistency bonus — slightly increases glow over time. */
  progressRatio?: number;
};

export type IdealPortraitResult = {
  rawUri: string;
  idealUri: string;
  targetScore: number;
};

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function isLikelySkin(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 12) return false;
  return r > 52 && g > 32 && b > 18 && r >= g - 8 && r > b && r - g < 72;
}

function enhancementIntensity(skinScore: number, progressRatio: number): number {
  const base = 0.2;
  const scoreNorm = Math.max(0, Math.min(1, (skinScore - 45) / 45));
  const progressBoost = Math.max(0, Math.min(1, progressRatio)) * 0.14;
  return Math.min(0.42, base + scoreNorm * 0.08 + progressBoost);
}

function enhanceSkinPixel(
  r: number,
  g: number,
  b: number,
  intensity: number,
): [number, number, number] {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const avg = (r + g + b) / 3;

  let nr = r - (r - avg) * 0.1 * intensity;
  let ng = g + (avg - g) * 0.05 * intensity + 3 * intensity;
  let nb = b + (avg - b) * 0.04 * intensity + 1.5 * intensity;

  if (lum < 145) {
    const lift = (145 - lum) * 0.1 * intensity;
    nr += lift;
    ng += lift;
    nb += lift;
  }

  const warmth = 1 + 0.04 * intensity;
  nr = nr * warmth;
  ng = ng * (1 + 0.02 * intensity);

  return [clampByte(nr), clampByte(ng), clampByte(nb)];
}

function applySubtlePortraitEnhancement(
  data: Uint8Array,
  width: number,
  height: number,
  intensity: number,
): Uint8Array {
  const out = new Uint8Array(data.length);
  out.set(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;
      const a = data[idx + 3] ?? 255;
      if (a < 16 || !isLikelySkin(r, g, b)) continue;

      const [nr, ng, nb] = enhanceSkinPixel(r, g, b, intensity);
      out[idx] = nr;
      out[idx + 1] = ng;
      out[idx + 2] = nb;
    }
  }

  return out;
}

async function portraitDir(): Promise<string> {
  const scope = await getActiveUserScope();
  const dir = `${FileSystem.documentDirectory ?? ''}profile/${scope}/portraits/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

async function cropPortraitSquare(sourceUri: string): Promise<string> {
  const probe = await ImageManipulator.manipulateAsync(sourceUri, []);
  const width = probe.width ?? 1;
  const height = probe.height ?? 1;
  const side = Math.min(width, height, 720);
  const originX = Math.max(0, Math.round((width - side) / 2));
  const originY = Math.max(0, Math.round((height - side) * 0.22));

  const cropped = await ImageManipulator.manipulateAsync(
    sourceUri,
    [
      {
        crop: {
          originX,
          originY: Math.min(originY, Math.max(0, height - side)),
          width: side,
          height: side,
        },
      },
      { resize: { width: 512, height: 512 } },
    ],
    { compress: 0.92, format: ImageManipulator.SaveFormat.JPEG },
  );

  return cropped.uri;
}

async function writeJpegFromRgba(
  data: Uint8Array,
  width: number,
  height: number,
  dest: string,
): Promise<string> {
  const encoded = jpeg.encode({ data, width, height }, 90);
  const base64 = uint8ArrayToBase64(encoded.data);
  await FileSystem.writeAsStringAsync(dest, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return dest;
}

export function computeTargetScore(skinScore: number, progressRatio: number): number {
  const bonus = 10 + Math.round(Math.max(0, Math.min(1, progressRatio)) * 10);
  return Math.min(96, Math.max(skinScore + 4, skinScore + bonus));
}

export async function generateIdealPortrait(
  input: IdealPortraitInput,
): Promise<IdealPortraitResult> {
  const dir = await portraitDir();
  const safeKey = input.cacheKey.replace(/[^a-zA-Z0-9_-]/g, '_');
  const rawDest = `${dir}raw-${safeKey}.jpg`;
  const idealDest = `${dir}ideal-${safeKey}.jpg`;

  const rawInfo = await FileSystem.getInfoAsync(rawDest);
  const idealInfo = await FileSystem.getInfoAsync(idealDest);
  const skinScore = input.skinScore ?? 68;
  const progressRatio = input.progressRatio ?? 0;
  const targetScore = computeTargetScore(skinScore, progressRatio);

  if (rawInfo.exists && idealInfo.exists) {
    return { rawUri: rawDest, idealUri: idealDest, targetScore };
  }

  const croppedUri = await cropPortraitSquare(input.imageUri);
  if (!rawInfo.exists) {
    await FileSystem.copyAsync({ from: croppedUri, to: rawDest });
  }

  const manipulated = await ImageManipulator.manipulateAsync(
    croppedUri,
    [{ resize: { width: 384, height: 384 } }],
    {
      compress: 0.9,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    },
  );

  if (!manipulated.base64) {
    return { rawUri: rawDest, idealUri: rawDest, targetScore };
  }

  const bytes = base64ToUint8Array(manipulated.base64);
  const decoded = jpeg.decode(bytes, { useTArray: true });
  if (!decoded?.data) {
    return { rawUri: rawDest, idealUri: rawDest, targetScore };
  }

  const intensity = enhancementIntensity(skinScore, progressRatio);
  const enhanced = applySubtlePortraitEnhancement(
    decoded.data,
    decoded.width,
    decoded.height,
    intensity,
  );

  await writeJpegFromRgba(enhanced, decoded.width, decoded.height, idealDest);

  return { rawUri: rawDest, idealUri: idealDest, targetScore };
}
