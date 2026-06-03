/** Ensures `extra` (Supabase keys, API URL) is available in Expo Go and dev builds. */
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
    },
  },
};
