import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

/** Soft gradient blobs — matches Login/Signup design */
export function AuthDecorBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  blobTop: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: colors.primaryPale,
    opacity: 0.35,
  },
  blobBottom: {
    position: 'absolute',
    bottom: 48,
    left: -96,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.accentLight,
    opacity: 0.35,
  },
});
