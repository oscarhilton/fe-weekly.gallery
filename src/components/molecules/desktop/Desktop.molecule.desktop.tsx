import React from 'react';
import { Rect, Group } from 'react-konva';
import Window from './Window.molecule.desktop';
import ClothingShop from './ClothingShop.desktop';
import Lounge from './Lounge.desktop';
import Theatre from './Theatre.molecule.desktop';

export default function Desktop({
  layer,
  stageHeight,
  stageWidth,
  updateClothing,
  enableChatWindow,
  disableChatWindow,
  startTheatre,
  stopTheatre,
  theatreIsActive,
}: {
  layer: any,
  stageHeight:
  number,
  stageWidth:
  number,
  updateClothing: (chosenClothing:string) => void,
  enableChatWindow: () => void,
  disableChatWindow: () => void,
  startTheatre: () => void,
  stopTheatre: () => void,
  theatreIsActive: boolean,
})
  {
  return (
    <Group>
      <Group opacity={theatreIsActive ? 0.1 : 1}>
        <Window x={1500} y={50} />
        <Window x={500} y={50} />
        <ClothingShop updateClothing={updateClothing} x={40} y={40} />
        <Lounge enableChatWindow={enableChatWindow} disableChatWindow={disableChatWindow} x={2500} y={40} />
      </Group>
      <Theatre x={2200} y={500} start={startTheatre} stop={stopTheatre} />
    </Group>
  )
}