import { createTrpcClient } from "@/util";
import { useLoaderData } from "react-router";
import { Text } from "@/components/ui/Text";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import privacyPolicyContent from "@/content/legal/privacy-policy.md?raw";

export default function Page() {
  return (
    <div className="p-4 container mx-auto max-w-4xl">
      <article className="prose">
        <Markdown rehypePlugins={[rehypeRaw]}>{privacyPolicyContent}</Markdown>
      </article>
    </div>
  );
}
