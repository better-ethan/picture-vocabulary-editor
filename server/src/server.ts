import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastifyRawBody from "fastify-raw-body";

import { AppRouter, appRouter } from "./main.js";
import { auth } from "./lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { createContext } from "./trpc.js";

const server = Fastify({
  logger: true,
});

server.register(cookie);

server.register(cors, {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

// need await to ensure that the raw body is available for the Stripe webhook route
await server.register(fastifyRawBody, {
  field: "rawBody",
  global: false,
  encoding: "utf8",
  runFirst: true,
});

server.get("/health", async () => {
  return `ok😄 at ${new Date().toISOString()}`;
});

server.post(
  "/api/auth/stripe/webhook",
  { config: { rawBody: true } },
  async (request, reply) => {
    return handleAuthRequest(request, reply, request.rawBody as string);
  }
);

server.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    const body = request.body ? JSON.stringify(request.body) : undefined;
    return handleAuthRequest(request, reply, body);
  },
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
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

type BodyInit = string | Buffer | Uint8Array | null;

async function handleAuthRequest(
  request: FastifyRequest,
  reply: FastifyReply,
  body?: BodyInit
) {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const headers = fromNodeHeaders(request.headers);

    if (!headers.get("origin")) {
      const referer = request.headers.referer || request.headers.referrer;
      if (referer) {
        headers.set("origin", new URL(referer as string).origin);
      } else {
        headers.set("origin", "http://localhost:3000");
      }
    }

    const req = new Request(url.toString(), {
      method: request.method,
      headers,
      ...(body !== undefined ? { body } : {}),
    });

    const response = await auth.handler(req);

    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));

    return reply.send(response.body ? await response.text() : null);
  } catch (err) {
    server.log.error(err, "Authentication Error");
    return reply
      .status(500)
      .send({ error: "Internal Server Error", code: "AUTH_FAILURE" });
  }
}
