import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <main>
          <SidebarTrigger className="size-8"></SidebarTrigger>
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>Picture Lesson</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Picture Lesson</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/picture-lesson/create">Create</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
