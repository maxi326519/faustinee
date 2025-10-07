import { SidebarContainer } from "./Sidebar";
import { SidebarProvider } from "../ui/sidebar";
import ProtectedRoute from "../ProtectedRoute";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex w-screen h-screen">
          <SidebarContainer />
          <div className="w-full p-4">{children}</div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
