import React from 'react';
import { Rect, Layer } from 'react-konva';

export default function HomeScreen({ layer }: { layer: any }) {
  return (
    <Rect
      x={0}
      y={0}
      width={window.innerWidth}
      height={window.innerHeight}
      fill="blue"
    />
  )
}