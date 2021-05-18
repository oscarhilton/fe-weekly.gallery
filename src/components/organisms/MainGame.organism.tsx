import React from 'react';
import { useFullScreenHandle } from "react-full-screen";
import styled from 'styled-components';
import {
  isMobile,
  isDesktop,
} from "react-device-detect";
import { Stage, Layer, Text, Image, Group, Rect } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';

// Hotkeys
import { useHotkeys } from 'react-hotkeys-hook';

// Context
import { SocketContext } from '../providers/Socket.provider';

// Desktop
import Desktop from '../molecules/desktop/Desktop.molecule.desktop';

// Mobile
import BootScreen from '../molecules/mobile/BootScreen.molecule.mobile';
import HomeScreen from '../molecules/mobile/HomeScreen.molecule.mobile';

const RIGHT_MOUSE_BUTTON = 2;

export default function MainGame() {
  const handle = useFullScreenHandle();

  const { handleSendToSocket, populousCursors, identity } = React.useContext(SocketContext);

  const stageRef = React.useRef<Konva.Stage>(null);
  const cursorLayer = React.useRef<Konva.Layer>(null);
  const desktopLayer = React.useRef<Konva.Layer>(null);
  const mobileLayer = React.useRef<Konva.Layer>(null);

  const [booted, setBooted] = React.useState(false);

  const [dragging, setDragging] = React.useState(true);
  const [stageHeight, setStageHeight] = React.useState(window.innerHeight || 0);
  const [stageWidth, setStageWidth] = React.useState(window.innerWidth || 0);
  const [visibleHandles, setVisibleHandles] = React.useState(true);
  const [chatIsActive, setChatIsActive] = React.useState(true);

  const fitStageIntoParentContainer = () => {
    setStageHeight(window.innerHeight);
    setStageWidth(window.innerWidth);
  }

  const trackMouse = React.useCallback(() => {
    if (!desktopLayer.current || !stageRef.current ) return console.warn("FAIL");
    var transform = desktopLayer.current.getAbsoluteTransform().copy();
    transform.invert();
    const stagePos = stageRef.current.getPointerPosition();

    if (stagePos) {
      var pos = transform.point(stagePos);
      handleSendToSocket("clientMouseMove", { x: pos.x, y: pos.y, identity, stageWidth, stageHeight });
    }
  }, [stageRef, stageRef, stageWidth, stageHeight]);

  const updateClothing = (chosenClothing: string) => {
    handleSendToSocket("changeAvatar", { chosenClothing, identity });
  };

  React.useEffect(() => {
    if (!cursorLayer.current) return;
    cursorLayer.current.draw();
  }, [populousCursors, cursorLayer]);

  React.useEffect(() => {
    window.addEventListener('resize', fitStageIntoParentContainer);
    return () => window.removeEventListener('resize', fitStageIntoParentContainer);
  }, []);

  React.useEffect(() => {
    window.addEventListener('mousemove', trackMouse);
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  React.useEffect(() => {
    if (!stageRef.current) return;
    stageRef.current.addEventListener('contextmenu', function(event){
      event.preventDefault();
    });
  }, [stageRef]);

  React.useEffect(() => {
    if (isMobile) {
      setBooted(true);
    }
    if (isDesktop) {
      setBooted(true);
    }
  }, [setBooted]);

  const [cursor] = useImage('/assets/cursor.svg');
  const [hand] = useImage('/assets/hand.svg');

  // Hotkeys
  useHotkeys('ctrl+k', () => setVisibleHandles(true));
  useHotkeys('ctrl+l', () => setVisibleHandles(false));
  useHotkeys('1', () => handleSendToSocket("broadcastToast", "🤗"));
  useHotkeys('2', () => handleSendToSocket("broadcastToast", "😍"));
  useHotkeys('3', () => handleSendToSocket("broadcastToast", "🤩"));
  useHotkeys('4', () => handleSendToSocket("broadcastToast", "🙌"));
  useHotkeys('5', () => handleSendToSocket("broadcastToast", "👈"));
  useHotkeys('6', () => handleSendToSocket("broadcastToast", "🌈"));
  useHotkeys('7', () => handleSendToSocket("broadcastToast", "😂"));
  useHotkeys('8', () => handleSendToSocket("broadcastToast", "🍺"));
  useHotkeys('9', () => handleSendToSocket("broadcastToast", "🥳"));
  useHotkeys('0', () => handleSendToSocket("broadcastToast", "🎉"));

  const DRAW_SIZE_MIN = -2000;
  const DRAW_SIZE_MAX = 1000;

  const dragBoundsConstaint = (pos: { x: number, y: number }) => {
    console.log(pos)
    var newX = pos.x < DRAW_SIZE_MIN ? DRAW_SIZE_MIN : pos.x > DRAW_SIZE_MAX ? DRAW_SIZE_MAX : pos.x;
    var newY = pos.y < DRAW_SIZE_MIN ? DRAW_SIZE_MIN : pos.y > DRAW_SIZE_MAX ? DRAW_SIZE_MAX : pos.y;
    return {
      x: newX,
      y: newY,
    };
  };

  const fitAvatarToBoundsX = (x: number) => {
    let newX = x < 0 ? 0 : x > DRAW_SIZE_MAX * 3 - 20 ? DRAW_SIZE_MAX * 3 - 20 : x + 15;
    return newX;
  }

  const fitAvatarToBoundsY = (y: number) => {
    let newY = y < 0 ? 0 : y > DRAW_SIZE_MAX - 20 ? DRAW_SIZE_MAX - 20 : y + 15;
    return newY;
  };

  const calculateAvatarOpacity = (ax: number, ay: number, bx: number, by: number) => {
    const magnitude = Math.sqrt(Math.pow(ax + bx, 2) + Math.pow(ay + by, 2));
    if (magnitude < 100) {
      return 1;
    } else if (magnitude > 300){
      return 0;
    } else {
      return 1 - magnitude / 300;
    }
  }

  const handleLayerMouseUp = () => {
    console.log("MOUSE UP!")
    handleSendToSocket("mouseState", "mouseup");
  }

  const handleLayerMouseDown = React.useCallback((e: any) => {
    setDragging(e.target.attrs.isGround);
    if (e.target.attrs.isGround && e.evt.button === 0) {
      handleSendToSocket("mouseState", "mousedown");
    }
  }, [setDragging]);

  const enableChatWindow = () => setChatIsActive(true);
  const disableChatWindow = () => setChatIsActive(false);
  
  return (
    <>
    <NoMouse isActive={!chatIsActive} >
      {!handle.active && (
        <>
        <Stage ref={stageRef} width={stageWidth} height={stageHeight}>
          <Layer ref={desktopLayer} draggable={dragging} dragBoundFunc={dragBoundsConstaint} onMouseDown={handleLayerMouseDown} onMouseUp={handleLayerMouseUp} onDragEnd={handleLayerMouseUp}>
            <Group>
              {/* <Rect y={-stageHeight} fill="#000" width={DRAW_SIZE_MAX * 3} height={stageHeight} listening={false} /> */}
              {/* <Rect y={-stageHeight} fill="#000" width={-stageWidth} height={stageHeight + DRAW_SIZE_MAX} listening={false} /> */}
              <Rect y={-200} fill="#676767" width={DRAW_SIZE_MAX * 3} height={200} />
              <Rect isGround fill="#323232" width={DRAW_SIZE_MAX * 3} height={DRAW_SIZE_MAX} />
              {booted ? <Desktop enableChatWindow={enableChatWindow} disableChatWindow={disableChatWindow} updateClothing={updateClothing} stageHeight={stageHeight} stageWidth={stageWidth} layer={desktopLayer} /> : <BootScreen />}
              {populousCursors && populousCursors.map(({ x, y, clothing, identity: handle, toast, mouseState }: { x: number, y: number, clothing?: string, identity: string, toast: string, mouseState: string }) =>  {
                return (
                  <>
                  <Group x={x} y={y}>
                    {mouseState === "mouseup" && <Image x={-9} y={-8} image={cursor} width={28} height={28} listening={false} />}
                    {mouseState === "mousedown" && <Image x={-16} y={-16} image={hand} width={38} height={38} listening={false} />}
                    {visibleHandles && <Text x={45} y={18} text={handle} fontFamily="helvetica" fontSize={12} listening={false} fill={'#f1f1f1'} opacity={0.5} shadowEnabled shadowOffset={{ x: 1, y: 1 }} shadowColor="#212121" shadowOpacity={0.5} />}
                    {toast && (
                      <Group x={-55} y={-55} >
                        <Rect width={50} height={50} fill="#f5f5f5" cornerRadius={[30, 10, 0, 20]} />
                        <Text x={12} y={12} text={toast} fontSize={30} listening={false} />
                      </Group>
                    )}
                  </Group>
                  <Text x={fitAvatarToBoundsX(x)} y={fitAvatarToBoundsY(y)} text={clothing ? clothing : `👱🏼‍♀️`} fontFamily="OpenEmoj" fontSize={20} listening={false} opacity={calculateAvatarOpacity(45, 18, x - fitAvatarToBoundsX(x), y - fitAvatarToBoundsY(y))} />
                  </>
                )
              })}
            </Group>
          </Layer>
        </Stage>
        </>
      )}
    </NoMouse>
    <ChatWindow active={chatIsActive}>
      <ChatContainer>
        <BubbleContainer><ChatUser>Dave</ChatUser><ChatBubble>Hello world!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
        <BubbleContainer><ChatUser>Dave</ChatUser><ChatBubble>Yes, hello!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
        <BubbleContainer><ChatUser>Dave</ChatUser><ChatBubble>Hows everyone doing!?</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
        <BubbleContainer><ChatUser>Dave</ChatUser><ChatBubble>Great!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
        <BubbleContainer><ChatUser>Bob</ChatUser><ChatBubble client>Hey!</ChatBubble><ChatTime>a moment ago</ChatTime></BubbleContainer>
      </ChatContainer>
    </ChatWindow>
    </>
  )
}

const ChatWindow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  pointer-events: none;
  opacity: ${({ active }: { active: boolean }) => active ? 1 : 0};
  display: inline-flex;
  flex-direction: column;
  transition: opacity 0.2s, backdrop-filter 0.2s;
  padding: 50px;
  backdrop-filter: blur(10px) sepia(.9);
`;

const ChatContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BubbleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

const ChatBubble = styled.div`
  padding: 8px 10px;
  margin: 5px 0;
  background: ${({ client }: { client?: boolean }) => client ? "lightgreen" : "#323232"};
  float: ${({ client }: { client?: boolean }) => client ? "right" : "left"};
  display: inline-block;
  border-radius: 5px;
  font-size: 15px;
  color: ${({ client }: { client?: boolean }) => client ? "#212121" : "#cccccc"};
`;

const ChatTime = styled.div`
  align-self: center;
  color: #ccc;
  font-size: 10px;
  opacity: 0.2;
  width: 10%;
  margin-left: 20px;
  font-style: italic;
  width: 25%;
  text-align: right;
`;

const ChatUser = styled.div`
  align-self: center;
  color: #ccc;
  font-size: 12px;
  opacity: 0.4;
  width: 25%;
`;

const NoMouse = styled.div`
  ${({ isActive }: { isActive: boolean }) => isActive && 'cursor: none'};
  background: #101010;
`;

const FullBlack = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
`;

const ClearScreen = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #990000;
`;