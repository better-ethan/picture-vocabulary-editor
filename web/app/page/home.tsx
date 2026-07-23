import { createTrpcClient, trpc } from "@/util";
import type { Route } from "./+types/home";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import { useLoaderData } from "react-router";
import {
  VocabularyCanvas,
  type CanvasContent,
} from "@/components/vocabulary-edit";
import { Card, CardContent } from "@/components/ui/Card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Learning English through Picture and Audio" },
    {
      name: "description",
      content: "Learning English through Picture and Audio",
    },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  //FIXME: hardcode for now, should be dynamic
  const id = "8uIOXvr4aY-3e5tu";

  const trpc = createTrpcClient(request);

  const lesson = await trpc.pictureLesson.getById.query({
    id,
  });

  if (!lesson) {
    throw new Response("Not Found", { status: 404 });
  }

  return { lesson };
};

export default function Page() {
  const { lesson } = useLoaderData<typeof loader>();
  const { images, labels, lines, words } =
    lesson.content as unknown as CanvasContent;

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <Text as={"h2"} className="text-center">
        Learning English through <TextWithHighlight text="Picture" /> and{" "}
        <TextWithHighlight text="Audio" />
      </Text>
      <div className="w-full max-w-160">
        <VocabularyCanvas
          mode="view"
          images={images}
          labels={labels}
          lines={lines}
          words={words}
        />
      </div>
      <div className="flex flex-col items-center w-full max-w-4xl">
        <Text as="h2" className="text-center">
          Why we need picture and audio?
        </Text>
        <p className="text-muted-foreground text-center mt-2 mb-8">
          Learning with visuals and sound accelerates your English journey
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {[
            {
              icon: "🖼️",
              title: "Pictures make meaning clear",
              desc: "You don't need to translate into your native language. This helps you think directly in English.",
              img: "/images/picture-benefit-1.webp",
              alt: "Pictures make meaning clear",
            },
            {
              icon: "🧠",
              title: "Pictures improve memory",
              desc: "People generally remember information better when it is presented as both words and images.",
              img: "/images/picture-benefit-2.webp",
              alt: "Pictures improve memory",
            },
            {
              icon: "🎙️",
              title: "Audio teaches correct pronunciation",
              desc: "Audio helps us learn correct pronunciation.",
              img: "/images/audio-benefit-1.webp",
              alt: "Audio teaches correct pronunciation",
            },
            {
              icon: "👂",
              title: "Audio improves listening skills",
              desc: "Reading a word doesn't mean you'll recognize it in conversation. Listening repeatedly trains your brain to identify words in natural speech.",
              img: "/images/audio-benefit-2.webp",
              alt: "Audio improves listening skills",
            },
          ].map((item) => (
            <Card key={item.title} className="shadow-sm">
              <CardContent>
                <div className="overflow-hidden">
                  <img
                    src={item.img}
                    className="w-auto h-48 mx-auto transition-transform duration-300 hover:scale-105"
                    alt={item.alt}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <Text as="h4">{item.title}</Text>
                  </div>
                  <Text className="text-muted-foreground">{item.desc}</Text>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-4xl gap-6">
        <Text as="h2" className="text-center">
          How to Create a Visual Vocabulary in{" "}
          <TextWithHighlight text="3 Simple Steps" />
        </Text>
        <Text className="text-muted-foreground">
          It's designed to make creating visual vocabulary super easy
        </Text>

        <div className="flex flex-col md:flex-row md:items-stretch gap-4 w-full">
          {[
            {
              step: "01",
              title: "Add Pictures",
              desc: "Add pictures. We'll arrange them into a neat grid automatically.",
              img: "/images/how-to-add-pictures-edited.webp",
              alt: "Add pictures. We'll arrange them into a neat grid automatically.",
            },
            {
              step: "02",
              title: "Add Words",
              desc: "Add words. We'll generate the audio and place the number labels.",
              img: "/images/how-to-add-words-edited.webp",
              alt: "Add words. We'll generate the audio and place the number labels.",
            },
            {
              step: "03",
              title: "Fill Form and Save",
              desc: "Fill in the details and save.",
              img: "/images/how-to-fill-form-save-edited.webp",
              alt: "Fill in the details and save.",
            },
          ].map((item, index, arr) => (
            <div
              key={item.title}
              className="flex md:flex-col flex-row md:w-1/3 w-full items-start gap-4"
            >
              <Card className="shadow-sm w-full h-full">
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {item.step}
                    </span>
                    <Text as="h4">{item.title}</Text>
                  </div>
                  <div className="overflow-hidden rounded-md mb-3">
                    <ZoomableImage
                      src={item.img}
                      alt={item.alt}
                      className="w-full h-40 md:h-56 object-contain mx-auto transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <Text className="text-muted-foreground">{item.desc}</Text>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TextWithHighlight({ text }: { text: string }) {
  return (
    <span className="relative inline-block z-10">
      <span
        className={cn(
          "absolute top-[35%] -left-1 -right-1 h-[60%] -rotate-3 -z-10",
          "rounded-full bg-primary"
        )}
      ></span>
      <span className="relative">{text}</span>
    </span>
  );
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={cn("cursor-zoom-in", className)}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-gray-300"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <img
              src={src}
              alt={alt}
              className="w-full h-auto max-h-[85dvh] object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
