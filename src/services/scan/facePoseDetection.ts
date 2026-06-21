import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

import type { FacePoseId } from '@/components/scan/facePoseScan';

export type FacePoseSample = {
  faceDetected: boolean;
  yawScore: number;
  confidence: number;
};

const FRONT_YAW_MAX = 0.11;
const PROFILE_YAW_MIN = 0.07;
const MIN_CONFIDENCE = 0.32;

/** Front-camera preview is mirrored — flip yaw so turn hints match what the user sees. */
export function normalizePoseSample(sample: FacePoseSample, mirrorYaw: boolean): FacePoseSample {
  if (!mirrorYaw) return sample;
  return { ...sample, yawScore: -sample.yawScore };
}

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

function regionStats(
  data: Uint8Array,
  width: number,
  height: number,
  xStartRatio: number,
  xEndRatio: number,
  yStartRatio: number,
  yEndRatio: number,
  step = 1,
): { mean: number; variance: number } {
  const x0 = Math.floor(width * xStartRatio);
  const x1 = Math.floor(width * xEndRatio);
  const y0 = Math.floor(height * yStartRatio);
  const y1 = Math.floor(height * yEndRatio);

  let sum = 0;
  let count = 0;
  const samples: number[] = [];

  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;
      const bright = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      sum += bright;
      samples.push(bright);
      count++;
    }
  }

  if (count === 0) {
    return { mean: 0.5, variance: 0 };
  }

  const mean = sum / count;
  let varSum = 0;
  for (const s of samples) {
    varSum += (s - mean) ** 2;
  }

  return { mean, variance: Math.sqrt(varSum / count) };
}

function analyzeRgba(data: Uint8Array, width: number, height: number): FacePoseSample {
  const step = width > 120 ? 2 : 1;
  const left = regionStats(data, width, height, 0.06, 0.36, 0.2, 0.78, step);
  const right = regionStats(data, width, height, 0.64, 0.94, 0.2, 0.78, step);
  const center = regionStats(data, width, height, 0.36, 0.64, 0.18, 0.8, step);

  const brightnessYaw = right.mean - left.mean;
  const textureYaw = (right.variance - left.variance) * 0.35;
  const yawScore = brightnessYaw * 0.75 + textureYaw * 0.25;

  const hasSkinTone =
    center.mean > 0.2 &&
    center.mean < 0.92 &&
    left.mean > 0.1 &&
    right.mean > 0.1;
  const hasTexture =
    left.variance + right.variance + center.variance > 0.024;
  const notEmpty =
    Math.abs(left.mean - right.mean) < 0.45 || Math.abs(yawScore) > 0.035;

  const faceDetected = hasSkinTone && hasTexture && notEmpty;
  const symmetry = 1 - Math.min(1, Math.abs(yawScore) / 0.24);
  const confidence = faceDetected
    ? clamp01(0.5 + symmetry * 0.22 + center.variance * 0.75)
    : 0;

  return { faceDetected, yawScore, confidence };
}

function decodeJpegBase64(base64: string): { data: Uint8Array; width: number; height: number } | null {
  try {
    const bytes = base64ToUint8Array(base64);
    const decoded = jpeg.decode(bytes, { useTArray: true });
    if (!decoded?.data || decoded.width < 8 || decoded.height < 8) return null;
    return { data: decoded.data, width: decoded.width, height: decoded.height };
  } catch {
    return null;
  }
}

export function analyzeFacePoseFromBase64(base64: string): FacePoseSample | null {
  const decoded = decodeJpegBase64(base64);
  if (!decoded) return null;
  return analyzeRgba(decoded.data, decoded.width, decoded.height);
}

export async function analyzeFacePoseFromUri(imageUri: string): Promise<FacePoseSample | null> {
  try {
    const manipulated = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 144, height: 180 } }],
      {
        compress: 0.45,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    if (!manipulated.base64) return null;
    return analyzeFacePoseFromBase64(manipulated.base64);
  } catch {
    return null;
  }
}

export function smoothPoseSample(
  previous: FacePoseSample | null,
  next: FacePoseSample,
  alpha = 0.38,
): FacePoseSample {
  if (!previous?.faceDetected || !next.faceDetected) return next;
  return {
    faceDetected: next.faceDetected,
    yawScore: previous.yawScore * (1 - alpha) + next.yawScore * alpha,
    confidence: previous.confidence * (1 - alpha) + next.confidence * alpha,
  };
}

/** 0–1 how close the face is to the target pose */
export function getPoseAlignmentProgress(pose: FacePoseId, sample: FacePoseSample): number {
  if (!sample.faceDetected) return 0;

  switch (pose) {
    case 'front':
      return clamp01(1 - Math.abs(sample.yawScore) / FRONT_YAW_MAX);
    case 'right':
      return clamp01((sample.yawScore + 0.02) / (PROFILE_YAW_MIN + 0.02));
    case 'left':
      return clamp01((-sample.yawScore + 0.02) / (PROFILE_YAW_MIN + 0.02));
    default:
      return 0;
  }
}

export function matchesTargetPose(pose: FacePoseId, sample: FacePoseSample): boolean {
  if (!sample.faceDetected || sample.confidence < MIN_CONFIDENCE) return false;
  return getPoseAlignmentProgress(pose, sample) >= 0.82;
}
