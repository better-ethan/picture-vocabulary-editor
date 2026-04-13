"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Circle,
  Image,
  Transformer,
  type KonvaNodeComponent,
} from "react-konva";
import Konva from "konva";
import useImage from "use-image";

interface VocabularyEditorProps {
  width: number;
  height: number;
}

const ColorRect = () => {
  const [color, setColor] = useState("green");

  return (
    <Rect
      x={20}
      y={20}
      width={100}
      height={100}
      fill={color}
      draggable
      onClick={() => {
        setColor(Konva.Util.getRandomColor());
      }}
    />
  );
};

function URLImage({
  src,
  isSelected = false,
  clickHandler,
  ...rest
}: Omit<Konva.ImageConfig, "image"> & {
  src: string;
  isSelected?: boolean;
  clickHandler?: () => void;
}) {
  const [image] = useImage(src);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
    } else if (!isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        ref={imageRef}
        image={image}
        onClick={clickHandler}
        onTap={clickHandler}
        {...rest}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            // 防止縮放到太小
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}
interface ImageItem {
  id: string;
  src: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
const URLImageArr: ImageItem[] = [
  {
    id: "yoda",
    src: "https://konvajs.org/assets/yoda.jpg",
  },
  {
    id: "apple",
    src: "https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function VocabularyEditor({ width, height }: VocabularyEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <Stage
      width={width}
      height={height}
      className="bg-yellow-100 border-red-500 border"
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) {
          setSelectedId(null);
        }
      }}
    >
      <Layer>
        <ColorRect />
        <Text text="Click on the box to change its color" x={20} y={150} />
        <Circle radius={50} fill={"red"} draggable />
        {URLImageArr.map((img, index) => (
          <URLImage
            key={index}
            width={img.width ?? 200}
            height={img.height}
            draggable
            src={img.src}
            isSelected={selectedId === img.id}
            onClick={() => setSelectedId(img.id)}
          />
        ))}
      </Layer>
    </Stage>
  );
}
