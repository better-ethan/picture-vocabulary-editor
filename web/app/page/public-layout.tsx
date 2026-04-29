import { Button } from "@/components/retroui/Button";
import { Drawer } from "@/components/retroui/Drawer";
import { Text } from "@/components/retroui/Text";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { Link, Outlet } from "react-router";

const baseDrawerLinkClasses =
  "font-bold text-black decoration-2 underline-offset-4 transition-colors hover:text-[#3B82F6] hover:underline";

export default function PublicLayout() {
  return (
    <div className={cn("flex flex-col h-screen overflow-hidden")}>
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
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
