import { fetchUtil, proxyResponse } from "@/util";
import type { Route } from "./+types/auth";
import { redirect } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const response = await fetchUtil({
    basicPath: url.pathname + url.search + url.hash,
    request,
  });

  return proxyResponse(response);
};

export const action = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url);
  const response = await fetchUtil({
    basicPath: url.pathname + url.search + url.hash,
    method: request.method,
    body: request.body ?? undefined,
    request,
  });

  return proxyResponse(response);
};
