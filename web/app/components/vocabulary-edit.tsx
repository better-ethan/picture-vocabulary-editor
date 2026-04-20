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
  Group,
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
  width,
  height,
  ...rest
}: Omit<Konva.ImageConfig, "image"> & {
  src: string;
  isSelected?: boolean;
  clickHandler?: () => void;
}) {
  const [image] = useImage(src, "anonymous");
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

  const finalWidth = width ?? 200;
  const finalHeight =
    height ??
    (image
      ? (image.naturalHeight / image.naturalWidth) * finalWidth
      : undefined);

  return (
    <>
      <Image
        ref={imageRef}
        image={image}
        onClick={clickHandler}
        onTap={clickHandler}
        width={finalWidth}
        height={finalHeight}
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

interface LabelItem {
  id: string;
  number: number;
  x: number;
  y: number;
}

function NumberCircle({
  label,
  onSelect,
}: {
  label: LabelItem;
  onSelect: () => void;
}) {
  return (
    <>
      <Group x={label.x} y={label.y} onClick={onSelect} draggable>
        <Circle radius={12} fill={"white"} stroke={"#9ca3af"} strokeWidth={1} />
        <Text
          text={String(label.number)}
          fill={"#374151"}
          fontSize={18}
          fontStyle={"normal"}
          align="center"
          verticalAlign="middle"
          width={24}
          height={24}
          offsetX={12}
          offsetY={12}
        />
      </Group>
    </>
  );
}

export function VocabularyEditor({ width, height }: VocabularyEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labels, setLabels] = useState<LabelItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const number = Number(e.dataTransfer.getData("labelNumber"));
    if (number) {
      setLabels((prev) => [
        ...prev,
        {
          id: `label-${Date.now()}`,
          number,
          x,
          y,
        },
      ]);
    }

    const imageUrl = e.dataTransfer.getData("imageUrl");
    if (imageUrl) {
      setImages((prev) => [
        ...prev,
        {
          id: `image-${Date.now()}`,
          src: imageUrl,
          x,
          y,
          width: 200,
        },
      ]);
    }
  };
  return (
    <div
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
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
          {images.map((img, index) => (
            <URLImage
              key={index}
              width={img.width ?? 200}
              draggable
              src={img.src}
              x={img.x}
              y={img.y}
              isSelected={selectedId === img.id}
              onClick={() => setSelectedId(img.id)}
            />
          ))}
          {labels.map((label) => (
            <NumberCircle
              key={label.id}
              label={label}
              onSelect={() => setSelectedId(label.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
