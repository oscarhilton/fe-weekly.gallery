import React from 'react';
import { Rect, Group } from 'react-konva';
import Canvas from '../../atoms/Canvas.atom';
import AppBar from './AppBar.molecule.desktop';
import TopBar from './TopBar.molecule.desktop';
import Window from './Window.molecule.desktop';
import ClothingShop from './ClothingShop.desktop';
import Lounge from './Lounge.desktop';

export default function Desktop({ layer, stageHeight, stageWidth, updateClothing, enableChatWindow, disableChatWindow }: { layer: any, stageHeight: number, stageWidth: number, updateClothing: (chosenClothing: string) => void, enableChatWindow: () => void, disableChatWindow: () => void}) {
  return (
    <Group>
      <Window x={1500} y={50} />
      <Window x={500} y={50} />
      <ClothingShop updateClothing={updateClothing} x={40} y={40} />
      <Lounge enableChatWindow={enableChatWindow} disableChatWindow={disableChatWindow} x={2500} y={40} />
      {/* <TopBar /> */}
      {/* <AppBar /> */}
    </Group>
  )
}