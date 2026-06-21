import * as ImageManipulator from 'expo-image-manipulator';

import type { AngleImageUris } from '@/types/scanPipeline';

const MAX_WIDTH = 768;
const JPEG_QUALITY = 0.82;

async function encodeOne(uri: string): Promise<string | null> {
  try {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: MAX_WIDTH } }],
      {
        compress: JPEG_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      },
    );
    return manipulated.base64 ?? null;
  } catch {
    return null;
  }
}

/** Resize scan photos and return base64 JPEG (no data-uri prefix). */
export async function encodeScanImagesForGemini(
  uris: AngleImageUris,
  frontFallback: string,
): Promise<{ front?: string; right?: string; left?: string }> {
  const frontUri = uris.front ?? frontFallback;
  const [front, right, left] = await Promise.all([
    encodeOne(frontUri),
    uris.right ? encodeOne(uris.right) : Promise.resolve(null),
    uris.left ? encodeOne(uris.left) : Promise.resolve(null),
  ]);

  return {
    front: front ?? undefined,
    right: right ?? undefined,
    left: left ?? undefined,
  };
}
