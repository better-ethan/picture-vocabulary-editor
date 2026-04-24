import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@app/server";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.SERVER_URL || "http://127.0.0.1:4000/trpc",
    }),
  ],
});

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
