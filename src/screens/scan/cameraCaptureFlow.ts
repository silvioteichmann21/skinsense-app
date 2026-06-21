import {
  CAPTURE_POSE_SEQUENCE,
  getCapturePhase,
  type FacePoseId,
} from '@/components/scan/facePoseScan';
import type { TranslationKey } from '@/i18n/useTranslation';

const CAPTURE_HINT_KEYS: Record<FacePoseId, TranslationKey> = {
  front: 'scan.captureFrontReady',
  right: 'scan.captureRightReady',
  left: 'scan.captureLeftReady',
};

export type CapturePhotos = Partial<Record<FacePoseId, string>>;

export function getCurrentCapturePose(stepIndex: number): FacePoseId {
  return CAPTURE_POSE_SEQUENCE[Math.min(stepIndex, CAPTURE_POSE_SEQUENCE.length - 1)];
}

export function getCaptureHintKey(stepIndex: number): TranslationKey {
  return CAPTURE_HINT_KEYS[getCurrentCapturePose(stepIndex)];
}

export function getCompletedPoses(photos: CapturePhotos): FacePoseId[] {
  return CAPTURE_POSE_SEQUENCE.filter((pose) => Boolean(photos[pose]));
}

export function isCaptureComplete(photos: CapturePhotos): boolean {
  return CAPTURE_POSE_SEQUENCE.every((pose) => Boolean(photos[pose]));
}

export function getCaptureLabelKey(stepIndex: number): TranslationKey {
  return getCapturePhase(getCurrentCapturePose(stepIndex)).labelKey;
}

export const CAPTURE_STEP_COUNT = CAPTURE_POSE_SEQUENCE.length;

/** Brief pause between poses after a photo is taken */
export const POSE_TRANSITION_MS = 420;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
