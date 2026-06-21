import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

type Props = {
  size?: number;
};

export function SkinSenseMark({ size = 72 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Defs>
        <RadialGradient
          id="markBackdrop"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(32 24) rotate(48) scale(78)"
        >
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.98" />
          <Stop offset="0.48" stopColor="#EAF7EF" stopOpacity="0.94" />
          <Stop offset="1" stopColor="#153B2C" stopOpacity="0.92" />
        </RadialGradient>
        <LinearGradient
          id="markDrop"
          x1="30"
          y1="14"
          x2="78"
          y2="84"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#E7FFFA" />
          <Stop offset="0.46" stopColor="#8EE8D6" />
          <Stop offset="1" stopColor="#1E7669" />
        </LinearGradient>
        <LinearGradient
          id="markLeaf"
          x1="21"
          y1="20"
          x2="63"
          y2="82"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#DBF9C9" />
          <Stop offset="0.5" stopColor="#73C88B" />
          <Stop offset="1" stopColor="#1F5D42" />
        </LinearGradient>
        <LinearGradient
          id="markFace"
          x1="45"
          y1="24"
          x2="64"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFFDF3" />
          <Stop offset="1" stopColor="#F0E4C9" />
        </LinearGradient>
      </Defs>

      <Circle cx="48" cy="48" r="44" fill="#52B788" opacity="0.16" />
      <Circle
        cx="48"
        cy="48"
        r="39"
        fill="url(#markBackdrop)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.4"
      />

      <G>
        <Path
          d="M50.2 13.8C63.9 30.5 75.8 43.9 75.8 60.3C75.8 76.2 64.4 87 49.3 87C34.6 87 23.1 76.7 23.1 60.4C23.1 43.9 36.1 30.1 50.2 13.8Z"
          fill="url(#markDrop)"
          stroke="#D8FFF8"
          strokeWidth="1.35"
        />
        <Path
          d="M49.1 14.4C32.5 20.8 21.1 35.3 20.2 52.6C19.3 70.1 31.6 82.6 51.7 84.8C43.4 72.7 41.5 58.9 46 43.5C49.1 32.8 53.1 22.8 49.1 14.4Z"
          fill="url(#markLeaf)"
          stroke="#E7FFD8"
          strokeWidth="1.35"
        />
        <Path
          d="M49.5 21.4C43 28.5 39.6 36.5 39.6 44.8C39.6 51.8 43.4 56.2 49.3 59.9C53.3 62.4 53.5 67.6 45.9 72.5C59.6 71.6 68.4 64.5 68.4 54.4C68.4 48 62.5 44.4 59.1 38.7C55.5 32.8 54.1 25.8 49.5 21.4Z"
          fill="url(#markFace)"
          opacity="0.98"
        />
        <Path
          d="M44.4 32.4C35 42.1 29.9 53.8 29.2 67.6"
          stroke="#E6F6D8"
          strokeWidth="1.65"
          strokeLinecap="round"
          opacity="0.72"
        />
        <Path
          d="M53.1 41.3C56 43.1 59.2 43.9 63 43.6"
          stroke="#244F48"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <Path
          d="M51.2 56.4C55 58.5 58.8 58.5 62.7 56.4"
          stroke="#244F48"
          strokeWidth="1.35"
          strokeLinecap="round"
          opacity="0.4"
        />
      </G>

      <Path
        d="M72.6 20.4L74.6 24.7L79 26.6L74.6 28.6L72.6 32.9L70.6 28.6L66.3 26.6L70.6 24.7L72.6 20.4Z"
        fill="#F5C842"
        opacity="0.9"
      />
      <Path
        d="M27.1 18.8L28.4 21.5L31.2 22.8L28.4 24L27.1 26.8L25.8 24L23 22.8L25.8 21.5L27.1 18.8Z"
        fill="#FFFFFF"
        opacity="0.76"
      />
    </Svg>
  );
}
