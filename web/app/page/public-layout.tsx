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
import { Link, Outlet } from "react-router";

const baseDrawerLinkClasses =
  "font-bold text-black decoration-2 underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline";

export default function PublicLayout() {
  const { data: session } = authClient.useSession();
  return (
    <div className={cn("flex flex-col h-screen overflow-hidden")}>
      <nav className="relative sticky top-0 z-50 border-b-2 border-black bg-white px-4 py-2 md:px-8">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
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
