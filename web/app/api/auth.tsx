import { fetchUtil } from "@/util";
import type { Route } from "./+types/auth";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const response = await fetchUtil({ basicPath: url.pathname, request });
};

export const action = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url);
  const response = await fetchUtil({
    basicPath: url.pathname,
    method: request.method,
    body: request.body ?? undefined,
    request,
  });

  return response;
};
