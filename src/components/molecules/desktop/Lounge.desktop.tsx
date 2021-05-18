import React from 'react';
import { Group, Rect } from 'react-konva';

export default function ClothingShop({ x, y, enableChatWindow, disableChatWindow } : { x: number, y: number, enableChatWindow: () => void, disableChatWindow: () => void }) {
  const [isBrowsing, setIsBrowsing] = React.useState(false);

  const handleMouseEnter = React.useCallback(() => {
    setIsBrowsing(true);
    enableChatWindow();
  }, [setIsBrowsing]);

  const handleMouseLeave = React.useCallback(() => {
    setIsBrowsing(false);
    disableChatWindow()
  }, [setIsBrowsing]);

  return (
    <Group x={x} y={y}>
      <Rect onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={200} height={200} fill={isBrowsing ? "lightgreen" : "grey"} />
    </Group>
  );
}