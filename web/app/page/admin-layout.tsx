import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon, User2Icon } from "lucide-react";
import { useEffect } from "react";
import { data, Link, Outlet, useNavigate } from "react-router";

export default function AdminLayout() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/signin");
    }
  }, [session, isPending]);

  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 p-4">
          <SidebarTrigger className="size-8"></SidebarTrigger>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

function AdminSidebar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <Sidebar className="bg-white">
      <SidebarHeader>Picture Lesson</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Picture Lesson</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/picture-lesson/create">Create</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/admin/picture-lesson/list">My Picture Lessons</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin/user/profile">My Profile</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin/user/change-password">Change Password</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full flex justify-center items-center bg-blue-500 text-white">
                <User2Icon fill="white" strokeWidth={0} />
              </div>
              <span>{session?.user?.name}</span>
            </div>
            <SidebarMenuButton
              className="size-6"
              onClick={() => {
                authClient.signOut();
              }}
            >
              <LogOutIcon />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
