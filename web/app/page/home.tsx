import { Form, useActionData, useLoaderData, useSubmit } from "react-router";
import type { Route } from "./+types/home";
import { trpc } from "@/util";
import { VocabularyEditor } from "@/components/vocabulary-edit";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon, TrashIcon, Volume2 } from "lucide-react";

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

export const action = async ({ request }: Route.ActionArgs) => {};

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

  return (
    <div className="pt-16 p-4 container mx-auto">
      <h1 className="text-3xl font-bold text-primary text-center">
        Learning Language through Picture and Audio
      </h1>

      <div className="mt-8 flex justify-center">
        <VocabularyEditor width={800} height={600} />
        <div className="flex flex-col gap-3 p-4 bg-gray-100 rounded-lg h-fit">
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
