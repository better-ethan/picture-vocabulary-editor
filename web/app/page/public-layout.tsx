import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Text } from "@/components/ui/Text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, MenuIcon, User2Icon } from "lucide-react";
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
  NavigationMenuPositioner,
} from "@/components/ui/navigation-menu";
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

  const [navigationMenuOpened, setNavigationMenuOpened] = useState<true | null>(
    null
  );

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [lessonsOpened, setLessonsOpened] = useState(false);

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
              align="center"
              sideOffset={16}
            >
              <NavigationMenuList className={"flex gap-1"}>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <Link
                        to="/how-it-works"
                        className={cn("font-bold text-black")}
                      />
                    }
                  >
                    How it works
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn("font-bold text-black [&_svg]:size-4")}
                  >
                    Lessons
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-150 grid-cols-[1fr_1.5fr] gap-0">
                      <div className="flex flex-col justify-between rounded-l-md bg-gradient-to-b from-yellow-400 to-yellow-500 p-5 text-white">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-widest opacity-90">
                            Get Started
                          </p>
                          <h3 className="mt-2 text-lg font-bold leading-tight">
                            Find your perfect lesson
                          </h3>
                          <p className="mt-2 text-sm opacity-90">
                            Browse all categories and skill levels.
                          </p>
                        </div>
                        <NavigationMenuLink
                          render={
                            <Link
                              to="/category/all"
                              onClick={() => setNavigationMenuOpened(null)}
                            />
                          }
                          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4 hover:opacity-80"
                        >
                          View all lessons →
                        </NavigationMenuLink>
                      </div>

                      <ul className="grid grid-cols-2 gap-1 p-3">
                        {category.map((cat) => (
                          <li key={cat.slug}>
                            <NavigationMenuLink
                              render={<Link to={`/category/${cat.slug}`} />}
                              className="flex flex-col gap-0.5 rounded-md p-3 items-start transition-colors hover:bg-accent"
                              onClick={() => setNavigationMenuOpened(null)}
                            >
                              <span className="font-medium text-sm">
                                {cat.name}
                              </span>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <Link
                        to="/pricing"
                        className={cn("font-bold text-black")}
                      />
                    }
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="ml-2 flex items-center gap-3">
              {session ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="icon" className="shadow-sm">
                      <User2Icon className="size-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex flex-col gap-6">
                      <Button
                        render={
                          <Link to="/admin/user/profile" className="uppercase">
                            Profile
                          </Link>
                        }
                        variant="outline"
                        size="sm"
                        className="shadow-sm"
                      ></Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => authClient.signOut()}
                        className="shadow-sm"
                      >
                        Log out
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  render={
                    <Link to="/signin" className="uppercase">
                      Log in
                    </Link>
                  }
                  variant="default"
                  size="sm"
                  className="shadow-sm"
                ></Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <Drawer
              direction="right"
              open={drawerOpened}
              onOpenChange={setDrawerOpened}
            >
              <Drawer.Trigger asChild>
                <Button size="icon">
                  <MenuIcon className="size-4" />
                </Button>
              </Drawer.Trigger>
              <Drawer.Content className="flex flex-col py-4">
                <div className="flex flex-col h-dvh gap-8 p-4 overflow-y-auto">
                  <Link
                    to="/how-it-works"
                    className={cn(baseDrawerLinkClasses)}
                    onClick={() => setDrawerOpened(false)}
                  >
                    How it works
                  </Link>
                  <div className="flex flex-col gap-2">
                    <button
                      className={cn(
                        baseDrawerLinkClasses,
                        "flex items-center justify-between w-full text-left",
                        "hover:no-underline"
                      )}
                      onClick={() => setLessonsOpened((v) => !v)}
                    >
                      Lessons
                      <ChevronDownIcon
                        className={cn(
                          "size-4 transition-transform duration-200",
                          lessonsOpened && "rotate-180"
                        )}
                      />
                    </button>
                    {lessonsOpened && (
                      <div className="flex flex-col gap-2 pl-2 text-gray-800">
                        {category.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            className="text-base py-2"
                            onClick={() => setDrawerOpened(false)}
                          >
                            {cat.name}
                          </Link>
                        ))}
                        <Link
                          to="/category/all"
                          className="text-base py-2 underline"
                          onClick={() => setDrawerOpened(false)}
                        >
                          View All →
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/pricing"
                    className={cn(baseDrawerLinkClasses)}
                    onClick={() => setDrawerOpened(false)}
                  >
                    Pricing
                  </Link>
                  {session ? (
                    <>
                      <Link
                        to="/admin/user/profile"
                        className={cn(baseDrawerLinkClasses)}
                        onClick={() => setDrawerOpened(false)}
                      >
                        Profile
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          authClient.signOut();
                          setDrawerOpened(false);
                        }}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <Link
                      to="/signin"
                      className={cn(baseDrawerLinkClasses)}
                      onClick={() => setDrawerOpened(false)}
                    >
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
