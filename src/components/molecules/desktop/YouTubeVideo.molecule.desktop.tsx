import React from 'react';
import { Image } from 'react-konva';

export default function YouTubeVideo() {
  const [canvas, setCanvas] = React.useState<HTMLVideoElement>();

  const makeCavas = (width?: number, height?: number) => {
    const c = document.createElement<any>("CANVAS");
    c.width = width || 800;
    c.height = height || 600;
    return c;
    
  }
  const mkYouTube = (id: string, x: number, y: number, w : number, h: number, src: string, allow: string) => {
    var f = document.createElement("video");
    f.id = id;
    f.setAttribute("allowfullscreen", "")
    f.style.cssText = "position:absolute; left:" + x + "px; top:" + y + "px; width:" + w + "px; height:" + h + "px;";
    f.src = src;
    return f;
  }

  React.useEffect(() => {
    const canvas = makeCavas();
    console.log(canvas);
    const video = mkYouTube("myvid", 20, 20, 560, 315, "https://www.youtube.com/embed/QH2-TGUlwu4", "autoplay; encrypted-media");
    setCanvas(video);
  }, [setCanvas]);

  return <Image image={canvas} />;
}