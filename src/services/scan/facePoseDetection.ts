import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

import type { FacePoseId } from '@/components/scan/facePoseScan';

export type FacePoseSample = {
  faceDetected: boolean;
  yawScore: number;
  confidence: number;
};

const MIN_CONFIDENCE = 0.3;
export const MIN_POSE_CONFIDENCE = MIN_CONFIDENCE;
const FAST_SAMPLE_MAX_EDGE = 96;

/** Strong profile turn — used only to reject clearly wrong angles. */
const CLEAR_PROFILE = 0.085;
/** Still facing camera when a side profile is expected. */
const CLEAR_FRONT = 0.038;
/** Turned the opposite way for a profile step. */
const CLEAR_OPPOSITE = 0.065;

/** Front-camera preview is mirrored — flip yaw so turn hints match what the user sees. */
export function normalizePoseSample(sample: FacePoseSample, mirrorYaw: boolean): FacePoseSample {
  if (!mirrorYaw) return sample;
  return { ...sample, yawScore: -sample.yawScore };
}

function sampleStep(width: number, height: number, fast: boolean): number {
  if (!fast) {
    return width > 120 ? 2 : 1;
  }
  return Math.max(3, Math.floor(Math.min(width, height) / 22));
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

  let count = 0;
  let mean = 0;
  let m2 = 0;

  for (let y = y0; y < y1; y += step) {
    for (let x = x0; x < x1; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx] ?? 0;
      const g = data[idx + 1] ?? 0;
      const b = data[idx + 2] ?? 0;
      const bright = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      count += 1;
      const delta = bright - mean;
      mean += delta / count;
      m2 += delta * (bright - mean);
    }
  }

  if (count === 0) {
    return { mean: 0.5, variance: 0 };
  }

  return { mean, variance: Math.sqrt(m2 / count) };
}

function analyzeRgba(
  data: Uint8Array,
  width: number,
  height: number,
  fast = false,
): FacePoseSample {
  const step = sampleStep(width, height, fast);

  const leftCheek = regionStats(data, width, height, 0.08, 0.38, 0.32, 0.72, step);
  const rightCheek = regionStats(data, width, height, 0.62, 0.92, 0.32, 0.72, step);
  const leftSide = regionStats(data, width, height, 0.04, 0.28, 0.22, 0.78, step);
  const rightSide = regionStats(data, width, height, 0.72, 0.96, 0.22, 0.78, step);
  const center = regionStats(data, width, height, 0.36, 0.64, 0.2, 0.78, step);
  const forehead = regionStats(data, width, height, 0.32, 0.68, 0.12, 0.34, step);

  const cheekYaw = rightCheek.mean - leftCheek.mean;
  const sideYaw = rightSide.mean - leftSide.mean;
  const textureYaw = (rightCheek.variance - leftCheek.variance) * 0.28;
  const yawScore = cheekYaw * 0.55 + sideYaw * 0.3 + textureYaw * 0.15;

  const hasSkinTone =
    center.mean > 0.18 &&
    center.mean < 0.93 &&
    leftCheek.mean > 0.1 &&
    rightCheek.mean > 0.1;
  const hasTexture =
    leftCheek.variance + rightCheek.variance + center.variance > 0.022;
  const faceCentered =
    center.variance >= Math.min(leftSide.variance, rightSide.variance) * 0.4;
  const notEmpty =
    Math.abs(leftCheek.mean - rightCheek.mean) < 0.42 ||
    Math.abs(yawScore) > 0.03 ||
    forehead.variance > 0.015;

  const faceDetected = hasSkinTone && hasTexture && notEmpty && faceCentered;
  const symmetry = 1 - Math.min(1, Math.abs(yawScore) / 0.22);
  const confidence = faceDetected
    ? clamp01(0.48 + symmetry * 0.2 + center.variance * 0.7 + forehead.variance * 0.35)
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

export function analyzeFacePoseFromBase64(base64: string, fast = false): FacePoseSample | null {
  const decoded = decodeJpegBase64(base64);
  if (!decoded) return null;
  return analyzeRgba(decoded.data, decoded.width, decoded.height, fast);
}

/** Lightweight live-poll path — skips ImageManipulator and subsamples large frames. */
export function analyzeFacePoseSampleBase64(base64: string): FacePoseSample | null {
  return analyzeFacePoseFromBase64(base64, true);
}

export async function analyzeFacePoseFromUri(
  imageUri: string,
  fast = false,
): Promise<FacePoseSample | null> {
  try {
    const maxEdge = fast ? FAST_SAMPLE_MAX_EDGE : 144;
    const manipulated = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: maxEdge } }],
      {
        compress: fast ? 0.28 : 0.45,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );

    if (!manipulated.base64) return null;
    return analyzeFacePoseFromBase64(manipulated.base64, fast);
  } catch {
    return null;
  }
}

export function smoothPoseSample(
  previous: FacePoseSample | null,
  next: FacePoseSample,
  alpha = 0.58,
): FacePoseSample {
  if (!previous?.faceDetected || !next.faceDetected) return next;
  return {
    faceDetected: next.faceDetected,
    yawScore: previous.yawScore * (1 - alpha) + next.yawScore * alpha,
    confidence: previous.confidence * (1 - alpha) + next.confidence * alpha,
  };
}

/** True when the angle is obviously wrong for this step (e.g. right step but facing front/left). */
export function isClearlyWrongPose(pose: FacePoseId, sample: FacePoseSample): boolean {
  if (!sample.faceDetected || sample.confidence < MIN_CONFIDENCE) {
    return true;
  }

  const y = sample.yawScore;

  switch (pose) {
    case 'front':
      return Math.abs(y) > CLEAR_PROFILE;
    case 'right':
      return y < -CLEAR_OPPOSITE || Math.abs(y) < CLEAR_FRONT;
    case 'left':
      return y > CLEAR_OPPOSITE || Math.abs(y) < CLEAR_FRONT;
    default:
      return false;
  }
}

/** Good enough to capture — only blocks obviously wrong angles. */
export function isAcceptablePose(pose: FacePoseId, sample: FacePoseSample): boolean {
  return sample.faceDetected && sample.confidence >= MIN_CONFIDENCE && !isClearlyWrongPose(pose, sample);
}

/** UI progress: high when acceptable, low when clearly wrong. */
export function getPoseAlignmentProgress(pose: FacePoseId, sample: FacePoseSample): number {
  if (!sample.faceDetected) return 0;
  if (isClearlyWrongPose(pose, sample)) return 0.12;
  return 0.88;
}

/** @deprecated Use isAcceptablePose — kept for callers that expect this name. */
export function matchesTargetPose(pose: FacePoseId, sample: FacePoseSample): boolean {
  return isAcceptablePose(pose, sample);
}

export function matchesTargetPoseStrict(pose: FacePoseId, sample: FacePoseSample): boolean {
  return isAcceptablePose(pose, sample);
}
