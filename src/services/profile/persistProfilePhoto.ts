import * as FileSystem from 'expo-file-system/legacy';

import { getActiveUserScope } from '@/core/storage/userScope';

async function profileDirForUser(userScope: string): Promise<string> {
  return `${FileSystem.documentDirectory ?? ''}profile/${userScope}/`;
}

async function ensureProfileDir(userScope: string): Promise<string> {
  const dir = await profileDirForUser(userScope);
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

/** Copy a picked portrait into app documents (stays on device). */
export async function persistProfilePhoto(sourceUri: string): Promise<string> {
  const userScope = await getActiveUserScope();
  const dir = await ensureProfileDir(userScope);
  const ext = sourceUri.includes('.png') ? 'png' : 'jpg';
  const dest = `${dir}avatar-${Date.now()}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}
