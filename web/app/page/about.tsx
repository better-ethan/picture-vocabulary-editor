import { Text } from "@/components/ui/text";

export default function Page() {
  return (
    <div className="flex flex-col items-start gap-8 max-w-3xl mx-auto px-4 py-12">
      <div className="w-full border-b pb-4">
        <Text as="h2">About</Text>
      </div>

      <section className="flex flex-col gap-3">
        <Text as="h3">📖 Learn English with Pictures and Audio</Text>
        <div className="text-muted-foreground leading-relaxed flex flex-col gap-3">
          <p>
            PixVocab is a simple tool for learning English with pictures, words,
            and audio.
          </p>
          <p>
            We believe that learning a new word is easier when you can{" "}
            <span className="font-semibold text-foreground">
              see it, hear it, and understand it in context.
            </span>
          </p>
          <p>
            PixVocab lets you create visual vocabulary with pictures and words,
            making it easier to connect English words with their meanings.
          </p>
          <p>
            Whether you're a learner, teacher, or content creator, you can use
            PixVocab to create and explore visual vocabulary that makes English
            learning more engaging and memorable.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Text as="h3">🎯 Our Goal</Text>
        <div className="text-muted-foreground leading-relaxed flex flex-col gap-3">
          <p>
            Our goal is simple:{" "}
            <span className="font-semibold text-foreground">
              make learning English more visual, natural, and enjoyable.
            </span>
          </p>
          <p>
            We hope PixVocab can help you learn new words, remember them better,
            and build a stronger connection with English.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Text as="h3">🚀 Start Learning</Text>
        <div className="text-muted-foreground leading-relaxed flex flex-col gap-3">
          <p>
            Explore visual vocabulary and bring your English learning to life
            with pictures and audio.
          </p>
        </div>
      </section>
    </div>
  );
}
