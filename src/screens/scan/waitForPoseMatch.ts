import type { FacePoseId } from '@/components/scan/facePoseScan';
import type { TranslationKey } from '@/i18n/useTranslation';
import { delay } from '@/screens/scan/cameraCaptureFlow';
import {
  getPoseAlignmentProgress,
  smoothPoseSample,
  type FacePoseSample,
} from '@/services/scan/facePoseDetection';

export const POSE_POLL_MS = 420;
export const POSE_LOCK_THRESHOLD = 0.88;
export const POSE_MAX_WAIT_MS = 60_000;

const GUIDANCE_DEADZONE = 0.045;
const PROFILE_OVERSHOOT = 0.24;

export type PoseMatchUpdate = {
  matched: boolean;
  stable: boolean;
  progress: number;
  sample: FacePoseSample;
};

export function getPoseGuidanceKey(
  pose: FacePoseId,
  sample: FacePoseSample,
  progress: number,
): TranslationKey {
  if (!sample.faceDetected) {
    return 'scan.captureNoFace';
  }

  if (progress >= 0.55 && progress < POSE_LOCK_THRESHOLD) {
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

export async function waitForPoseMatch(options: {
  pose: FacePoseId;
  samplePose: () => Promise<FacePoseSample | null>;
  shouldCancel: () => boolean;
  onUpdate?: (update: PoseMatchUpdate) => void;
  pollMs?: number;
  maxWaitMs?: number;
}): Promise<boolean> {
  const pollMs = options.pollMs ?? POSE_POLL_MS;
  const maxWaitMs = options.maxWaitMs ?? POSE_MAX_WAIT_MS;
  const emptySample: FacePoseSample = { faceDetected: false, yawScore: 0, confidence: 0 };

  let smoothed: FacePoseSample | null = null;
  let lockProgress = 0;
  const startedAt = Date.now();

  while (Date.now() - startedAt < maxWaitMs) {
    if (options.shouldCancel()) return false;

    const loopStart = Date.now();
    const raw = (await options.samplePose()) ?? emptySample;
    smoothed = smoothPoseSample(smoothed, raw);

    const frameProgress = getPoseAlignmentProgress(options.pose, smoothed);
    if (frameProgress >= 0.72) {
      lockProgress = Math.min(1, lockProgress + 0.34);
    } else if (frameProgress >= 0.45) {
      lockProgress = Math.min(1, lockProgress + 0.18);
    } else {
      lockProgress = Math.max(0, lockProgress - 0.1);
    }

    const stable = lockProgress >= POSE_LOCK_THRESHOLD;
    const matched = lockProgress >= 0.4;
    options.onUpdate?.({
      matched,
      stable,
      progress: Math.max(lockProgress, frameProgress * 0.65),
      sample: smoothed,
    });

    if (stable) {
      await delay(280);
      return true;
    }

    const elapsed = Date.now() - loopStart;
    await delay(Math.max(80, pollMs - elapsed));
  }

  return false;
}
