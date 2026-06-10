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
        <RadialGradient id="cameraVignette" cx="50%" cy="40%" rx="68%" ry="62%">
          <Stop offset="0%" stopColor="#000000" stopOpacity={0} />
          <Stop offset="45%" stopColor="#0B2018" stopOpacity={0.12} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0.72} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#cameraVignette)" />
    </Svg>
  );
}
