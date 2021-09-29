import React from "react";
import { useFullScreenHandle } from "react-full-screen";
import styled from "styled-components";
import { isMobile, isDesktop } from "react-device-detect";
import { Stage, Layer, Group} from "react-konva";
import useImage from "use-image";
import Konva from "konva";

// Hotkeys
import { useHotkeys } from "react-hotkeys-hook";

// Context
import { SocketContext } from "../providers/Socket.provider";
import { IPFSContext } from '../providers/IPFS.provider';

// Desktop
import Desktop from "../molecules/desktop/Desktop.molecule.desktop";
import ChatWindow from "../molecules/desktop/ChatWindow.molecule.desktop";
import MediaPopup from "../molecules/MediaPopup.molecule";
import User from "../molecules/desktop/User.molecule.desktop";

// Mobile
import BootScreen from "../molecules/mobile/BootScreen.molecule.mobile";
import HomeScreen from "../molecules/mobile/HomeScreen.molecule.mobile";

const RIGHT_MOUSE_BUTTON = 2;

export default function MainGame() {
	const handle = useFullScreenHandle();

	const {
		handleSendToSocket,
		populousCursors,
		identity,
		serverBoottime,
		serverTime,
	} = React.useContext(SocketContext);

	const stageRef = React.useRef<Konva.Stage>(null);
	const cursorLayer = React.useRef<Konva.Layer>(null);
	const desktopLayer = React.useRef<Konva.Layer>(null);
	const mobileLayer = React.useRef<Konva.Layer>(null);

	const [booted, setBooted] = React.useState(false);

	const [dragging, setDragging] = React.useState(true);
	const [dragValueX, setDragValueX] = React.useState(0);
	const [dragValueY, setDragValueY] = React.useState(0);

	const [mouseX, setMouseX] = React.useState<number>(0);
	const [mouseY, setMouseY] = React.useState<number>(0);

	const [stageHeight, setStageHeight] = React.useState<number>(
		window.innerHeight || 0
	);
	const [stageWidth, setStageWidth] = React.useState<number>(
		window.innerWidth || 0
	);
	const [visibleHandles, setVisibleHandles] = React.useState<boolean>(true);
	const [chatIsActive, setChatIsActive] = React.useState<boolean>(false);
	const [theatreIsActive, setTheatreIsActive] = React.useState<boolean>(false);

	const fitStageIntoParentContainer = () => {
		setStageHeight(window.innerHeight);
		setStageWidth(window.innerWidth);
	};

	const trackMouse = React.useCallback(() => {
		if (!desktopLayer.current || !stageRef.current) return console.warn("FAIL");
		var transform = desktopLayer.current.getAbsoluteTransform().copy();
		transform.invert();
		const stagePos = stageRef.current.getPointerPosition();

		if (stagePos) {
			var pos = transform.point(stagePos);
			setMouseX(pos.x);
			setMouseY(pos.y);
			handleSendToSocket("clientMouseMove", {
				x: pos.x,
				y: pos.y,
				identity,
				stageWidth,
				stageHeight,
			});
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
		window.addEventListener("resize", fitStageIntoParentContainer);
		return () =>
			window.removeEventListener("resize", fitStageIntoParentContainer);
	}, []);

	React.useEffect(() => {
		window.addEventListener("mousemove", trackMouse);
		return () => window.removeEventListener("mousemove", trackMouse);
	}, []);

	React.useEffect(() => {
		if (!stageRef.current) return;
		stageRef.current.addEventListener("contextmenu", function (event) {
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

	const [grass] = useImage("/assets/grass.png");

	// Hotkeys
	useHotkeys("ctrl+k", () => setVisibleHandles(true));
	useHotkeys("ctrl+l", () => setVisibleHandles(false));
	useHotkeys("1", () => handleSendToSocket("broadcastToast", "🤗"));
	useHotkeys("2", () => handleSendToSocket("broadcastToast", "😍"));
	useHotkeys("3", () => handleSendToSocket("broadcastToast", "🤩"));
	useHotkeys("4", () => handleSendToSocket("broadcastToast", "🙌"));
	useHotkeys("5", () => handleSendToSocket("broadcastToast", "👈"));
	useHotkeys("6", () => handleSendToSocket("broadcastToast", "🌈"));
	useHotkeys("7", () => handleSendToSocket("broadcastToast", "😂"));
	useHotkeys("8", () => handleSendToSocket("broadcastToast", "🍺"));
	useHotkeys("9", () => handleSendToSocket("broadcastToast", "🥳"));
	useHotkeys("0", () => handleSendToSocket("broadcastToast", "🎉"));

	const dragBoundsConstaint = (pos: { x: number; y: number }) => {
		// var newX = pos.x < DRAW_SIZE_MIN ? DRAW_SIZE_MIN : pos.x > DRAW_SIZE_MAX ? DRAW_SIZE_MAX : pos.x;
		// var newY = pos.y < DRAW_SIZE_MIN ? DRAW_SIZE_MIN : pos.y > DRAW_SIZE_MAX ? DRAW_SIZE_MAX : pos.y;
		var newX = pos.x;
		var newY = pos.y;

		setDragValueX(newX);
		setDragValueY(newY);

		return {
			x: newX,
			y: newY,
		};
	};

  console.log(populousCursors);

	const handleLayerMouseUp = () => {
		handleSendToSocket("mouseState", "mouseup");
	};

	const handleLayerMouseDown = React.useCallback(
		(e: any) => {
			setDragging(e.target.attrs.isGround);
			if (e.target.attrs.isGround && e.evt.button === 0) {
				handleSendToSocket("mouseState", "mousedown");
			}
		},
		[setDragging]
	);

	const enableChatWindow = () => setChatIsActive(true);
	const disableChatWindow = () => setChatIsActive(false);

	const startTheatre = () => setTheatreIsActive(true);
	const stopTheatre = () => setTheatreIsActive(false);

	const actualMousePosition = React.useMemo(
		() => ({
			x: mouseX + dragValueX,
			y: mouseY + dragValueY,
		}),
		[mouseX, mouseY]
	);

	return (
		<Game>
			<NoMouse isActive={!chatIsActive} isDark={theatreIsActive}>
				{!handle.active && (
					<>
						<Stage ref={stageRef} width={stageWidth} height={stageHeight}>
							<Layer
								ref={desktopLayer}
								draggable={dragging}
								dragBoundFunc={dragBoundsConstaint}
								onMouseDown={handleLayerMouseDown}
								onMouseUp={handleLayerMouseUp}
								onDragEnd={handleLayerMouseUp}
							>
								<Group>
									{booted ? (
										<Desktop
											startTheatre={startTheatre}
											stopTheatre={stopTheatre}
											enableChatWindow={enableChatWindow}
											disableChatWindow={disableChatWindow}
											updateClothing={updateClothing}
											stageHeight={stageHeight}
											stageWidth={stageWidth}
											layer={desktopLayer}
											theatreIsActive={theatreIsActive}
										/>
									) : (
										<BootScreen />
									)}
									{populousCursors &&
										populousCursors.map(
											({
												x,
												y,
												clothing,
												identity: handle,
												toast,
												mouseState,
											}: {
												x: number;
												y: number;
												clothing?: string;
												identity: string;
												toast: string;
												mouseState: string;
											}) => (
												<User
													visibleHandles={visibleHandles}
													x={x}
													y={y}
													clothing={clothing}
													identity={handle}
													toast={toast}
													mouseState={mouseState}
												/>
											)
										)}
								</Group>
							</Layer>
						</Stage>
					</>
				)}
			</NoMouse>
			<MediaPopup
				serverTime={serverTime}
				active={theatreIsActive}
				x={dragValueX}
				y={dragValueY}
			/>
			<ChatWindow
				x={actualMousePosition.x}
				y={actualMousePosition.y}
				chatIsActive={chatIsActive}
			/>
			<Ping>{serverBoottime}/ms</Ping>
		</Game>
	);
}

const Ping = styled.div`
	position: fixed;
	bottom: 20px;
	left: 20px;
`;

const Game = styled.div`
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	posiition: absolute;
	overflow: hidden;
`;

const SQUARE_SIZE = 10;
const NoMouse = styled.div`
	${({ isActive }: { isActive: boolean; isDark: boolean }) =>
		isActive && "cursor: none"};
	background: ${({ isDark }) => (isDark ? "#ffffff" : "#f2f2f2")};
	transition: background 0.5s;
	background-image: linear-gradient(45deg, lightgrey 25%, transparent 25%),
		linear-gradient(135deg, lightgrey 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, lightgrey 75%),
		linear-gradient(135deg, transparent 75%, lightgrey 75%);
	background-size: ${SQUARE_SIZE}px ${SQUARE_SIZE}px; /* Must be a square */
	background-position: 0 0, ${SQUARE_SIZE / 2}px 0,
		${SQUARE_SIZE / 2}px -${SQUARE_SIZE / 2}px, 0px ${SQUARE_SIZE / 2}px; /* Must be half of one side of the square */
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
