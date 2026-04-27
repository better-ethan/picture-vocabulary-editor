"use client";

import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Stage,
  Layer,
  Text as CanvasText,
  Circle,
  Image,
  Transformer,
  Group,
} from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { Button } from "@/components/retroui/Button";
import {
  CloudUploadIcon,
  ImageIcon,
  PlusIcon,
  TrashIcon,
  Volume2,
  ChevronLeftIcon,
  BookAIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchImagesFromPixabay } from "@/lib/image-api";
import { Input } from "@/components/retroui/Input";
import { Textarea } from "@/components/retroui/Textarea";
import { Text } from "@/components/retroui/Text";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/retroui/Select";
import { useTRPC } from "@/util";
import { Form } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Field, FieldDescription } from "@/components/ui/field";
import { toast } from "sonner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Loader } from "@/components/retroui/Loader";
import { Card, CardContent, CardHeader } from "@/components/retroui/Card";

export interface CanvasContent {
  images: ImageItem[];
  labels: LabelItem[];
  words: { number: number; word: string }[];
}

interface VocabularyEditorProps {
  width: number;
  height: number;
  mode?: "edit" | "view";
  data?: {
    title: string;
    slug?: string;
    status?: "draft" | "published";
    description: string;
    content: {
      images: ImageItem[];
      labels: LabelItem[];
      words: { number: number; word: string }[];
    };
  };
}

type EditorMode = "edit" | "view";

function URLImage({
  src,
  isSelected = false,
  mode = "view",
  clickHandler,
  onTransformEnd,
  width,
  height,
  ...rest
}: Omit<Konva.ImageConfig, "image"> & {
  src: string;
  isSelected?: boolean;
  mode?: EditorMode;
  clickHandler?: () => void;
  onTransformEnd?: (newAttrs: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
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
        onTransformEnd={() => {
          const node = imageRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onTransformEnd?.({
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
        {...rest}
      />
      {isEditMode && isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
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
  webformatURL: string;
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
  mode = "view",
  isSelected = false,
  onSelect,
  onDragEnd,
}: {
  label: LabelItem;
  draggable?: boolean;
  mode?: "view" | "edit";
  isSelected?: boolean;
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
        {mode === "edit" && isSelected && (
          <Circle
            radius={16}
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth={2}
            dash={[4, 2]}
          />
        )}
        <Circle radius={12} fill={"white"} stroke={"#9ca3af"} strokeWidth={1} />
        <CanvasText
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

  const trpc = useTRPC();
  const uploadMutation = useMutation(
    trpc.upload.getUploadUrl.mutationOptions()
  );

  const uploadFileToR2 = async (file: File): Promise<string> => {
    const { url, key } = await uploadMutation.mutateAsync({
      fileName: file.name,
      fileType: file.type,
    });
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const publicUrl = `${import.meta.env.VITE_CLOUDFLARE_PUBLIC_URL}/${key}`;
    return publicUrl;
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
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

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      toast.info(`Uploading ${files.length} image(s)...`);
      try {
        await Promise.all(
          files.map(async (file, i) => {
            const publicUrl = await uploadFileToR2(file);
            setImages((prev) => [
              ...prev,
              {
                id: `image-${Date.now()}-${i}`,
                src: publicUrl,
                x: x + i * 20,
                y: y + i * 20,
                width: 200,
              },
            ]);
          })
        );
        toast.success("Upload successful!");
      } catch (error) {
        console.error("Upload failed: ", error);
        toast.error("Upload failed. Please try again.");
      }
    }
  };

  const [title, setTitle] = useState(data?.title ?? "");
  const [slug, setSlug] = useState(data?.slug ?? "");
  const [description, setDescription] = useState(data?.description ?? "");
  const [status, setStatus] = useState<"draft" | "published" | undefined>(
    data?.status
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

  type Tool = "images" | "upload" | "words";
  const [activeTool, setActiveTool] = useState<Tool | null>("images");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const toggleTool = (tool: Tool) => {
    setActiveTool(tool);
    setIsPanelOpen(true);
  };

  const togglePanel = () => {
    setIsPanelOpen(false);
    setActiveTool(null);
  };

  useEffect(() => {
    if (mode === "view") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        if (selectedId?.startsWith("image-")) {
          setImages((prev) => prev.filter((img) => img.id !== selectedId));
          setSelectedId(null);
        } else if (selectedId?.startsWith("label-")) {
          setLabels((prev) => prev.filter((label) => label.id !== selectedId));
          setSelectedId(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, mode]);

  return (
    <Form method="post" className="flex flex-col bg-inherit h-screen">
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
      <div className="flex flex-1 overflow-hidden px-2 py-4 bg-inherit h-screen">
        {mode === "edit" && (
          <Card className="h-full">
            <CardContent className="flex p-0 relative h-full">
              <div
                className={cn(
                  "w-16 flex flex-col items-center py-2 px-1",
                  isPanelOpen && "border-r border-gray-300"
                )}
              >
                <ToolButton
                  ButtonIcon={ImageIcon}
                  text="Images"
                  onClick={() => toggleTool("images")}
                  active={activeTool === "images"}
                />
                <ToolButton
                  ButtonIcon={CloudUploadIcon}
                  text="Upload"
                  onClick={() => toggleTool("upload")}
                  active={activeTool === "upload"}
                />
                <ToolButton
                  ButtonIcon={BookAIcon}
                  text="Words"
                  onClick={() => toggleTool("words")}
                  active={activeTool === "words"}
                />
              </div>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 h-full",
                  isPanelOpen ? "w-80 opacity-100" : "w-0 opacity-0"
                )}
              >
                {isPanelOpen && activeTool === "images" && <ImageSearchPanel />}
                {isPanelOpen && activeTool === "upload" && <UploadPanel />}
                {isPanelOpen && activeTool === "words" && (
                  <WordsPanel
                    mode={mode}
                    numbers={numbers}
                    wordMap={wordMap}
                    onWordChange={handleWordChange}
                    onDelete={handleDelete}
                    onAdd={() =>
                      setNumbers((prev) => [...prev, prev.length + 1])
                    }
                  />
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={togglePanel}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -right-3",
                  "h-12 w-6 p-0 text-gray-300",
                  "flex items-center justify-center",
                  "border-none rounded-full",
                  "transition-all duration-300 z-10",
                  "hover:text-secondary-foreground hover:-translate-y-1/2",
                  isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        )}
        <div className="flex flex-1 flex-col items-center justify-between overflow-auto">
          <div>
            <Text className="text-left w-full mb-3">
              Drag images onto the canvas 👇
            </Text>
            <VocabularyCanvas
              width={width}
              height={height}
              mode={mode}
              images={images}
              labels={labels}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              onImagesChange={setImages}
              onLabelsChange={setLabels}
              containerRef={containerRef}
              onDrop={handleDrop}
            />

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
        </div>
      </div>
    </Form>
  );
}

function ToolButton({
  ButtonIcon,
  text,
  active = false,
  onClick,
}: {
  ButtonIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={cn(
        "size-16 flex flex-col items-center justify-center transition",
        "rounded-none text-xs shadow-none border-none bg-inherit",
        "hover:bg-muted/50 hover:translate-y-0.5 hover:shadow-none",
        active && "bg-primary"
      )}
    >
      <ButtonIcon className="size-6" />
      <Text as="p">{text}</Text>
    </Button>
  );
}

function ImageSearchPanel({}: {}) {
  const [imageSearch, setImageSearch] = useState("");
  const [searchedImages, setSearchedImages] = useState<PixabayHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleImageSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const hits = await fetchImagesFromPixabay(query);
      setSearchedImages(hits ?? []);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleImageSearch("learning");
  }, []);

  return (
    <div className="flex flex-col h-full p-2">
      <div className="shrink-0">
        <Input
          type="search"
          placeholder="Search images..."
          value={imageSearch}
          onChange={(e) => setImageSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleImageSearch(imageSearch)}
          disabled={isSearching}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto mt-4">
        {isSearching && (
          <div className="flex items-center justify-center py-5">
            <Loader />
          </div>
        )}
        {!isSearching && searchedImages.length === 0 && (
          <p className="text-gray-400 text-center py-4">No Results</p>
        )}
        <div className="columns-2 gap-2 px-1">
          {searchedImages.map((img) => (
            <div
              key={img.id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("imageUrl", img.webformatURL)
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
    </div>
  );
}

function UploadPanel({}: {}) {
  const trpc = useTRPC();
  const uploadMutation = useMutation(
    trpc.upload.getUploadUrl.mutationOptions()
  );

  const uploadCreateMutation = useMutation(
    trpc.upload.create.mutationOptions()
  );

  const uploadListQuery = useQuery(trpc.upload.list.queryOptions());
  const uploadedImageList = uploadListQuery.data ?? [];

  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const { url, key } = await uploadMutation.mutateAsync({
        fileName: file.name,
        fileType: file.type,
      });
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      const publicUrl = `${import.meta.env.VITE_CLOUDFLARE_PUBLIC_URL}/${key}`;
      await uploadCreateMutation.mutateAsync({ url: publicUrl });

      await uploadListQuery.refetch();

      toast.success("Upload successful!");

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col p-2 h-full">
      <div className="shrink-0">
        <Field>
          <Input
            type="file"
            accept="image/*"
            className=""
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          <FieldDescription>png, jpg, webp suggested</FieldDescription>
          <Button
            type="button"
            className="h-10"
            disabled={!file || uploading}
            onClick={handleUpload}
          >
            {uploading ? <Loader variant="outline" /> : "Upload"}
          </Button>
        </Field>
      </div>
      {uploadedImageList.length > 0 && (
        <div className="shrink-0 mt-4">
          <p className="text-sm text-muted-foreground">
            Drag images onto the canvas 👉
          </p>
          <p className="text-sm text-muted-foreground mt-1 text-right">
            Total: {uploadedImageList.length}{" "}
            {uploadedImageList.length === 1 ? "image" : "images"}
          </p>
        </div>
      )}
      <div className="mt-4 overflow-y-auto flex-1 min-h-0">
        {uploadedImageList.length === 0 ? (
          <Empty className="border border-dashed text-wrap">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6 text-gray-400 bg-none" />
              </EmptyMedia>
              <EmptyTitle>You have no uploaded images</EmptyTitle>
              <EmptyDescription>
                Upload images to create picture lessons
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent></EmptyContent>
          </Empty>
        ) : (
          <>
            <ImageGrid images={uploadedImageList} />
          </>
        )}
      </div>
    </div>
  );
}

export const speak = (word: string) => {
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

function WordsPanel({
  mode = "view",
  numbers,
  wordMap,
  onWordChange,
  onDelete,
  onAdd,
}: {
  mode?: EditorMode;
  numbers: number[];
  wordMap: Record<number, string>;
  onWordChange: (num: number, value: string) => void;
  onDelete: (item: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <Text>Word List</Text>
        {mode === "edit" && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="px-1"
            onClick={onAdd}
          >
            <PlusIcon className="size-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 gap-2">
        <Text className="mb-3">
          Drag these number labels onto the canvas 👉
        </Text>
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
            <Input
              type="text"
              value={wordMap[item] ?? ""}
              onChange={(e) =>
                mode === "edit" ? onWordChange(item, e.target.value) : undefined
              }
              readOnly={mode === "view"}
              className="w-42 border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <Button
              type="button"
              variant="ghost"
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
                onClick={() => onDelete(String(item))}
              >
                <TrashIcon className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageGrid({
  images,
}: {
  images: {
    id: string | number;
    url: string;
    altText?: string;
  }[];
}) {
  return (
    <div className="columns-2 gap-2 mt-2 px-1">
      {images.map((img) => (
        <div
          key={img.id}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("imageUrl", img.url)}
          className={cn(
            "rounded overflow-hidden border border-gray-100 mb-2",
            "hover:ring-2 hover:ring-blue-400 cursor-pointer transition p-1"
          )}
        >
          <img
            src={img.url}
            alt={img.altText}
            className="w-full h-auto block"
          />
        </div>
      ))}
    </div>
  );
}

interface VocabularyCanvasProps {
  width: number;
  height: number;
  mode: EditorMode;
  images: ImageItem[];
  labels: LabelItem[];
  selectedId?: string | null;
  onSelectId?: (id: string | null) => void;
  onImagesChange?: (images: ImageItem[]) => void;
  onLabelsChange?: (labels: LabelItem[]) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function VocabularyCanvas({
  width,
  height,
  mode = "view",
  images,
  labels,
  selectedId,
  onSelectId,
  onImagesChange,
  onLabelsChange,
  containerRef,
  onDrop,
}: VocabularyCanvasProps) {
  return (
    <Card
      ref={containerRef}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <CardContent>
        <Stage
          width={width}
          height={height}
          className="bg-white border border-gray-300 border-dashed"
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              onSelectId?.(null);
            }
          }}
        >
          <Layer>
            {images.map((img, index) => (
              <URLImage
                key={index}
                mode={mode}
                width={img.width ?? 200}
                draggable={mode === "edit"}
                src={img.src}
                x={img.x}
                y={img.y}
                isSelected={selectedId === img.id}
                onClick={() => onSelectId?.(img.id)}
                onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                  const pos = e.target.position();
                  onImagesChange?.(
                    images.map((it) =>
                      it.id === img.id ? { ...it, x: pos.x, y: pos.y } : it
                    )
                  );
                }}
                onTransformEnd={(newAttrs) => {
                  onImagesChange?.(
                    images.map((it) =>
                      it.id === img.id
                        ? {
                            ...it,
                            x: newAttrs.x,
                            y: newAttrs.y,
                            width: newAttrs.width,
                            height: newAttrs.height,
                          }
                        : it
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
                mode={mode}
                onSelect={() => onSelectId?.(label.id)}
                isSelected={selectedId === label.id}
                onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                  const pos = e.target.position();
                  onLabelsChange?.(
                    labels.map((l) =>
                      l.id === label.id ? { ...l, x: pos.x, y: pos.y } : l
                    )
                  );
                }}
              />
            ))}
          </Layer>
        </Stage>
      </CardContent>
    </Card>
  );
}
