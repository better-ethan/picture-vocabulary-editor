import { createRequestHandler } from "@react-router/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const reactRouterHandler = createRequestHandler({
  // https://github.com/remix-run/remix/issues/8343
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:react-router/server-build")
    : // @ts-expect-error ts cannot verify the type of build
      await import("./build/server/index.js"),
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));
app.use(express.static("./public", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*splat", reactRouterHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`The Express server is listening at http://localhost:${port}`)
);

process.on("unhandledRejection", (err) => {
  console.log("### unhandledRejection ###");
  console.error(err);
});

process.on("uncaughtException", (err) => {
  console.log("### uncaughtException ###");
  console.error(err);
});
