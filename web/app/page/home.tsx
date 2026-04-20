import { Form, useActionData, useLoaderData, useSubmit } from "react-router";
import type { Route } from "./+types/home";
import { trpc } from "@/util";
import { VocabularyEditor } from "@/components/vocabulary-edit";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon, TrashIcon, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchImagesFromPixabay } from "@/lib/image-api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Learning Language through Picture and Audio" },
    {
      name: "description",
      content: "Learning Language through Picture and Audio",
    },
  ];
}

export const loader = async () => {};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const query = formData.get("query") as string;
  if (!query) return { images: [] };
  const hits = await fetchImagesFromPixabay(query);
  return { images: hits ?? [] };
};

export default function Home() {
  const initialNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [numbers, setNumbers] = useState(initialNumbers);
  const [wordMap, setWordMap] = useState<Record<number, string>>({});

  const handleWordChange = (num: number, value: string) => {
    setWordMap((prev) => ({ ...prev, [num]: value }));
  };

  const handleDelete = (item: string) => {
    setNumbers((prev) => prev.filter((num) => num !== Number(item)));
    setWordMap((prev) => {
      const newMap = { ...prev };
      delete newMap[Number(item)];
      return newMap;
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

    if (window.speechSynthesis.getVoices().length > 0) {
      applyVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = applyVoiceAndSpeak;
    }
  };

  const [imageSearch, setImageSearch] = useState("");
  const submit = useSubmit();
  const handleImageSearch = () => {
    if (!imageSearch.trim()) return;
    const formData = new FormData();
    formData.append("query", imageSearch);
    submit(formData, { method: "post" });
  };

  const actionData = useActionData<typeof action>();

  return (
    <div className="pt-16 p-4 container mx-auto">
      <h1 className="text-3xl font-bold text-primary text-center">
        Learning Language through Picture and Audio
      </h1>

      <div className="mt-8 flex justify-center items-start gap-3">
        <div
          className={cn(
            "flex flex-col p-4 bg-gray-100 rounded-lg shrink-0 w-64"
          )}
        >
          <span>Image Search</span>
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search images..."
              value={imageSearch}
              onChange={(e) => setImageSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImageSearch()}
            />
          </div>
          <div className={cn("max-h-[560px] overflow-y-auto mt-2")}>
            <div className="columns-2 gap-2">
              {actionData?.images?.length === 0 && (
                <p className="col-span-2 text-gray-400 text-center py-4">
                  No Results
                </p>
              )}
              {actionData?.images?.map((img) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("imageUrl", img.largeImageURL);
                  }}
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
        <VocabularyEditor width={700} height={600} />
        <div className="flex flex-col p-4 bg-gray-100 rounded-lg h-fit">
          <div className="text-gray-600 flex justify-between">
            <span>Word List</span>
            <Button
              variant="outline"
              onClick={() => {
                setNumbers((prev) => [...prev, prev.length + 1]);
              }}
            >
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>
          {numbers.map((item, index) => (
            <div key={item} className="flex items-center gap-2">
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("labelNumber", String(item));
                }}
                className={cn(
                  "w-6 h-6 rounded-full bg-white text-gray-700 flex items-center justify-center border border-gray-400",
                  "cursor-grab text-lg hover:bg-gray-100 active:cursor-grabbing select-none"
                )}
              >
                {item}
              </div>
              <input
                type="text"
                placeholder=""
                value={wordMap[item] ?? ""}
                onChange={(e) => handleWordChange(item, e.target.value)}
                className={cn(
                  "w-32 border border-gray-300 rounded px-2 py-0.5 text-sm",
                  "focus: outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                )}
              />
              <Button
                variant="outline"
                onClick={() => speak(wordMap[item] ?? "")}
                disabled={!wordMap[item]}
                size="sm"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={index !== numbers.length - 1}
                onClick={() => handleDelete(String(item))}
              >
                <TrashIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
