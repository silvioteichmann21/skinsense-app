import type { TranslationKey } from '@/i18n/useTranslation';

export type FacePoseId = 'front' | 'left' | 'right';

export type FacePosePhase = {
  id: FacePoseId;
  start: number;
  end: number;
  labelKey: TranslationKey;
  hintKey: TranslationKey;
  /** Degrees — subtle oval tilt to suggest head turn */
  tiltDeg: number;
};

/** Guided camera capture order — one tap starts auto-capture for each pose */
export const CAPTURE_POSE_SEQUENCE: readonly FacePoseId[] = ['front', 'right', 'left'] as const;

/** Analysis visual timeline: 50% front · 25% left profile · 25% right profile */
export const FACE_SCAN_POSE_PHASES: FacePosePhase[] = [
  {
    id: 'front',
    start: 0,
    end: 50,
    labelKey: 'scan.poseFront',
    hintKey: 'scan.poseFrontHint',
    tiltDeg: 0,
  },
  {
    id: 'left',
    start: 50,
    end: 75,
    labelKey: 'scan.poseLeft',
    hintKey: 'scan.poseLeftHint',
    tiltDeg: -14,
  },
  {
    id: 'right',
    start: 75,
    end: 100,
    labelKey: 'scan.poseRight',
    hintKey: 'scan.poseRightHint',
    tiltDeg: 14,
  },
];

export const FACE_POSE_LOOP_MS = 8000;
const FRONT_MS = FACE_POSE_LOOP_MS * 0.5;
const LEFT_MS = FACE_POSE_LOOP_MS * 0.25;
const RIGHT_MS = FACE_POSE_LOOP_MS * 0.25;

export function getCapturePhase(poseId: FacePoseId): FacePosePhase {
  return (
    FACE_SCAN_POSE_PHASES.find((phase) => phase.id === poseId) ??
    FACE_SCAN_POSE_PHASES[0]
  );
}

export function getPosePhase(progress: number): FacePosePhase {
  const clamped = Math.min(99.999, Math.max(0, progress));
  return (
    FACE_SCAN_POSE_PHASES.find((phase) => clamped >= phase.start && clamped < phase.end) ??
    FACE_SCAN_POSE_PHASES[FACE_SCAN_POSE_PHASES.length - 1]
  );
}

/** 0–1 progress within the active pose phase */
export function getPhaseLocalProgress(progress: number): number {
  const phase = getPosePhase(progress);
  const span = phase.end - phase.start;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (progress - phase.start) / span));
}

/** Map loop timer elapsed ms → 0–100 pose progress */
export function loopElapsedToProgress(elapsedMs: number): number {
  const t = elapsedMs % FACE_POSE_LOOP_MS;
  if (t < FRONT_MS) {
    return (t / FRONT_MS) * 50;
  }
  if (t < FRONT_MS + LEFT_MS) {
    return 50 + ((t - FRONT_MS) / LEFT_MS) * 25;
  }
  return 75 + ((t - FRONT_MS - LEFT_MS) / RIGHT_MS) * 25;
}
