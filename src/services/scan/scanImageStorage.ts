import * as FileSystem from 'expo-file-system/legacy';

import { getActiveUserScope } from '@/core/storage/userScope';

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
