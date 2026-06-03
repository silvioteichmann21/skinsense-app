import * as ImageManipulator from 'expo-image-manipulator';

/** Crop the center face oval from a camera capture before analysis. */
export async function prepareFaceScanImage(sourceUri: string): Promise<string> {
  const probe = await ImageManipulator.manipulateAsync(sourceUri, []);
  const width = probe.width ?? 1;
  const height = probe.height ?? 1;

  const cropWidth = Math.min(width, Math.round(width * 0.74));
  const cropHeight = Math.min(height, Math.round(height * 0.62));
  const originX = Math.max(0, Math.round((width - cropWidth) / 2));
  const originY = Math.max(0, Math.round(height * 0.1));

  const cropped = await ImageManipulator.manipulateAsync(
    sourceUri,
    [
      {
        crop: {
          originX,
          originY,
          width: cropWidth,
          height: cropHeight,
        },
      },
    ],
    {
      compress: 0.92,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  return cropped.uri;
}
