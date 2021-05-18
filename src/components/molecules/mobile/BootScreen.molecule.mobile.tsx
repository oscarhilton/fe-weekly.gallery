import React from 'react';
import { Rect } from 'react-konva';

export default function BootScreen() {
  return (
   <>
    <Rect
      x={0}
      y={0}
      width={window.innerWidth}
      height={window.innerHeight}
      fill="white"
    />
    <Rect
      x={window.innerWidth / 2 - 80 / 2}
      y={window.innerHeight / 2 - 80 / 2}
      width={80}
      height={80}
      fill="black"
    />
   </> 
  )
}
