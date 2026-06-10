import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/core/navigation/types';
import { pickFacePhotoFromGallery } from '@/screens/scan/pickFacePhoto';
import { persistScanImage } from '@/services/scan/scanImageStorage';
import { useSkinStore } from '@/store/skinStore';

type ScanNav = Pick<NativeStackNavigationProp<RootStackParamList>, 'replace'>;

export type GalleryScanResult =
  | { status: 'success' }
  | { status: 'cancelled' }
  | { status: 'denied'; canAskAgain: boolean }
  | { status: 'error' };

export async function startScanFromGallery(navigation: ScanNav): Promise<GalleryScanResult> {
  const result = await pickFacePhotoFromGallery();

  if (result.status === 'cancelled') {
    return { status: 'cancelled' };
  }

  if (result.status === 'denied') {
    return { status: 'denied', canAskAgain: result.canAskAgain };
  }

  try {
    const storedUri = await persistScanImage(result.uri);
    useSkinStore.getState().setScanImage(storedUri);
    navigation.replace('Analyzing', { imageUri: storedUri });
    return { status: 'success' };
  } catch {
    return { status: 'error' };
  }
}
