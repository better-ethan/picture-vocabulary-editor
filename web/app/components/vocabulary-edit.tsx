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
  deselect = false,
  ...rest
}: Omit<Konva.ImageConfig, "image"> & { src: string; deselect: boolean }) {
  const [image] = useImage(src);
  const [isSelected, setIsSelected] = useState(false);
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

  useEffect(() => {
    if (deselect) setIsSelected(false);
  }, [deselect]);

  return (
    <>
      <Image
        ref={imageRef}
        image={image}
        onClick={() => setIsSelected(true)}
        onTap={() => setIsSelected(true)}
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

export function VocabularyEditor({ width, height }: VocabularyEditorProps) {
  const [deselect, setDeselect] = useState(false);
  return (
    <Stage
      width={width}
      height={height}
      className="bg-yellow-200 border-red-500 border"
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) {
          setDeselect(true);
          setTimeout(() => setDeselect(false), 0);
        }
      }}
    >
      <Layer>
        <ColorRect />
        <Text text="Click on the box to change its color" x={20} y={150} />
        <Circle radius={50} fill={"red"} draggable />
        <URLImage
          width={200}
          height={200}
          draggable
          src={"https://konvajs.org/assets/yoda.jpg"}
          deselect={deselect}
        />
        <URLImage
          width={200}
          height={200}
          draggable
          src={
            "https://images.unsplash.com/photo-1630563451961-ac2ff27616ab?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          deselect={deselect}
        />
      </Layer>
    </Stage>
  );
}
