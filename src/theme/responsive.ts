import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout } from '@/theme/layout';
import { spacing, touchTarget } from '@/theme/spacing';

export const FACE_OVAL_BASE_WIDTH = 280;
export const FACE_OVAL_BASE_HEIGHT = 380;
export const FACE_OVAL_ASPECT = FACE_OVAL_BASE_HEIGHT / FACE_OVAL_BASE_WIDTH;

export type FaceOvalSize = {
  width: number;
  height: number;
  scale: number;
  compact: boolean;
};

export type CameraScanLayout = {
  oval: FaceOvalSize;
  hintMaxWidth: number;
  hintFontSize: number;
  guideTop: number;
  guideBottom: number;
  shutter: { outer: number; inner: number; core: number; dot: number };
  controlsGap: number;
  compact: boolean;
  scale: number;
};

function computeFaceOvalSize(params: {
  screenW: number;
  screenH: number;
  topReserved: number;
  bottomReserved: number;
  maxWidth?: number;
  sideInset?: number;
}): FaceOvalSize {
  const {
    screenW,
    screenH,
    topReserved,
    bottomReserved,
    maxWidth = FACE_OVAL_BASE_WIDTH,
    sideInset = spacing.base * 2 + 20,
  } = params;

  const availableW = Math.max(0, screenW - sideInset);
  const availableH = Math.max(0, screenH - topReserved - bottomReserved);

  let width = Math.min(maxWidth, Math.round(availableW * 0.92));
  let height = Math.round(width * FACE_OVAL_ASPECT);

  const maxHeight = Math.max(196, Math.floor(availableH * 0.88));
  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height / FACE_OVAL_ASPECT);
  }

  width = Math.max(196, Math.min(width, maxWidth));
  height = Math.max(Math.round(196 * FACE_OVAL_ASPECT), height);

  const scale = width / FACE_OVAL_BASE_WIDTH;
  const compact = screenH < 700 || screenW < 360;

  return { width, height, scale, compact };
}

/** Width available inside standard screen horizontal padding. */
export function useContentWidth(extraInset = 0): number {
  const { width } = useWindowDimensions();
  return Math.max(0, width - layout.screenPaddingX * 2 - extraInset);
}

/**
 * Horizontal carousel card width with a visible peek of the next card.
 * Works across phone sizes — never consumes the full content area.
 */
export function useCarouselCardWidth(peek = 72, maxWidth = 268): number {
  const contentWidth = useContentWidth();
  return useMemo(
    () => Math.min(maxWidth, Math.max(220, Math.round(contentWidth - peek))),
    [contentWidth, maxWidth, peek],
  );
}

/** @deprecated Use useCarouselCardWidth — kept for older call sites */
export function useHorizontalCardWidth(max = 268, ratio = 0.72): number {
  const contentWidth = useContentWidth();
  return useMemo(
    () => Math.min(max, Math.max(220, Math.round(contentWidth * ratio))),
    [contentWidth, max, ratio],
  );
}

/** Review carousel cards — compact uses a smaller peek on dense layouts. */
export function useReviewCardWidth(compact = false): number {
  return useCarouselCardWidth(compact ? 44 : 72, compact ? 280 : 268);
}

/** Face map dimensions scaled to screen width. */
export function useFaceMapSize(maxWidth = 280): { width: number; height: number } {
  const { width: screenWidth } = useWindowDimensions();
  return useMemo(() => {
    const contentWidth = Math.max(0, screenWidth - layout.screenPaddingX * 2 - spacing.xl * 2);
    const width = Math.min(maxWidth, Math.round(contentWidth * 0.92));
    const height = Math.round(width * 1.27);
    return { width, height };
  }, [screenWidth, maxWidth]);
}

/** Face-scan oval scaled to viewport — keeps aspect ratio on all phones. */
export function useFaceOvalSize(options?: {
  topReserved?: number;
  bottomReserved?: number;
  maxWidth?: number;
  sideInset?: number;
}): FaceOvalSize {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(
    () =>
      computeFaceOvalSize({
        screenW,
        screenH,
        topReserved: (options?.topReserved ?? 0) + insets.top,
        bottomReserved: (options?.bottomReserved ?? 0) + insets.bottom,
        maxWidth: options?.maxWidth,
        sideInset: options?.sideInset,
      }),
    [
      insets.bottom,
      insets.top,
      options?.bottomReserved,
      options?.maxWidth,
      options?.sideInset,
      options?.topReserved,
      screenH,
      screenW,
    ],
  );
}

/** Camera overlay layout — oval, hint, and controls sized for the current device. */
export function useCameraScanLayout(scanActive: boolean): CameraScanLayout {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const topBar = insets.top + spacing.base + 48;
    const hintBlock = 48;
    const stepBadge = scanActive ? 34 : 0;
    const guideTracks = 40;
    const footerBlock =
      Math.max(insets.bottom, spacing.xl) + spacing.lg + 84 + spacing.xl + 52;

    const guideTop = topBar + hintBlock;
    const guideBottom = footerBlock + stepBadge + guideTracks + insets.bottom;

    const oval = computeFaceOvalSize({
      screenW,
      screenH,
      topReserved: guideTop + insets.top,
      bottomReserved: guideBottom,
      sideInset: spacing.base * 2 + 16,
    });

    const uiScale = Math.max(0.8, Math.min(1, oval.scale));

    return {
      oval,
      hintMaxWidth: Math.min(screenW - spacing.base * 2, oval.width + spacing.lg * 2),
      hintFontSize: oval.compact ? 12 : 13,
      guideTop,
      guideBottom,
      shutter: {
        outer: Math.round(84 * uiScale),
        inner: Math.round(66 * uiScale),
        core: Math.round(54 * uiScale),
        dot: Math.max(8, Math.round(10 * uiScale)),
      },
      controlsGap: Math.round(spacing.xxl * 1.65 * uiScale),
      compact: oval.compact,
      scale: uiScale,
    };
  }, [insets.bottom, insets.top, scanActive, screenH, screenW]);
}

/** Analyzing screen frame — matches camera oval proportions. */
export function useAnalyzingFrameSize(): {
  width: number;
  height: number;
  progressWidth: number;
} {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const topReserved = insets.top + touchTarget + spacing.xl;
    const bottomReserved = insets.bottom + 120;
    const oval = computeFaceOvalSize({
      screenW,
      screenH,
      topReserved,
      bottomReserved,
      maxWidth: 320,
      sideInset: spacing.base * 2,
    });
    return {
      width: oval.width,
      height: oval.height,
      progressWidth: Math.min(screenW - spacing.base * 2, oval.width),
    };
  }, [insets.bottom, insets.top, screenH, screenW]);
}
