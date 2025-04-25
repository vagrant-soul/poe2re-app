import vendorIcon from "@/img/whetstone_inventory_icon.png";
import waystoneIcon from "@/img/waystone_inventory_icon.png";
import tabletIcon from "@/img/precursortablet_inventory_icon.png";
import relicIcon from "@/img/relic_inventory_icon.png";
import homeIcon from "@/img/MarakethSanctumAscendancyAltar.png";
import instructionsIcon from "@/img/book_inventory_icon.png";
import customSearch from "@/img/CrystalGoddess.png"; // 需要添加一个合适的图标

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,  
} from "@/components/ui/sidebar"

import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "首页",
    url: "/",
    icon: homeIcon,
  },
  {
    title: "商店正则",
    url: "/vendor",
    icon: vendorIcon,
  },
  {
    title: "地图正则",
    url: "/waystone",
    icon: waystoneIcon,
  },
  {
    title: "碑牌正则",
    url: "/tablet",
    icon: tabletIcon,
  },
  {
    title: "圣物正则",
    url: "/relic",
    icon: relicIcon,
  },
  // 添加简繁智荐到分类菜单中
  {
    title: "简繁智荐",
    url: "/customsearch",
    icon: customSearch,
    highlight: true, // 添加高亮标记
  },
];
export function Menu() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>分类</SidebarGroupLabel>
          </SidebarMenu>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className={`flex items-center gap-2 ${item.highlight ? 'text-amber-400 font-medium' : ''}`}>
                      <img src={item.icon} alt={item.title} width="32" height="32"/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* 调整"改进"部分与上方的间距 */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>其他</SidebarGroupLabel>
          </SidebarMenu>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/instructions"}>
                  <Link to="/instructions">
                    <img src={instructionsIcon} alt="使用说明" width="32" height="32"/>
                    <span>使用说明</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* 移除了自定义搜索菜单项 */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>             
      </SidebarContent>
    </Sidebar>
  )
}