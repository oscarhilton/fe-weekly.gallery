import React from "react";
import { Stage, Layer, Text, Image, Group, Rect } from "react-konva";
import useImage from "use-image";

const DRAW_SIZE_MIN = -2000;
const DRAW_SIZE_MAX = 1000;

export default function User({
	x,
	y,
	clothing,
	identity: handle,
	toast,
	mouseState,
	visibleHandles,
}: {
	x: number;
	y: number;
	clothing?: string;
	identity: string;
	toast: string;
	mouseState: string;
	visibleHandles: boolean;
}) {
	const [cursor] = useImage("/assets/cursor.svg");
	const [hand] = useImage("/assets/hand.svg");

	const fitAvatarToBoundsX = (x: number) => {
		let newX =
			x < 0 ? 0 : x > DRAW_SIZE_MAX * 3 - 20 ? DRAW_SIZE_MAX * 3 - 20 : x + 15;
		return newX;
	};

	const fitAvatarToBoundsY = (y: number) => {
		let newY = y < 0 ? 0 : y > DRAW_SIZE_MAX - 20 ? DRAW_SIZE_MAX - 20 : y + 15;
		return newY;
	};

	const calculateAvatarOpacity = (
		ax: number,
		ay: number,
		bx: number,
		by: number
	) => {
		const magnitude = Math.sqrt(Math.pow(ax + bx, 2) + Math.pow(ay + by, 2));
		if (magnitude < 100) {
			return 1;
		} else if (magnitude > 300) {
			return 0;
		} else {
			return 1 - magnitude / 300;
		}
	};

	return (
		<>
			<Group x={x} y={y}>
				{mouseState === "mouseup" && (
					<Image
						x={-9}
						y={-8}
						image={cursor}
						width={28}
						height={28}
						listening={false}
					/>
				)}
				{mouseState === "mousedown" && (
					<Image
						x={-16}
						y={-16}
						image={hand}
						width={38}
						height={38}
						listening={false}
					/>
				)}
				{visibleHandles && (
					<Text
						x={45}
						y={18}
						text={handle}
						fontFamily='helvetica'
						fontSize={12}
						listening={false}
						fill={"#f1f1f1"}
						opacity={0.5}
						shadowEnabled
						shadowOffset={{ x: 1, y: 1 }}
						shadowColor='#212121'
						shadowOpacity={0.5}
					/>
				)}
				{toast && (
					<Group x={-55} y={-55}>
						<Rect
							width={50}
							height={50}
							fill='#f5f5f5'
							cornerRadius={[30, 10, 0, 20]}
						/>
						<Text x={12} y={12} text={toast} fontSize={30} listening={false} />
					</Group>
				)}
			</Group>
			<Text
				x={fitAvatarToBoundsX(x)}
				y={fitAvatarToBoundsY(y)}
				text={clothing ? clothing : `👱🏼‍♀️`}
				fontFamily='OpenEmoj'
				fontSize={20}
				listening={false}
				opacity={calculateAvatarOpacity(
					45,
					18,
					x - fitAvatarToBoundsX(x),
					y - fitAvatarToBoundsY(y)
				)}
			/>
		</>
	);
}
