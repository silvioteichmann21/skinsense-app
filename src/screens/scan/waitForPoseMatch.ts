import type { FacePoseId } from '@/components/scan/facePoseScan';
import type { TranslationKey } from '@/i18n/useTranslation';
import { delay } from '@/screens/scan/cameraCaptureFlow';
import {
  getPoseAlignmentProgress,
  normalizePoseSample,
  smoothPoseSample,
  type FacePoseSample,
} from '@/services/scan/facePoseDetection';

export const POSE_POLL_MS = 280;
export const POSE_LOCK_THRESHOLD = 0.78;
export const STEP_SETTLE_MS = 550;
export const STEP_ALIGN_MS = 3800;
export const COUNTDOWN_TICK_MS = 620;

const GUIDANCE_DEADZONE = 0.04;
const PROFILE_OVERSHOOT = 0.22;

export type PoseMatchUpdate = {
  matched: boolean;
  stable: boolean;
  progress: number;
  sample: FacePoseSample;
  phase?: 'settle' | 'align' | 'countdown';
  countdown?: number;
};

export function getPoseGuidanceKey(
  pose: FacePoseId,
  sample: FacePoseSample,
  progress: number,
): TranslationKey {
  if (!sample.faceDetected) {
    return 'scan.captureNoFace';
  }

  if (progress >= 0.5 && progress < POSE_LOCK_THRESHOLD) {
    return 'scan.captureAlmostThere';
  }

  if (pose === 'front') {
    if (sample.yawScore > GUIDANCE_DEADZONE + 0.03) return 'scan.captureTurnToFrontFromRight';
    if (sample.yawScore < -(GUIDANCE_DEADZONE + 0.03)) return 'scan.captureTurnToFrontFromLeft';
    return 'scan.captureFrontReady';
  }

  if (pose === 'right') {
    if (sample.yawScore < -GUIDANCE_DEADZONE) return 'scan.captureTurnMoreRight';
    if (sample.yawScore > PROFILE_OVERSHOOT) return 'scan.captureTurnLessRight';
    return 'scan.captureRightReady';
  }

  if (sample.yawScore > GUIDANCE_DEADZONE) return 'scan.captureTurnMoreLeft';
  if (sample.yawScore < -PROFILE_OVERSHOOT) return 'scan.captureTurnLessLeft';
  return 'scan.captureLeftReady';
}

/** Poll until pose locks, then fall back to a short countdown so the step always completes. */
export async function waitForStepAutoCapture(options: {
  pose: FacePoseId;
  samplePose: () => Promise<FacePoseSample | null>;
  shouldCancel: () => boolean;
  onUpdate?: (update: PoseMatchUpdate) => void;
  mirrorYaw?: boolean;
}): Promise<boolean> {
  const emptySample: FacePoseSample = { faceDetected: false, yawScore: 0, confidence: 0 };
  const mirror = options.mirrorYaw ?? true;

  if (options.shouldCancel()) return false;
  await delay(STEP_SETTLE_MS);

  let smoothed: FacePoseSample | null = null;
  let lockProgress = 0;
  const alignDeadline = Date.now() + STEP_ALIGN_MS;

  while (Date.now() < alignDeadline) {
    if (options.shouldCancel()) return false;

    const loopStart = Date.now();
    const raw = normalizePoseSample((await options.samplePose()) ?? emptySample, mirror);
    smoothed = smoothPoseSample(smoothed, raw);

    const frameProgress = getPoseAlignmentProgress(options.pose, smoothed);
    if (frameProgress >= 0.68) {
      lockProgress = Math.min(1, lockProgress + 0.36);
    } else if (frameProgress >= 0.42) {
      lockProgress = Math.min(1, lockProgress + 0.2);
    } else {
      lockProgress = Math.max(0, lockProgress - 0.08);
    }

    const stable = lockProgress >= POSE_LOCK_THRESHOLD;
    const matched = lockProgress >= 0.32 || frameProgress >= 0.4;
    options.onUpdate?.({
      phase: 'align',
      matched,
      stable,
      progress: Math.max(lockProgress, frameProgress * 0.72),
      sample: smoothed,
    });

    if (stable) {
      await delay(140);
      return true;
    }

    const elapsed = Date.now() - loopStart;
    await delay(Math.max(50, POSE_POLL_MS - elapsed));
  }

  for (const sec of [3, 2, 1] as const) {
    if (options.shouldCancel()) return false;
    options.onUpdate?.({
      phase: 'countdown',
      matched: true,
      stable: true,
      progress: 1,
      sample: smoothed ?? emptySample,
      countdown: sec,
    });
    await delay(COUNTDOWN_TICK_MS);
  }

  return true;
}

/** @deprecated Use waitForStepAutoCapture */
export async function waitForPoseMatch(options: {
  pose: FacePoseId;
  samplePose: () => Promise<FacePoseSample | null>;
  shouldCancel: () => boolean;
  onUpdate?: (update: PoseMatchUpdate) => void;
  pollMs?: number;
  maxWaitMs?: number;
}): Promise<boolean> {
  return waitForStepAutoCapture({
    pose: options.pose,
    samplePose: options.samplePose,
    shouldCancel: options.shouldCancel,
    onUpdate: options.onUpdate,
  });
}
