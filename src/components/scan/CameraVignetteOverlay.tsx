import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

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
          <Stop offset="44%" stopColor="#0B2018" stopOpacity={0.1} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0.78} />
        </RadialGradient>
        <RadialGradient id="cameraAura" cx="50%" cy="44%" rx="45%" ry="42%">
          <Stop offset="0%" stopColor="#74D4A8" stopOpacity={0.18} />
          <Stop offset="58%" stopColor="#2D6A4F" stopOpacity={0.06} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="cameraBloom" cx="50%" cy="78%" rx="56%" ry="26%">
          <Stop offset="0%" stopColor="#E879F9" stopOpacity={0.12} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#000000" stopOpacity={0.62} />
          <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#cameraAura)" />
      <Ellipse
        cx={width / 2}
        cy={height * 0.78}
        rx={width * 0.46}
        ry={height * 0.18}
        fill="url(#cameraBloom)"
      />
      <Rect x={0} y={0} width={width} height={height} fill="url(#cameraVignette)" />
      <Rect x={0} y={0} width={width} height={height * 0.28} fill="url(#topFade)" />
    </Svg>
  );
}
