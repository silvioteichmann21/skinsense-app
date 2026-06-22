import type { FacePoseId } from '@/components/scan/facePoseScan';
import type { TranslationKey } from '@/i18n/useTranslation';
import { delay } from '@/screens/scan/cameraCaptureFlow';
import {
  getPoseAlignmentProgress,
  isAcceptablePose,
  isClearlyWrongPose,
  normalizePoseSample,
  smoothPoseSample,
  type FacePoseSample,
} from '@/services/scan/facePoseDetection';

export const POSE_POLL_MS = 45;
export const STEP_SETTLE_MS = 30;
export const POSE_HOLD_MS = 15;
export const ACCEPTABLE_FRAMES = 2;
export const MAX_WAIT_MS = 1200;

const GUIDANCE_DEADZONE = 0.05;
const CLEAR_FRONT_HINT = 0.038;

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
  _progress: number,
): TranslationKey {
  if (!sample.faceDetected) {
    return 'scan.captureNoFace';
  }

  if (pose === 'front') {
    if (sample.yawScore > GUIDANCE_DEADZONE) return 'scan.captureTurnToFrontFromRight';
    if (sample.yawScore < -GUIDANCE_DEADZONE) return 'scan.captureTurnToFrontFromLeft';
    return 'scan.captureFrontReady';
  }

  if (pose === 'right') {
    if (sample.yawScore < -GUIDANCE_DEADZONE) return 'scan.captureTurnMoreRight';
    if (Math.abs(sample.yawScore) < CLEAR_FRONT_HINT) return 'scan.captureRightReady';
    return 'scan.captureRightReady';
  }

  if (sample.yawScore > GUIDANCE_DEADZONE) return 'scan.captureTurnMoreLeft';
  if (Math.abs(sample.yawScore) < CLEAR_FRONT_HINT) return 'scan.captureLeftReady';
  return 'scan.captureLeftReady';
}

/** Wait until face is visible and angle is not obviously wrong — no precise alignment. */
export async function waitForStepAutoCapture(options: {
  pose: FacePoseId;
  samplePose: () => Promise<FacePoseSample | null>;
  shouldCancel: () => boolean;
  onUpdate?: (update: PoseMatchUpdate) => void;
  mirrorYaw?: boolean;
  skipSettle?: boolean;
}): Promise<boolean> {
  const emptySample: FacePoseSample = { faceDetected: false, yawScore: 0, confidence: 0 };
  const mirror = options.mirrorYaw ?? true;

  if (options.shouldCancel()) return false;
  if (options.skipSettle !== true) {
    await delay(STEP_SETTLE_MS);
  }

  let smoothed: FacePoseSample | null = null;
  let acceptableFrames = 0;
  const deadline = Date.now() + MAX_WAIT_MS;

  while (!options.shouldCancel()) {
    const loopStart = Date.now();
    const raw = normalizePoseSample((await options.samplePose()) ?? emptySample, mirror);
    smoothed = smoothPoseSample(smoothed, raw, 0.55);

    const acceptable = isAcceptablePose(options.pose, smoothed);
    const clearlyWrong = isClearlyWrongPose(options.pose, smoothed);
    const progress = getPoseAlignmentProgress(options.pose, smoothed);

    if (acceptable) {
      acceptableFrames += 1;
    } else {
      acceptableFrames = 0;
    }

    options.onUpdate?.({
      phase: 'align',
      matched: acceptable,
      stable: acceptable && acceptableFrames >= ACCEPTABLE_FRAMES,
      progress,
      sample: smoothed,
    });

    if (acceptable && acceptableFrames >= ACCEPTABLE_FRAMES) {
      await delay(POSE_HOLD_MS);
      if (options.shouldCancel()) return false;
      return true;
    }

    if (Date.now() >= deadline && smoothed.faceDetected && !clearlyWrong) {
      return true;
    }

    const elapsed = Date.now() - loopStart;
    await delay(Math.max(8, POSE_POLL_MS - elapsed));
  }

  return false;
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
