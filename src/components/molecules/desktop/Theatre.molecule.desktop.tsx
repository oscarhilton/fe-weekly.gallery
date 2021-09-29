import React from 'react';
import { Group, Rect } from 'react-konva';

export default function Theatre({ x, y, start, stop } : { x: number, y: number, start: () => void, stop: () => void }) {
  const [isBrowsing, setIsBrowsing] = React.useState(false);

  // React.useEffect(() => {
  //   if (isBrowsing) return;
  //   return;
  // }, [isBrowsing]);

  const handleMouseEnter = React.useCallback(() => {
    setIsBrowsing(true);
    start();
  }, [setIsBrowsing, start]);

  const handleMouseLeave = React.useCallback(() => {
    setIsBrowsing(false);
    stop();
  }, [setIsBrowsing, stop]);

  return (
    <Group x={x} y={y}>
      <Rect onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} width={400} height={560} fill={isBrowsing ? "lightgreen" : "grey"} />
    </Group>
  );
}