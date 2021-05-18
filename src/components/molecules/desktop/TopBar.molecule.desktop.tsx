import React from 'react';
import { Rect } from 'react-konva';

export default function AppBar() {
  return (
    <Rect
      x={0}
      y={0}
      width={window.innerWidth}
      height={20}
      fill="white"
      opacity={0.5}
    />
  )
}