import Fastify from "fastify";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";

import { AppRouter, appRouter } from "./main.js";

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

server.get("/health", async () => {
  return `ok😄 at ${new Date().toISOString()}`;
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 4000;
server.listen(
  {
    port,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running on ${address}`);
  }
);
