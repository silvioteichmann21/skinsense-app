/** Ensures `extra` (Supabase keys, API URL, RevenueCat) is available in Expo Go and dev builds. */
const appJson = require('./app.json');

const plugins = [...(appJson.expo.plugins ?? [])];

if (!plugins.some((p) => p === 'react-native-fast-tflite' || p?.[0] === 'react-native-fast-tflite')) {
  plugins.push([
    'react-native-fast-tflite',
    { enableCoreMLDelegate: true, enableAndroidGpuLibraries: true },
  ]);
}

module.exports = {
  expo: {
    ...appJson.expo,
    plugins,
    extra: {
      ...appJson.expo.extra,
      REVENUECAT_IOS_API_KEY:
        process.env.REVENUECAT_IOS_API_KEY ?? appJson.expo.extra.REVENUECAT_IOS_API_KEY,
      REVENUECAT_ANDROID_API_KEY:
        process.env.REVENUECAT_ANDROID_API_KEY ?? appJson.expo.extra.REVENUECAT_ANDROID_API_KEY,
      REVENUECAT_ENTITLEMENT_ID:
        process.env.REVENUECAT_ENTITLEMENT_ID ?? appJson.expo.extra.REVENUECAT_ENTITLEMENT_ID,
    },
  },
};
