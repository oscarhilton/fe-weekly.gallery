import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { SocketContext } from '../../providers/Socket.provider';

const available = [
  "😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"
]

export default function ClothingShop({ x, y, updateClothing } : { x: number, y: number, updateClothing: (chosenClothing: string) => void }) {
  const { identity } = React.useContext(SocketContext);

  const [currentClothing, setCurrentClothing] = React.useState(0);
  const [isBrowsing, setIsBrowsing] = React.useState(false);

  const chosenClothing = React.useMemo(() => available[currentClothing % available.length], [currentClothing]);

  const handleMouseEnter = React.useCallback(() => {
    setIsBrowsing(true);
  }, [setIsBrowsing]);

  const handleMouseLeave = React.useCallback(() => {
    setIsBrowsing(false);
    updateClothing(chosenClothing);
  }, [setIsBrowsing, updateClothing, chosenClothing]);

  const handleMouseWheel = React.useCallback((wheel) => {
    const amount = wheel.evt.wheelDeltaY > 0 ? 1 : -1;
    setCurrentClothing(currentClothing + amount);
  }, [setCurrentClothing, currentClothing]);

  return (
    <Group x={x} y={y}>
      <Rect onWheel={handleMouseWheel} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={200} height={200} fill={isBrowsing ? "yellow" : "grey"} />
      {isBrowsing && (
        <Group x={205}>
          <Rect width={200} height={200} fill="white" stroke="grey" strokeWidth={1} />
          <Text x={50} y={50} width={200} height={200} text={chosenClothing} fontSize={100} />
        </Group>
      )}
    </Group>
  );
}