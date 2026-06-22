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

const CAPTURE_STEP_TITLE_KEYS: Record<FacePoseId, TranslationKey> = {
  front: 'scan.captureStepTitleFront',
  right: 'scan.captureStepTitleRight',
  left: 'scan.captureStepTitleLeft',
};

const CAPTURE_EMPHASIS_KEYS: Record<FacePoseId, TranslationKey> = {
  front: 'scan.captureEmphasisFront',
  right: 'scan.captureEmphasisRight',
  left: 'scan.captureEmphasisLeft',
};

export type CapturePhotos = Partial<Record<FacePoseId, string>>;

export function getCurrentCapturePose(stepIndex: number): FacePoseId {
  return CAPTURE_POSE_SEQUENCE[Math.min(stepIndex, CAPTURE_POSE_SEQUENCE.length - 1)];
}

export function getCaptureHintKey(stepIndex: number): TranslationKey {
  return CAPTURE_HINT_KEYS[getCurrentCapturePose(stepIndex)];
}

export function getCaptureStepTitleKey(stepIndex: number): TranslationKey {
  return CAPTURE_STEP_TITLE_KEYS[getCurrentCapturePose(stepIndex)];
}

export function getCaptureEmphasisKey(stepIndex: number): TranslationKey {
  return CAPTURE_EMPHASIS_KEYS[getCurrentCapturePose(stepIndex)];
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

/** Brief pause between steps after a photo is taken */
export const POSE_TRANSITION_MS = 280;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
