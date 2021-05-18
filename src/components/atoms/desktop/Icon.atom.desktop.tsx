import React from 'react';
import { Circle } from 'react-konva';

export default function Icon({ x, y } : { x: number, y: number }) {
  return (
    <Circle
      x={x + 25}
      y={y + 25}
      radius={25}
      fill="white"
    />
  )
}