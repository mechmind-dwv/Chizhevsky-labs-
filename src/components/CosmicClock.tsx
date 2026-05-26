import React from 'react';
import Svg, {
  Circle, Line, Text as SvgText, Path, Polygon, Defs,
  RadialGradient, Stop, Filter, FeGaussianBlur, FeMerge, FeMergeNode,
} from 'react-native-svg';

interface Props {
  size?: number;
  solarYear: number;    // 0–11
  lunarDay: number;     // 0–29.5
  hourOfDay: number;    // 0–24
}

const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);

export function CosmicClock({ size = 280, solarYear, lunarDay, hourOfDay }: Props) {
  const cx = size / 2;
  const cy = size / 2;

  const rSolar = size * 0.43;
  const rLunar = size * 0.30;
  const rCirc = size * 0.16;

  const solarAngle = (solarYear / 11) * 360;
  const lunarAngle = (lunarDay / 29.5) * 360;
  const circAngle = (hourOfDay / 24) * 360;

  function dotPos(r: number, angleDeg: number) {
    const rad = toRad(angleDeg);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const solarDot = dotPos(rSolar, solarAngle);
  const lunarDot = dotPos(rLunar, lunarAngle);
  const circDot = dotPos(rCirc, circAngle);

  // Day sector path (top half = day)
  const dayArcR = rCirc;
  const d1x = cx + dayArcR * Math.cos(toRad(0));
  const d1y = cy + dayArcR * Math.sin(toRad(0));
  const d2x = cx + dayArcR * Math.cos(toRad(180));
  const d2y = cy + dayArcR * Math.sin(toRad(180));

  // Tick marks for solar ring (11 years)
  const solarTicks = Array.from({ length: 11 }, (_, i) => {
    const deg = (i / 11) * 360;
    const inner = dotPos(rSolar - size * 0.04, deg);
    const outer = dotPos(rSolar + size * 0.04, deg);
    return { inner, outer, active: i === Math.floor(solarYear) };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFD700" stopOpacity="0.06" />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Background glow */}
      <Circle cx={cx} cy={cy} r={size * 0.48} fill="url(#bgGlow)" />

      {/* ── Solar Ring (outer) ── */}
      <Circle cx={cx} cy={cy} r={rSolar} fill="none" stroke="#FFD700" strokeWidth={0.5} strokeOpacity={0.25} strokeDasharray="3 6" />
      {solarTicks.map((t, i) => (
        <Line
          key={i}
          x1={t.inner.x} y1={t.inner.y}
          x2={t.outer.x} y2={t.outer.y}
          stroke="#FFD700"
          strokeWidth={t.active ? 2.5 : 1}
          strokeOpacity={t.active ? 0.9 : 0.3}
        />
      ))}
      <Circle cx={solarDot.x} cy={solarDot.y} r={size * 0.03} fill="#FFD700" opacity={0.95} />

      {/* ── Lunar Ring (middle) ── */}
      <Circle cx={cx} cy={cy} r={rLunar} fill="none" stroke="#C0C0C0" strokeWidth={0.5} strokeOpacity={0.2} strokeDasharray="2 5" />
      <Circle cx={lunarDot.x} cy={lunarDot.y} r={size * 0.022} fill="#E8E8FF" opacity={0.85} />

      {/* ── Circadian Ring (inner) ── */}
      {/* Night sector */}
      <Path
        d={`M${cx},${cy} L${d2x},${d2y} A${dayArcR},${dayArcR} 0 0,1 ${d1x},${d1y} Z`}
        fill="#1a1a4e" fillOpacity={0.45}
      />
      {/* Day sector */}
      <Path
        d={`M${cx},${cy} L${d1x},${d1y} A${dayArcR},${dayArcR} 0 0,1 ${d2x},${d2y} Z`}
        fill="#FFD700" fillOpacity={0.07}
      />
      <Circle cx={cx} cy={cy} r={rCirc} fill="none" stroke="#00BFFF" strokeWidth={0.5} strokeOpacity={0.3} />
      <Circle cx={circDot.x} cy={circDot.y} r={size * 0.018} fill="#00BFFF" opacity={0.9} />

      {/* Center */}
      <Circle cx={cx} cy={cy} r={size * 0.015} fill="#FFD700" />

      {/* Labels */}
      <SvgText
        x={cx} y={cy - rSolar - size * 0.07}
        textAnchor="middle" fill="#FFD700" fontSize={size * 0.033}
        fontFamily="Courier" opacity={0.7}
      >
        SOLAR 11a
      </SvgText>
      <SvgText
        x={cx} y={cy - rLunar - size * 0.04}
        textAnchor="middle" fill="#C0C0C0" fontSize={size * 0.028}
        fontFamily="Courier" opacity={0.6}
      >
        LUNAR 29.5d
      </SvgText>
    </Svg>
  );
}
