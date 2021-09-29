import React from 'react';
import { Rect, Group } from 'react-konva';

const TILE_SIZE = 150;

export default function FloorTile({ x, y }: { x: number, y: number }) {
  return (
    <>
      <Rect
        width={TILE_SIZE}
        height={TILE_SIZE}
        x={x * TILE_SIZE}
        y={y * TILE_SIZE}
        isGround
        fill={'#f1f1f1'}
        closed
      />
    </>
  )
}