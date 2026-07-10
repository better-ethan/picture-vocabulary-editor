import { Button } from "@/components/retroui/Button";
import { Drawer } from "@/components/retroui/Drawer";
import { Text } from "@/components/retroui/Text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/retroui/Popover";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { MenuIcon, User2Icon } from "lucide-react";
import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useLoaderData,
} from "react-router";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/retroui/navigation-menu";
import { createTrpcClient } from "@/util";
import type { Route } from "./+types/public-layout";
import { useState } from "react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const category = await trpc.category.list.query();

  return {
    category,
  };
};

const baseDrawerLinkClasses =
  "font-bold text-black decoration-2 underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline";

export default function PublicLayout() {
  const { category } = useLoaderData<typeof loader>();
  const { data: session } = authClient.useSession();

  const [navigationMenuOpened, setNavigationMenuOpened] = useState<
    string | undefined
  >(undefined);

  return (
    <div className={cn("flex flex-col h-screen overflow-hidden")}>
      <nav className="relative sticky top-0 z-50 border-b-2 border-black bg-white px-4 py-2 md:px-8">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
          <Link className="flex cursor-pointer items-center gap-2" to="/">
            <Text className="text-2xl text-black font-display font-black uppercase">
              EASY ENGLISH
            </Text>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <NavigationMenu
              value={navigationMenuOpened}
              onValueChange={setNavigationMenuOpened}
              viewport={false}
            >
              <NavigationMenuList className={"flex gap-1"}>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/how-it-works"
                      className={cn("font-bold text-black")}
                    >
                      How it works
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem value="lessons">
                  <NavigationMenuTrigger
                    className={cn("font-bold text-black [&_svg]:size-4")}
                  >
                    Lessons
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-1/2 -translate-x-1/2">
                    <div className="grid w-150 grid-cols-[1fr_1.5fr] gap-0">
                      <div className="flex flex-col justify-between rounded-l-md bg-gradient-to-b from-yellow-400 to-yellow-500 p-5 text-white">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest opacity-90">
                            Get Started
                          </p>
                          <h3 className="mt-2 text-lg font-bold leading-tight">
                            Find your perfect lesson
                          </h3>
                          <p className="mt-2 text-sm opacity-80">
                            Browse all categories and skill levels.
                          </p>
                        </div>
                        <NavigationMenuLink
                          asChild
                          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4 hover:opacity-80"
                        >
                          <Link
                            to="/category/all"
                            onClick={() => setNavigationMenuOpened(undefined)}
                          >
                            View all lessons →
                          </Link>
                        </NavigationMenuLink>
                      </div>

                      <ul className="grid grid-cols-2 gap-1 p-3">
                        {category.map((cat) => (
                          <li key={cat.slug}>
                            <NavigationMenuLink
                              asChild
                              className="flex flex-col gap-0.5 rounded-md p-3 items-start transition-colors hover:bg-accent"
                            >
                              <Link
                                to={`/category/${cat.slug}`}
                                onClick={() =>
                                  setNavigationMenuOpened(undefined)
                                }
                              >
                                <span className="font-medium text-sm">
                                  {cat.name}
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/pricing" className={cn("font-bold text-black")}>
                      Pricing
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="ml-2 flex items-center gap-3">
              {session ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon">
                      <User2Icon className="size-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col gap-6">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/admin/user/profile" className="uppercase">
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => authClient.signOut()}
                      >
                        Log out
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link to="/signin" className="uppercase">
                    Log in
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <Drawer direction="right">
              <Drawer.Trigger asChild>
                <Button size="icon">
                  <MenuIcon className="size-4" />
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
                  {session ? (
                    <>
                      <Link
                        to="/admin/user/profile"
                        className={cn(baseDrawerLinkClasses)}
                      >
                        Profile
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => authClient.signOut()}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <Link to="/signin" className={cn(baseDrawerLinkClasses)}>
                      Log in
                    </Link>
                  )}
                </div>
              </Drawer.Content>
            </Drawer>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto px-4 pb-8 max-w-screen-2xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
