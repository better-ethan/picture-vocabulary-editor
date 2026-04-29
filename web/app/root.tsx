import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "@/main.css";
import { Toaster } from "@/components/retroui/Sonner";
import { TRPCProvider, trpc } from "@/util";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Drawer } from "@/components/retroui/Drawer";
import { HamburgerIcon, MenuIcon } from "lucide-react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@300..700&display=swap",
  },
];

const baseDrawerLinkClasses =
  "font-bold text-black decoration-2 underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline";
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={cn(
          "absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"
        )}
      >
        <nav className="relative sticky top-0 z-50 border-b-2 border-black bg-white px-4 py-4 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link className="flex cursor-pointer items-center gap-2" to="/">
              <Text className="text-2xl text-black font-display font-black uppercase">
                Picture Lesson
              </Text>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              <Link
                className="font-bold text-black decoration-2 underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline"
                to="/how-it-works"
              >
                How it works
              </Link>
              <Link
                className=" font-bold text-black decoration-2 underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline"
                to="/picture-lesson/list"
              >
                Lessons
              </Link>
              <Link
                className=" font-bold text-black decoration-2 underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline"
                to="/pricing"
              >
                Pricing
              </Link>
              <div className="ml-2 flex items-center gap-3">
                <Button asChild variant="default" size="sm">
                  <Link to="/signin" className="uppercase">
                    Log in
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 md:hidden">
              <Drawer direction="right">
                <Drawer.Trigger asChild>
                  <Button size="icon">
                    <MenuIcon />
                  </Button>
                </Drawer.Trigger>
                <Drawer.Content>
                  <div className="flex h-full flex-col gap-8 p-4">
                    <Link
                      to="/how-it-works"
                      className={cn(baseDrawerLinkClasses)}
                    >
                      How it works
                    </Link>
                    <Link
                      to="/picture-lesson/list"
                      className={cn(baseDrawerLinkClasses)}
                    >
                      Lessons
                    </Link>
                    <Link to="/pricing" className={cn(baseDrawerLinkClasses)}>
                      Pricing
                    </Link>
                    <Link to="/signin" className={cn(baseDrawerLinkClasses)}>
                      Log in
                    </Link>
                  </div>
                </Drawer.Content>
              </Drawer>
            </div>
          </div>
        </nav>
        <Toaster position="top-center" />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function App() {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpc} queryClient={queryClient}>
        <Outlet />
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
