import * as ImagePicker from 'expo-image-picker';

export type GalleryPickResult =
  | { status: 'success'; uri: string }
  | { status: 'cancelled' }
  | { status: 'denied'; canAskAgain: boolean };

export async function requestGalleryPermission(): Promise<{
  granted: boolean;
  canAskAgain: boolean;
}> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return { granted: permission.granted, canAskAgain: permission.canAskAgain };
}

type PickOptions = {
  aspect?: [number, number];
};

/** Pick a face photo from the library for the same on-device analysis pipeline as the camera. */
export async function pickFacePhotoFromGallery(
  options?: PickOptions,
): Promise<GalleryPickResult> {
  const { granted, canAskAgain } = await requestGalleryPermission();
  if (!granted) {
    return { status: 'denied', canAskAgain };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: options?.aspect ?? [3, 4],
    quality: 0.92,
    selectionLimit: 1,
  });

  if (result.canceled || !result.assets[0]?.uri) {
    return { status: 'cancelled' };
  }

  return { status: 'success', uri: result.assets[0].uri };
}
