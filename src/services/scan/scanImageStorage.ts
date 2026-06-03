import * as FileSystem from 'expo-file-system/legacy';

const SCAN_DIR = `${FileSystem.documentDirectory ?? ''}scans/`;

async function ensureScanDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(SCAN_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(SCAN_DIR, { intermediates: true });
  }
}

/** Copy capture into app documents; raw image never leaves device via API. */
export async function persistScanImage(sourceUri: string): Promise<string> {
  await ensureScanDir();
  const id = `${Date.now()}`;
  const ext = sourceUri.includes('.png') ? 'png' : 'jpg';
  const dest = `${SCAN_DIR}${id}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}
