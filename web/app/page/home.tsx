import type { Route } from "./+types/home";
import { VocabularyEditor } from "@/components/vocabulary-edit";

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

export default function Home() {
  return (
    <div className="pt-16 p-4 container mx-auto">
      <h1 className="text-3xl font-bold text-primary text-center">
        Learning Language through Picture and Audio
      </h1>
      <div className="mt-8 flex justify-center">
        <VocabularyEditor width={700} height={600} />
      </div>
    </div>
  );
}
