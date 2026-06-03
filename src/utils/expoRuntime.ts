import Constants, { ExecutionEnvironment } from 'expo-constants';

/** True when running inside the Expo Go app (no custom native modules). */
export function isExpoGo(): boolean {
  return Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
}

/** TFLite (react-native-fast-tflite) only works in a development or production native build. */
export function canUseNativeTflite(): boolean {
  return !isExpoGo();
}
