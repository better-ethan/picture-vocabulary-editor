"use client";

import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
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
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchImagesFromPixabay } from "@/lib/image-api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/util";
import { Form } from "react-router";

interface VocabularyEditorProps {
  width: number;
  height: number;
  mode?: "edit" | "view";
  data?: {
    title: string;
    description: string;
    content: {
      images: ImageItem[];
      labels: LabelItem[];
      words: { number: number; word: string }[];
    };
  };
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
  mode = "view",
  width,
  height,
  ...rest
}: Omit<Konva.ImageConfig, "image"> & {
  src: string;
  isSelected?: boolean;
  mode?: "edit" | "view";
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

  const isEditMode = mode === "edit";

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
      {isEditMode && isSelected && (
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

interface PixabayHit {
  id: number;
  previewURL: string;
  largeImageURL: string;
  tags: string;
}

interface LabelItem {
  id: string;
  number: number;
  x: number;
  y: number;
}

function NumberCircle({
  label,
  draggable,
  onSelect,
  onDragEnd,
}: {
  label: LabelItem;
  draggable?: boolean;
  onSelect: () => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
}) {
  return (
    <>
      <Group
        x={label.x}
        y={label.y}
        onClick={onSelect}
        draggable={draggable}
        onDragEnd={onDragEnd}
      >
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

export function VocabularyEditor({
  width,
  height,
  mode = "view",
  data,
}: VocabularyEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labels, setLabels] = useState<LabelItem[]>(
    data?.content ? data?.content.labels : []
  );
  const [images, setImages] = useState<ImageItem[]>(
    data?.content ? data?.content.images : []
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageSearch, setImageSearch] = useState("");
  const [searchedImages, setSearchedImages] = useState<PixabayHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleImageSearch = async () => {
    if (!imageSearch.trim()) return;
    setIsSearching(true);
    try {
      const hits = await fetchImagesFromPixabay(imageSearch);
      setSearchedImages(hits ?? []);
    } finally {
      setIsSearching(false);
    }
  };

  const initialNumbers = data?.content.words.map((w) => w.number) ?? [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ];
  const [numbers, setNumbers] = useState(initialNumbers);

  const initialWordMap = data?.content.words.reduce<Record<number, string>>(
    (map, w) => {
      map[w.number] = w.word;
      return map;
    },
    {}
  );
  const [wordMap, setWordMap] = useState<Record<number, string>>(
    initialWordMap ?? {}
  );

  const handleWordChange = (num: number, value: string) => {
    setWordMap((prev) => ({ ...prev, [num]: value }));
  };

  const handleDelete = (item: string) => {
    setNumbers((prev) => prev.filter((n) => n !== Number(item)));
    setWordMap((prev) => {
      const m = { ...prev };
      delete m[Number(item)];
      return m;
    });
  };

  const speak = (word: string) => {
    if (!word) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    const applyVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.name === "Samantha") ??
        voices.find((v) => v.lang.startsWith("en"));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };
    if (window.speechSynthesis.getVoices().length > 0) applyVoiceAndSpeak();
    else window.speechSynthesis.onvoiceschanged = applyVoiceAndSpeak;
  };

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

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState(data?.description ?? "");
  const [status, setStatus] = useState<"draft" | "published" | undefined>(
    undefined
  );

  const content = {
    images,
    labels,
    words: numbers.map((num) => ({ number: num, word: wordMap[num] ?? "" })),
  };

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlug(event.target.value);
  };

  const handleTitleBlur = () => {
    setSlug(title.toLowerCase().split(" ").join("-"));
  };

  return (
    <Form method="post" className="flex flex-col bg-gray-50 h-screen">
      {mode === "edit" && (
        <div className="flex items-center gap-4 px-6 py-3 bg-white border-b shadow-sm shrink-0">
          <h1
            className={cn("text-lg font-semibold text-gray-800 tracking-tight")}
          >
            Vocabulary Editor
          </h1>
          <div className="w-px h-6 bg-gray-200" />
          <Input
            type="text"
            value={title}
            placeholder="Add a title"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-100 h-8"
            required
            name="title"
          />
          <Input
            type="text"
            value={slug}
            onChange={handleSlugChange}
            placeholder="Add a slug"
            className="w-100 h-8"
            required
            name="slug"
          />
          <div className="ml-auto flex items-center gap-2">
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "draft" | "published")
              }
              name="status"
              required
            >
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="content"
              value={JSON.stringify(content)}
            />
            <Button size="sm" type="submit" className="h-8 px-5">
              Save
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden py-4 bg-gray-100">
        {mode === "edit" && (
          <aside className="flex flex-col p-4 bg-white shrink-0 w-64 rounded-lg">
            <div className="py-3">
              <Input
                type="search"
                placeholder="Search images..."
                value={imageSearch}
                onChange={(e) => setImageSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleImageSearch()}
                disabled={isSearching}
              />
            </div>
            <div className="max-h-[560px] overflow-y-auto mt-2">
              {isSearching && (
                <p className="col-span-2 text-gray-400 text-center py-4">
                  Searching...
                </p>
              )}
              {!isSearching && searchedImages.length === 0 && (
                <p className="text-gray-400 text-center py-4">No Results</p>
              )}
              <div className="columns-2 gap-2">
                {searchedImages.map((img) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("imageUrl", img.largeImageURL)
                    }
                    className={cn(
                      "rounded overflow-hidden border border-gray-200 mb-2",
                      "hover:ring-2 hover:ring-blue-400 cursor-pointer transition"
                    )}
                  >
                    <img
                      src={img.previewURL}
                      alt={img.tags}
                      className="w-full h-auto block"
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
        <div className="flex flex-1 flex-col items-center justify-center overflow-auto px-4">
          <div
            ref={containerRef}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="shadow-lg rounded-lg overflow-hidden"
          >
            <Stage
              width={width}
              height={height}
              className="bg-white"
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
                    draggable={mode === "edit"}
                    src={img.src}
                    x={img.x}
                    y={img.y}
                    isSelected={selectedId === img.id}
                    onClick={() => setSelectedId(img.id)}
                    onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                      const pos = e.target.position();
                      setImages((prev) =>
                        prev.map((it) =>
                          it.id === img.id ? { ...it, x: pos.x, y: pos.y } : it
                        )
                      );
                    }}
                  />
                ))}
                {labels.map((label) => (
                  <NumberCircle
                    key={label.id}
                    label={label}
                    draggable={mode === "edit"}
                    onSelect={() => setSelectedId(label.id)}
                    onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                      const pos = e.target.position();
                      setLabels((prev) =>
                        prev.map((l) =>
                          l.id === label.id ? { ...l, x: pos.x, y: pos.y } : l
                        )
                      );
                    }}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
          <div className="mt-4 w-full">
            <Textarea
              placeholder="Add a description..."
              className="text-sm resize-none bg-white"
              rows={2}
              value={description}
              readOnly={mode === "view"}
              onChange={(e) =>
                mode === "edit" ? setDescription(e.target.value) : undefined
              }
              name="description"
            />
          </div>
        </div>
        <aside className="flex flex-col w-72 bg-white rounded-lg h-fit shrink-0">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <p className="text-gray-500 tracking-wider">Word List</p>
            {mode === "edit" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setNumbers((prev) => [...prev, prev.length + 1])}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {numbers.map((item, index) => (
              <div key={item} className="flex items-center gap-2 mb-1">
                <div
                  draggable={mode === "edit"}
                  onDragStart={(e) =>
                    e.dataTransfer.setData("labelNumber", String(item))
                  }
                  className={cn(
                    "w-6 h-6 rounded-full bg-white text-gray-700 flex items-center justify-center border border-gray-400",
                    "cursor-grab text-lg hover:bg-gray-100 active:cursor-grabbing select-none"
                  )}
                >
                  {item}
                </div>
                <input
                  type="text"
                  value={wordMap[item] ?? ""}
                  onChange={(e) =>
                    mode === "edit"
                      ? handleWordChange(item, e.target.value)
                      : undefined
                  }
                  readOnly={mode === "view"}
                  className="w-32 border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => speak(wordMap[item] ?? "")}
                  disabled={!wordMap[item]}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                {mode === "edit" && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={index !== numbers.length - 1}
                    onClick={() => handleDelete(String(item))}
                  >
                    <TrashIcon />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Form>
  );
}
