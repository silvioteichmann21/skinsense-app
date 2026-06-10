import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react';
import type { View } from 'react-native';

export async function shareCompareProgress(params: {
  cardRef: RefObject<View | null>;
  textSummary: string;
  dialogTitle: string;
}): Promise<{ ok: boolean }> {
  const { cardRef, textSummary, dialogTitle } = params;

  try {
    if (cardRef.current) {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle,
        });
        return { ok: true };
      }

      if (Platform.OS !== 'web') {
        await Share.share({
          message: textSummary,
          url: uri,
        });
        return { ok: true };
      }
    }
  } catch {
    /* fall through to text share */
  }

  try {
    await Share.share({ message: textSummary });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
