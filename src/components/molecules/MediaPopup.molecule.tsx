import React from 'react';
import styled from 'styled-components';

export default function MeidaPopup({ x, y, active, serverTime }: { x: number, y: number, active: boolean, serverTime: number }) {
  const playTime = React.useMemo(() => Math.floor(serverTime % 4464000 / 1000), [serverTime]);
  return (
    <Container>
      <IFrame active={active} x={x + 2200} y={y + 180} width="300" height="300" src={`https://www.youtube.com/embed/GM84QEU3-Fk?autoplay=${Number(active)}&modestbranding&loop=1&controls=0&start=${playTime}&mute=${Number(!active)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></IFrame>
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  cursor: pointer;
`;

const IFrame = styled.iframe`
  border: none;
  transform: ${({ x, y, active }: { x: number, y: number, active: boolean }) => `translate(${x}px, ${active ? y : y + 5}px) scale(${active ? "1" : "0.8"})`};
  opacity: ${({ active }) => active ? "1" : "0"};
  transition: opacity 0.1s, transform 0.2s;
`