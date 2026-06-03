import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

/** Darkens edges so the face guide stays the focal point (CAMERA-Ready design). */
export function CameraVignetteOverlay() {
  const { width, height } = useWindowDimensions();

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient id="cameraVignette" cx="50%" cy="42%" rx="70%" ry="65%">
          <Stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <Stop offset="55%" stopColor="#000000" stopOpacity={0.15} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0.6} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#cameraVignette)" />
    </Svg>
  );
}
