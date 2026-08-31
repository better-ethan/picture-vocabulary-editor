import { buildPageTitle, createTrpcClient, type MatchItem } from "@/util";
import { useLoaderData } from "react-router";
import { Text } from "@/components/ui/text";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import privacyPolicyContent from "@/content/legal/privacy-policy.md?raw";
import type { Route } from "./+types/privacy-policy";

export const meta: Route.MetaFunction = ({ matches }: Route.MetaArgs) => {
  const pageTitle = buildPageTitle("Privacy policy", matches as MatchItem[]);
  return [{ title: pageTitle }];
};

export default function Page() {
  return (
    <div className="p-4 container mx-auto max-w-4xl">
      <article className="prose">
        <Markdown rehypePlugins={[rehypeRaw]}>{privacyPolicyContent}</Markdown>
      </article>
    </div>
  );
}
