import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { createTrpcClient } from "@/util";
import {
  EmptyContent,
  EmptyTitle,
  Empty,
  EmptyHeader,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import type { Route } from "./+types/list";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon, CloudAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { FREE_LIMIT } from "@package/shared";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const vocab = await trpc.pictureVocab.authored.query({});

  const subscriptionStatus = await trpc.stripe.getSubscriptionStatus.query();

  return {
    vocab,
    subscriptionStatus,
  };
};

export default function Page() {
  const { vocab, subscriptionStatus } = useLoaderData<typeof loader>();

  const { data, page, limit, total } = vocab;

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const searchParams = new URLSearchParams(location.search);
  useEffect(() => {
    if (state?.created || state?.updated) {
      toast.success(`${state.created ? "Created" : "Updated"} successfully!`);
      // Remove the state
      navigate(location.pathname, { replace: true, state: {} });
    } else if (searchParams.get("deleted") === "true") {
      toast.success("Deleted successfully!");
      // Remove the deleted query parameter from the URL
      navigate(location.pathname, { replace: true });
    } else if (searchParams.get("limit_reached") === "true") {
      toast.error(
        `You've reached the free plan limit (${total} / ${FREE_LIMIT} vocabs). Upgrade to Pro to create more vocabs.`
      );
      // Remove the limit_reached query parameter from the URL
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, state]);

  const isPro = subscriptionStatus && subscriptionStatus.status === "active";
  const isAtLimit = !isPro && data.length >= FREE_LIMIT;

  return (
    <div className="max-w-5xl w-full h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Text as={"h2"} className="mb-4 text-start">
          My Authored
        </Text>
        <span>
          {data.length} vocab{data.length > 1 ? "s" : ""}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Empty className="w-full max-w-md shadow-sm">
            <EmptyHeader>
              <EmptyMedia variant="default" className="bg-inherit">
                <CloudAlertIcon className="size-10" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">
                No Visual Vocabulary Yet
              </EmptyTitle>
              <EmptyDescription className="">
                You haven't created any visual vocabulary yet. Create your first
                one and share your knowledge with others!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                className="shadow-sm"
                render={<Link to="/admin/picture-vocab/create">Create</Link>}
                nativeButton={false}
              ></Button>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div>
          {!isPro && (
            <div
              className={cn(
                "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-2 rounded-lg mb-4 text-sm",
                isAtLimit
                  ? "bg-amber-50 border border-amber-400 text-amber-800"
                  : "bg-blue-50 border border-blue-200 text-blue-700"
              )}
            >
              <span>
                {isAtLimit
                  ? `🔒 You've reached the free plan limit (${total} / ${FREE_LIMIT} vocabs).`
                  : `Free plan: ${total} / ${FREE_LIMIT} vocabs used.`}
              </span>
              <Button
                variant="secondary"
                className="shadow-sm text-sm"
                render={<Link to="/pricing/plan">✨ Upgrade to Pro</Link>}
                nativeButton={false}
              />
            </div>
          )}
          <div
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto p-2",
              "justify-items-center w-full "
            )}
          >
            {data.map((item, index) => (
              <Card className="w-full shadow-sm pt-2" key={index}>
                <CardContent className="flex flex-col gap-1 justify-center items-center pb-0">
                  <span
                    className={cn(
                      "text-xs w-fit px-2 py-0.5 rounded-full font-medium self-end",
                      item.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-muted-foreground"
                    )}
                  >
                    {item.status === "published" ? "🌍 Published" : "📝 Draft"}
                  </span>
                  <img className="w-full h-auto" src={item.thumbnail} />
                </CardContent>
                <CardHeader className="pb-0">
                  <CardTitle className="text-base font-normal">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-end">
                  <Button
                    size={"sm"}
                    render={
                      <Link
                        to={`/admin/picture-vocab/${item.id}/${item.slug}/edit`}
                      >
                        Edit
                      </Link>
                    }
                    nativeButton={false}
                    className="shadow-sm"
                  ></Button>
                  <Button
                    size={"sm"}
                    variant={"secondary"}
                    render={
                      <Link
                        to={`/picture-vocab/${item.id}/${item.slug}`}
                        target="_blank"
                      >
                        View
                        <ArrowUpRightIcon className="size-5" />
                      </Link>
                    }
                    nativeButton={false}
                    className="shadow-sm"
                  ></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
