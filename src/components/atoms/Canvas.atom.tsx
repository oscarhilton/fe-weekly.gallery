import React from 'react';
import { Image } from 'react-konva';

export default function Canvas({ canvas, width, height }: { canvas: HTMLCanvasElement, width: number, height: number}) {
  return <Image image={canvas} width={width} height={height}/>
}
