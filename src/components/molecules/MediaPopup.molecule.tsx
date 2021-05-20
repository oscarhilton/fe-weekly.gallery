import React from 'react';
import styled from 'styled-components';

export default function MeidaPopup({ x, y, active, serverTime }: { x: number, y: number, active: boolean, serverTime: number }) {
  const playTime = React.useMemo(() => Math.floor(serverTime % 4464000 / 1000), [serverTime]);
  return (
    active ? (
      <Container>
        <IFrame x={x + 2200} y={y + 180} width="560" height="315" src={`https://www.youtube.com/embed/GM84QEU3-Fk?autoplay=1&modestbranding&loop=1&controls=0&start=${playTime}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></IFrame>
      </Container>
    ) : <></>
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
  transform: translate(${({ x, y }: { x: number, y: number }) => `${x}px, ${y}px`});
`