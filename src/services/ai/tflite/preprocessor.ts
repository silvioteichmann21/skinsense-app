import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** NHWC float32 tensor normalized to [0, 1] for skin_analysis_v1.tflite. */
export async function preprocessFaceForTflite(
  imageUri: string,
  size = 224,
): Promise<Float32Array> {
  const manipulated = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: size, height: size } }],
    {
      compress: 0.92,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    },
  );

  if (!manipulated.base64) {
    throw new Error('preprocess_failed');
  }

  const bytes = base64ToUint8Array(manipulated.base64);
  const decoded = jpeg.decode(bytes, { useTArray: true });
  if (!decoded?.data || decoded.width !== size || decoded.height !== size) {
    throw new Error('preprocess_failed');
  }

  const { data, width, height } = decoded;
  const tensor = new Float32Array(width * height * 3);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      tensor[offset++] = (data[idx] ?? 0) / 255;
      tensor[offset++] = (data[idx + 1] ?? 0) / 255;
      tensor[offset++] = (data[idx + 2] ?? 0) / 255;
    }
  }
  return tensor;
}
