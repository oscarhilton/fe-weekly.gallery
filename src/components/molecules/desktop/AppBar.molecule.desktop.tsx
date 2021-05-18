import React from 'react';
import { Group, Rect } from 'react-konva';
import Icon from "../../atoms/desktop/Icon.atom.desktop";

export default function AppBar() {
  return (
    <Group
      x={window.innerWidth / 2 - 250}
      y={window.innerHeight - 80}
    >
      <Rect
        x={0}
        y={0}
        width={500}
        height={70}
        fill="white"
        opacity={0.2}
        cornerRadius={15}
      />
      <Icon x={10} y={10} />
    </Group>
  )
}