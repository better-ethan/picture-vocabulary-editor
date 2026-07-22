import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  BookAIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  User2Icon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import type { Route } from "./+types/admin-layout";
import { createTrpcClient } from "@/util";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const trpc = createTrpcClient(request);

  const currentUser = await trpc.user.getCurrentUser.query();

  if (!currentUser) {
    throw redirect("/login");
  }

  return { currentUser };
};

const menuSections: MenuSection[] = [
  {
    title: "Picture Lesson",
    icon: BookAIcon,
    items: [
      { label: "Create", path: "/admin/picture-lesson/create" },
      { label: "Authored", path: "/admin/picture-lesson/authored" },
    ],
  },
];

export default function AdminLayout() {
  const { currentUser } = useLoaderData<typeof loader>();

  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex mx-auto max-w-screen-2xl h-dvh flex-col md:flex-row overflow-hidden">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <Drawer.Trigger asChild className="md:hidden self-start">
          <Button type="button" variant={"link"} size={"icon"}>
            <MenuIcon className="size-6" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header className="flex flex-row items-center justify-between">
            <Drawer.Title>MENU</Drawer.Title>
            <Drawer.Close asChild>
              <Button type="button" variant={"link"} size={"icon"}>
                <XIcon />
              </Button>
            </Drawer.Close>
          </Drawer.Header>
          <div className="flex-1">
            <MenuContent
              sections={menuSections}
              username={currentUser?.name?.trim() || currentUser?.email}
              onItemClick={() => setOpen(false)}
            />
          </div>
        </Drawer.Content>
      </Drawer>
      <aside
        className={cn(
          "hidden md:block bg-white transition-all duration-300 ease-in-out overflow-hidden",
          "border-r-2",
          sidebarCollapsed ? "w-10" : "w-64"
        )}
      >
        {sidebarCollapsed ? (
          <Button
            variant={"link"}
            size={"icon"}
            onClick={() => setSidebarCollapsed(false)}
          >
            <MenuIcon className="size-6" />
          </Button>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex justify-between py-4">
              <Button
                render={
                  <Link to="/" className="hover:text-[#3B82F6]">
                    Easy English
                  </Link>
                }
                nativeButton={false}
                variant="link"
              ></Button>
              <Button
                variant={"link"}
                size={"icon"}
                onClick={() => setSidebarCollapsed(true)}
                className="hover:bg-primary/20"
              >
                <XIcon className="size-6" />
              </Button>
            </div>

            <div className="flex-1">
              <MenuContent
                sections={menuSections}
                username={currentUser?.name?.trim() || currentUser?.email}
                onItemClick={() => setSidebarCollapsed(false)}
              />
            </div>
          </div>
        )}
      </aside>
      <main className="flex justify-center w-full py-2 px-1.5 lg:p-3 overflow-hidden h-full">
        <Outlet />
      </main>
    </div>
  );
}

interface MenuSection {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: {
    label: string;
    path: string;
  }[];
}
function MenuContent({
  sections,
  onItemClick,
  username,
}: {
  sections: MenuSection[];
  onItemClick: () => void;
  username: string;
}) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const isActive = (currentPath: string, itemPath: string) =>
    currentPath === itemPath;
  return (
    <nav className="flex flex-col justify-between h-full p-2">
      <div>
        {sections.map((section, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-medium uppercase"
              )}
            >
              <section.icon className="size-5" />
              <span>{section.title}</span>
            </div>
            {section.items.map((item, index) => {
              return (
                <Button
                  render={<Link to={item.path}>{item.label}</Link>}
                  nativeButton={false}
                  key={index}
                  onClick={onItemClick}
                  variant="link"
                  className={cn(
                    "w-full justify-start text-sm font-medium",
                    "hover:bg-primary/20 hover:no-underline",
                    isActive(currentPath, item.path) &&
                      "bg-primary shadow-xs border-2"
                  )}
                ></Button>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm font-medium uppercase">
            <SettingsIcon className="size-5" />
            <span>Settings</span>
          </div>
          <Button
            render={<Link to="/admin/user/profile">My Profile</Link>}
            nativeButton={false}
            variant={"link"}
            className={cn(
              "w-full justify-start text-sm font-medium",
              "hover:bg-primary/20 hover:no-underline",
              isActive(currentPath, "/admin/user/profile") &&
                "bg-primary shadow-xs border-2"
            )}
          ></Button>
          <Button
            render={
              <Link to="/admin/user/change-password">Change Password</Link>
            }
            nativeButton={false}
            variant={"link"}
            className={cn(
              "w-full justify-start text-sm font-medium",
              "hover:bg-primary/20 hover:no-underline",
              isActive(currentPath, "/admin/user/change-password") &&
                "bg-primary shadow-xs border-2"
            )}
          ></Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-full flex justify-center items-center bg-blue-500 text-white shrink-0">
              <User2Icon fill="white" strokeWidth={0} />
            </div>
            <span className="truncate">{username}</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"link"}
                size={"icon"}
                onClick={() => authClient.signOut()}
              >
                <LogOutIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="solid">Log Out</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}
