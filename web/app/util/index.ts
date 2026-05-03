import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@app/server";
import { redirect } from "react-router";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.SERVER_URL || "http://127.0.0.1:4000/trpc",
    }),
  ],
});

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

const API_BASE_URL = import.meta.env.API_BASE_URL ?? "http://localhost:4000";

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
