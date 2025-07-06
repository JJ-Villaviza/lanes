import { Link } from "@tanstack/react-router";
import {
  ArrowRightLeft,
  Building2,
  ChartArea,
  LayoutDashboard,
  LucideIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

type DataType = {
  title: string;
  items: {
    title: string;
    icon: LucideIcon;
    url: string;
  }[];
}[];

const data: DataType = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
      },
      {
        title: "Branches",
        icon: Building2,
        url: "/branches",
      },
      {
        title: "Transaction",
        icon: ArrowRightLeft,
        url: "/transaction",
      },
      {
        title: "Statistics",
        icon: ChartArea,
        url: "/statistics",
      },
    ],
  },
];

export const SidebarBody = () => {
  return (
    <>
      {data.map((item) => (
        <SidebarGroup key={item.title}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon /> {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};
