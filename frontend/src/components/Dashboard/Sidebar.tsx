import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { PasswordModal } from "./Forms/EditPasswordModal";
import { useState } from "react";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Users,
  ChevronsUpDown,
  LogOut,
  RectangleEllipsis,
  UserPen,
  NotebookPen,
  ImagePlus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import useSesionStore from "@/stores/sesionStore";

import logoPng from "@/assets/logo-horizontral-transparent.png";

const menu = [
  {
    title: "",
    items: [
      {
        title: "Usuarios",
        url: "/panel/usuarios",
        icon: Users,
      },
      {
        title: "Publicaciones",
        url: "/panel/publicaciones",
        icon: NotebookPen,
      },
      {
        title: "Portadas",
        url: "/panel/portadas",
        icon: ImagePlus,
      },
    ],
  },
];

export function SidebarContainer() {
  const redirect = useNavigate();
  const auth = useAuth();
  const sesion = useSesionStore();
  const { isMobile } = useSidebar();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  function handleLogout() {
    auth.logout();
    redirect("/");
  }

  return (
    <Sidebar className="dark">
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <SidebarHeader className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <img
            className="w-[100%]"
            src={logoPng}
            alt="Logo"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menu?.map((menu, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg text-primary-foreground bg-primary">
                      {sesion.data?.name
                        ? sesion.data.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "CN"}
                    </AvatarFallback>{" "}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {sesion.data?.name || "User"}
                    </span>
                    <span className="truncate text-xs">
                      {sesion.data?.email || "user@gmail.com"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="dark w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg text-primary-foreground bg-primary">
                        {sesion.data?.name
                          ? sesion.data.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "CN"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {sesion.data?.name || "User"}
                      </span>
                      <span className="truncate text-xs">
                        {sesion.data?.email || "user@gmail.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                  // onSelect={() => setIsProfileModalOpen(true)}
                  >
                    <UserPen />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setIsPasswordModalOpen(true)}
                  >
                    <RectangleEllipsis />
                    Cambiar contraseña
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link to="/">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Cerrar sesión
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
