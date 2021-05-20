import React from 'react';
import { Rect, Group } from 'react-konva';
import Window from './Window.molecule.desktop';
import ClothingShop from './ClothingShop.desktop';
import Lounge from './Lounge.desktop';
import Theatre from './Theatre.molecule.desktop';
import FloorTile from './FloorTile.molecule.desktop';

const tiles = "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "XXXXXXGGGGGGGGGGGGGXXXXXX" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG" +
              "GGGGGGGGGGGGGGGGGGGGGGGGG";

const tilesArray = tiles.split('');
// const tilesArray = ["G"];

export default function Desktop({
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
    <Group
      rotation={30}
      scaleY={0.86}
      skewX={-0.3}
    >
      <Group opacity={theatreIsActive ? 0.1 : 1}>
        {tilesArray.map((tile: string, index: number) => {
          const numToRow = 25;
          const x = Math.floor(index % numToRow);
          const y = Math.floor(index / numToRow);

          if (tile === 'G') return <FloorTile x={x} y={y} />
          return;
        })}
        <Window x={1500} y={50} />
        <Window x={500} y={50} />
        <ClothingShop updateClothing={updateClothing} x={40} y={40} />
        <Lounge enableChatWindow={enableChatWindow} disableChatWindow={disableChatWindow} x={2500} y={40} />
      </Group>
      <Theatre x={2200} y={500} start={startTheatre} stop={stopTheatre} />
    </Group>
  )
}