import React from 'react';
import { Group, Rect, Image } from 'react-konva';
import useImage from 'use-image';

export default function Window({ x, y }: { x: number, y: number}) {
  const [image] = useImage('https://scontent-lhr8-1.xx.fbcdn.net/v/t1.6435-9/85106546_186482905923150_513155923657621504_n.jpg?_nc_cat=110&ccb=1-3&_nc_sid=8bfeb9&_nc_ohc=L8aR4PUvAjkAX-xymnc&_nc_ht=scontent-lhr8-1.xx&oh=c0f124c2b3255c9874e3c937dbed1dbc&oe=60C69109');
  return (
    <Group x={x} y={y} >
      <Image image={image} />
    </Group>
  )
}