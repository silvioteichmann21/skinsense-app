import type { FacePoseId } from '@/components/scan/facePoseScan';
import {
  CAPTURE_STEP_COUNT,
  delay,
  getCurrentCapturePose,
  POSE_TRANSITION_MS,
  type CapturePhotos,
} from '@/screens/scan/cameraCaptureFlow';
import {
  getPoseGuidanceKey,
  waitForStepAutoCapture,
  type PoseMatchUpdate,
} from '@/screens/scan/waitForPoseMatch';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  analyzeFacePoseFromUri,
  analyzeFacePoseSampleBase64,
  isAcceptablePose,
  normalizePoseSample,
  type FacePoseSample,
} from '@/services/scan/facePoseDetection';

export type CapturePhotoResult = {
  uri: string;
  base64?: string | null;
};

export type AutoScanSessionCallbacks = {
  onStep: (step: number, pose: FacePoseId) => void;
  onPoseUpdate: (pose: FacePoseId, update: PoseMatchUpdate, guidanceKey: TranslationKey) => void;
  onStepCaptured: (pose: FacePoseId, uri: string) => void;
};

function checkPose(
  sample: FacePoseSample | null,
  pose: FacePoseId,
  mirrorYaw: boolean,
): boolean {
  if (!sample) return false;
  return isAcceptablePose(pose, normalizePoseSample(sample, mirrorYaw));
}

export async function validateStepPhoto(
  uri: string,
  pose: FacePoseId,
  mirrorYaw: boolean,
): Promise<boolean> {
  const sample = await analyzeFacePoseFromUri(uri, true);
  return checkPose(sample, pose, mirrorYaw);
}

export function validateStepPhotoBase64(
  base64: string,
  pose: FacePoseId,
  mirrorYaw: boolean,
): boolean {
  const sample = analyzeFacePoseSampleBase64(base64);
  return checkPose(sample, pose, mirrorYaw);
}

/** Wait until angle is not obviously wrong, then capture. */
export async function runAutoCaptureForStep(options: {
  step: number;
  samplePose: () => Promise<FacePoseSample | null>;
  capturePhoto: () => Promise<CapturePhotoResult | null>;
  mirrorYaw: boolean;
  shouldCancel: () => boolean;
  onPoseUpdate?: (pose: FacePoseId, update: PoseMatchUpdate, guidanceKey: TranslationKey) => void;
}): Promise<string | null> {
  const pose = getCurrentCapturePose(options.step);

  const ready = await waitForStepAutoCapture({
    pose,
    mirrorYaw: options.mirrorYaw,
    samplePose: options.samplePose,
    shouldCancel: options.shouldCancel,
    skipSettle: options.step > 0,
    onUpdate: (update) => {
      options.onPoseUpdate?.(
        pose,
        update,
        getPoseGuidanceKey(pose, update.sample, update.progress),
      );
    },
  });

  if (!ready || options.shouldCancel()) {
    return null;
  }

  const captured = await options.capturePhoto();
  if (!captured?.uri || options.shouldCancel()) {
    return null;
  }

  if (captured.base64 && validateStepPhotoBase64(captured.base64, pose, options.mirrorYaw)) {
    return captured.uri;
  }

  if (await validateStepPhoto(captured.uri, pose, options.mirrorYaw)) {
    return captured.uri;
  }

  return null;
}

export async function runAutoScanSession(options: {
  samplePose: () => Promise<FacePoseSample | null>;
  capturePhoto: () => Promise<CapturePhotoResult | null>;
  mirrorYaw: boolean;
  shouldCancel: () => boolean;
  callbacks: AutoScanSessionCallbacks;
}): Promise<CapturePhotos | null> {
  const photos: CapturePhotos = {};

  for (let step = 0; step < CAPTURE_STEP_COUNT; step++) {
    if (options.shouldCancel()) return null;

    const pose = getCurrentCapturePose(step);
    options.callbacks.onStep(step, pose);

    const uri = await runAutoCaptureForStep({
      step,
      mirrorYaw: options.mirrorYaw,
      samplePose: options.samplePose,
      capturePhoto: options.capturePhoto,
      shouldCancel: options.shouldCancel,
      onPoseUpdate: (p, update, guidanceKey) => {
        options.callbacks.onPoseUpdate(p, update, guidanceKey);
      },
    });

    if (!uri || options.shouldCancel()) {
      return null;
    }

    photos[pose] = uri;
    options.callbacks.onStepCaptured(pose, uri);

    if (step < CAPTURE_STEP_COUNT - 1) {
      await delay(POSE_TRANSITION_MS);
    }
  }

  if (!photos.front || !photos.right || !photos.left) {
    return null;
  }

  return photos;
}
