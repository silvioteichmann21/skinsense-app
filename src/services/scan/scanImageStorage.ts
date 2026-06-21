import * as FileSystem from 'expo-file-system/legacy';

import { getActiveUserScope } from '@/core/storage/userScope';
import type { AngleImageUris } from '@/types/scanPipeline';

async function scanDirForUser(userScope: string): Promise<string> {
  return `${FileSystem.documentDirectory ?? ''}scans/${userScope}/`;
}

async function ensureScanDir(userScope: string): Promise<string> {
  const dir = await scanDirForUser(userScope);
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

/** Copy capture into app documents; raw image never leaves device via API. */
export async function persistScanImage(sourceUri: string): Promise<string> {
  const userScope = await getActiveUserScope();
  const scanDir = await ensureScanDir(userScope);
  const id = `${Date.now()}`;
  const ext = sourceUri.includes('.png') ? 'png' : 'jpg';
  const dest = `${scanDir}${id}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}

/** Remove on-device scan photos for one history record. */
export async function deleteScanImageFiles(record: {
  imageUri: string;
  angleImageUris?: AngleImageUris;
}): Promise<void> {
  const uris = new Set<string>();
  if (record.imageUri.includes('/scans/')) {
    uris.add(record.imageUri);
  }
  if (record.angleImageUris) {
    for (const uri of Object.values(record.angleImageUris)) {
      if (uri?.includes('/scans/')) {
        uris.add(uri);
      }
    }
  }

  await Promise.all(
    [...uris].map(async (uri) => {
      try {
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }
      } catch {
        // Best-effort cleanup only.
      }
    }),
  );
}
