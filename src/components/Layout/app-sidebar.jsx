
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent >
        <NavMain  />
     
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
