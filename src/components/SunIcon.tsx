import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';
import { Colors } from '../theme';

interface Props {
  size?: number;
  color?: string;
  rays?: number;
  animated?: boolean;
}

export function SunIcon({ size = 32, color = Colors.solar, rays = 8 }: Props) {
  const cx = size / 2;
  const innerR = size * 0.22;
  const rayStart = size * 0.3;
  const rayEnd = size * 0.44;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cx} cy={cx} r={innerR} fill={color} />
      {Array.from({ length: rays }, (_, i) => {
        const deg = (i / rays) * 360;
        const rad = (deg - 90) * (Math.PI / 180);
        return (
          <Line
            key={i}
            x1={cx + rayStart * Math.cos(rad)}
            y1={cx + rayStart * Math.sin(rad)}
            x2={cx + rayEnd * Math.cos(rad)}
            y2={cx + rayEnd * Math.sin(rad)}
            stroke={color}
            strokeWidth={size * 0.07}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>
  );
}
