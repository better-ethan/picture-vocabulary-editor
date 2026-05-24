import { Button } from "@/components/retroui/Button";
import { Drawer } from "@/components/retroui/Drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/retroui/Tooltip";

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
import { Link, Outlet, useLocation, useNavigate } from "react-router";

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
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/signin");
    }
  }, [session, isPending]);

  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex w-full h-screen flex-col md:flex-row bg-white overflow-hidden">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <Drawer.Trigger asChild className="md:hidden self-start">
          <Button type="button" variant={"link"} size={"icon"}>
            <MenuIcon />
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
          <div className="flex-1 overflow-y-auto">
            <MenuContent
              sections={menuSections}
              username={session?.user?.name as string}
              onItemClick={() => setOpen(false)}
            />
          </div>
        </Drawer.Content>
      </Drawer>
      <aside
        className={cn(
          "hidden md:block bg-gray-100 transition-all duration-300 ease-in-out overflow-hidden",
          sidebarCollapsed ? "w-10" : "w-64"
        )}
      >
        {sidebarCollapsed ? (
          <div>
            <Button
              variant={"link"}
              size={"icon"}
              onClick={() => setSidebarCollapsed(false)}
            >
              <MenuIcon className="size-6" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex justify-end">
              <Button
                variant={"link"}
                size={"icon"}
                onClick={() => setSidebarCollapsed(true)}
              >
                <XIcon className="size-6" />
              </Button>
            </div>

            <div className="flex-1">
              <MenuContent
                sections={menuSections}
                username={session?.user?.name as string}
                onItemClick={() => setSidebarCollapsed(false)}
              />
            </div>
          </div>
        )}
      </aside>
      <main className="flex w-full mx-auto p-3 overflow-hidden h-full">
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
            <div className="flex items-center gap-2">
              <section.icon className="size-5" />
              <span className="font-head">{section.title}</span>
            </div>
            {section.items.map((item, index) => {
              return (
                <Button
                  asChild
                  key={index}
                  onClick={onItemClick}
                  variant={"link"}
                  className={cn(
                    "w-full justify-start px-8",
                    isActive(currentPath, item.path) && "bg-primary"
                  )}
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
              );
            })}
          </div>
        ))}
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <SettingsIcon className="size-5" />
            <span className="font-head">Settings</span>
          </div>
          <Button
            asChild
            variant={"link"}
            className={cn(
              "w-full justify-start px-8",
              isActive(currentPath, "/admin/user/profile") && "bg-primary"
            )}
          >
            <Link to="/admin/user/profile">My Profile</Link>
          </Button>
          <Button
            asChild
            variant={"link"}
            className={cn(
              "w-full justify-start px-8",
              isActive(currentPath, "/admin/user/change-password") &&
                "bg-primary"
            )}
          >
            <Link to="/admin/user/change-password">Change Password</Link>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full flex justify-center items-center bg-blue-500 text-white">
              <User2Icon fill="white" strokeWidth={0} />
            </div>
            <span>{username}</span>
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
