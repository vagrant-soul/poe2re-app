import vendorIcon from "@/img/whetstone_inventory_icon.png";
import waystoneIcon from "@/img/waystone_inventory_icon.png";
import tabletIcon from "@/img/precursortablet_inventory_icon.png";
import relicIcon from "@/img/relic_inventory_icon.png";
import homeIcon from "@/img/MarakethSanctumAscendancyAltar.png";
import bannerImg from "@/img/dashang.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarImage,
} from "@/components/ui/sidebar"

import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "首页",
    url: "/",
    icon: homeIcon,
  },
  {
    title: "商店",
    url: "/vendor",
    icon: vendorIcon,
  },
  {
    title: "地图",
    url: "/waystone",
    icon: waystoneIcon,
  },
  {
    title: "碑牌",
    url: "/tablet",
    icon: tabletIcon,
  },
  {
    title: "圣物",
    url: "/relic",
    icon: relicIcon,
  },
];
export function Menu() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>类别</SidebarGroupLabel>
          </SidebarMenu>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <img src={item.icon} alt={item.title} width="32" height="32"/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* 调整“改进”部分与上方的间距 */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarGroupLabel>加入QQ频道</SidebarGroupLabel>
          </SidebarMenu>
          {/* 告示板样式内容区域 */}
          <div
            style={{
              background: "#e5e7eb", // 更柔和的灰色，适合大多数浅色主题
              borderRadius: "8px",
              padding: "12px",
              margin: "12px 8px 0 8px",
              color: "#222",
              fontSize: "13px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              lineHeight: 1.8,
              textAlign: "left"
            }}
          >            
            QQ频道：流放之路研习所<br />频道号：pathofexile<br />微信小程序→搜索 qq频道
          </div>
          
        </SidebarGroup>
        {/* 图片放在底部，宽度自适应，居中且圆角，避免撑出滚动条 */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 8 }}>
          <SidebarImage
            src={bannerImg}
            alt="Banner"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "140px",
              maxHeight: "140px",
              borderRadius: "8px",
              objectFit: "contain",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}