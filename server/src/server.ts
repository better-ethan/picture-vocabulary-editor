import Fastify from "fastify";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";

import { AppRouter, appRouter } from "./main.js";
import { auth } from "./lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

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

server.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);

      const headers = fromNodeHeaders(request.headers);

      if (!headers.get("origin")) {
        const referer = request.headers.referer || request.headers.referrer;
        if (referer) {
          const refererUrl = new URL(referer as string);
          headers.set("origin", refererUrl.origin);
        } else {
          headers.set("origin", "http://localhost:3000");
        }
      }

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });

      const response = await auth.handler(req);

      reply.status(response.status);
      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      return reply.send(response.body ? await response.text() : null);
    } catch (err) {
      server.log.error("Authentication Error: ", err);
      return reply
        .status(500)
        .send({ error: "Internal Server Error", code: "AUTH_FAILURE" });
    }
  },
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
