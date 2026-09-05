import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@app/server";
import { redirect, type MetaDescriptor } from "react-router";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const TRPC_SERVER_URL =
  import.meta.env.VITE_TRPC_SERVER_URL ?? "http://localhost:4000/trpc";

const getTrpcUrl = () => {
  if (typeof window !== "undefined") {
    const trpcServerDomain = new URL(TRPC_SERVER_URL).hostname;
    // in the docker environment, the trpc client on the browser cannot access the trpc server on the docker network,
    // so we need to replace the domain with the current hostname
    if (trpcServerDomain !== window.location.hostname) {
      return TRPC_SERVER_URL.replace(
        trpcServerDomain,
        window.location.hostname
      );
    }
  }

  return TRPC_SERVER_URL;
};
export const createTrpcClient = (request?: Request) =>
  createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getTrpcUrl(),
        headers: request
          ? { cookie: request.headers.get("cookie") ?? "" }
          : undefined,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
      }),
    ],
  });

export const trpc = createTrpcClient();

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export const fetchUtil = async ({
  host = API_BASE_URL,
  basicPath = "/",
  method = "GET",
  headers,
  body,
  request,
}: {
  host?: string;
  basicPath?: string;
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  request?: Request;
}) => {
  const result = await fetch(`${host}${basicPath}`, {
    method,
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",

      // See https://expressjs.com/en/guide/behind-proxies.html
      "X-Forwarded-For": request?.headers.get("X-Forwarded-For") ?? "",
      "X-Forwarded-Host": request?.headers.get("X-Forwarded-Host") ?? "",

      // better-auth captcha plugin
      "x-captcha-response": request?.headers.get("x-captcha-response") ?? "",

      // stripe webhook
      ...(request?.headers.get("stripe-signature")
        ? {
            "stripe-signature": request.headers.get(
              "stripe-signature"
            ) as string,
          }
        : {}),

      cookie: request?.headers.get("Cookie") as string,
      ...headers,
    },
    body,
    ...(body ? { duplex: "half" } : {}),
  });

  return result;
};

export const proxyResponse = (response: Response) => {
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      const res = redirect(location);
      response.headers.getSetCookie().forEach((cookie) => {
        res.headers.append("Set-Cookie", cookie);
      });
      return res;
    }
  }
  return response;
};

export interface MatchItem {
  id?: string;
  meta?: MetaDescriptor[];
}

export function getRootTitle(matches: Array<MatchItem>): string | undefined {
  const rootMeta = matches.find((match) => match?.id === "root")?.meta;
  return rootMeta?.find((meta): meta is { title: string } => "title" in meta)
    ?.title;
}

export function buildPageTitle(
  pageTitle: string,
  matches: Array<MatchItem>
): string {
  const rootTitle = getRootTitle(matches);
  return pageTitle + (rootTitle ? ` | ${rootTitle}` : "");
}
