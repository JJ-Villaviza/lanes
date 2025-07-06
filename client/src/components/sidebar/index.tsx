import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "../ui/sidebar";
import { SidebarBody } from "./sidebar-body";
import { SidebarFoot } from "./sidebar-foot";
import { SidebarHead } from "./sidebar-head";

export const SidebarIndex = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarHead />
        </SidebarHeader>
        <SidebarContent>
          <SidebarBody />
        </SidebarContent>
        <SidebarFooter>
          <SidebarFoot />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};
