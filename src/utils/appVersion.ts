import Constants from 'expo-constants';

/** User-facing version label (e.g. 1.0.0 → 1.0). */
export function getAppVersionLabel(): string {
  const raw =
    Constants.expoConfig?.version ??
    Constants.nativeApplicationVersion ??
    '1.0.0';
  const [major, minor, patch] = raw.split('.');
  if (patch === '0' && minor !== undefined) {
    return `${major}.${minor}`;
  }
  return raw;
}
