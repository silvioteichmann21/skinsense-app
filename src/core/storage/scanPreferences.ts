import AsyncStorage from '@react-native-async-storage/async-storage';

const SKIP_SCAN_TIPS_KEY = 'skinsense.skip_scan_tips';

export async function getSkipScanTips(): Promise<boolean> {
  const value = await AsyncStorage.getItem(SKIP_SCAN_TIPS_KEY);
  return value === 'true';
}

export async function setSkipScanTips(skip: boolean): Promise<void> {
  if (skip) {
    await AsyncStorage.setItem(SKIP_SCAN_TIPS_KEY, 'true');
  } else {
    await AsyncStorage.removeItem(SKIP_SCAN_TIPS_KEY);
  }
}
