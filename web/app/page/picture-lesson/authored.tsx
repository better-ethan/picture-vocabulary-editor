import {
  Link,
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { createTrpcClient } from "@/util";
import { EmptyContent, EmptyTitle, Empty } from "@/components/ui/Empty";
import type { Route } from "./+types/list";
import { Text } from "@/components/ui/Text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const result = await trpc.pictureLesson.authored.query({});

  return result;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

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
    }
  }, []);

  return (
    <div className="max-w-5xl w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Text as={"h2"} className="mb-4 text-start">
          My Authored
        </Text>
        <span>
          {data.length} lesson{data.length > 1 ? "s" : ""}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex justify-center mt-16">
          <Empty>
            <EmptyContent>
              <EmptyTitle>No Picture Lessons Yet</EmptyTitle>
            </EmptyContent>
          </Empty>
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto p-2",
            "justify-items-center w-full"
          )}
        >
          {data.map((item, index) => (
            <Card className="w-full shadow-sm" key={index}>
              <CardContent className="flex items-center justify-center pb-0">
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
                      to={`/admin/picture-lesson/${item.id}/${item.slug}/edit`}
                    >
                      Edit
                    </Link>
                  }
                  className="shadow-sm"
                ></Button>
                <Button
                  size={"sm"}
                  variant={"secondary"}
                  render={
                    <Link
                      to={`/picture-lesson/${item.id}/${item.slug}`}
                      target="_blank"
                    >
                      View
                      <ArrowUpRightIcon className="size-5" />
                    </Link>
                  }
                  className="shadow-sm"
                ></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
