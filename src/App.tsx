import {
  HashRouter, Route, Routes,
} from "react-router-dom";
import {Menu} from "@/components/menu/Menu.tsx";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {useState} from "react";
import Requests from "@/pages/requests/Requests.tsx";
import {Vendor} from "@/pages/vendor/Vendor.tsx";
import {Waystone} from "@/pages/waystone/Waystone.tsx";
import {Tablet} from "@/pages/tablet/Tablet.tsx";
import {Relic} from "@/pages/relic/Relic.tsx";
import {loadWebSettings, saveWebSettings} from "@/lib/localStorage.ts";


export default function App() {  
  const webSettings = loadWebSettings();
  const [sidebarOpen, setSidebarOpen] = useState(webSettings.sidebarOpen);

  return (
    <HashRouter>
      <SidebarProvider
        style={{
          // @ts-ignore
          "--sidebar-width": "14rem",
          "--sidebar-width-mobile": "14rem",
        }}
        open={sidebarOpen}
        onOpenChange={(open) => {
          setSidebarOpen(open);
          saveWebSettings({
              ...webSettings,
              sidebarOpen: open,
            }
          )
          localStorage.setItem("sidebarOpen", JSON.stringify(open));
          
        }}>
        <Menu/>        
        <SidebarInset>
          <Routes>
            <Route path="/" element={<Requests/>}/>
            <Route path="/vendor" element={<Vendor/>}/>
            <Route path="/waystone" element={<Waystone/>}/>
            <Route path="/tablet" element={<Tablet/>}/>
            <Route path="/relic" element={<Relic/>}/>
          </Routes>
        </SidebarInset>
      </SidebarProvider>
    </HashRouter>
  )
}