import vendorIcon from "@/img/whetstone_inventory_icon.png";
import waystoneIcon from "@/img/waystone_inventory_icon.png";
import tabletIcon from "@/img/precursortablet_inventory_icon.png";
import relicIcon from "@/img/relic_inventory_icon.png";
import bookIcon from "@/img/book_inventory_icon.png";
import { Link } from "react-router-dom";
import { Header } from "@/components/header/Header.tsx";

const Requests = () => {
  return (
    <div className="min-h-screen font-sans bg-none">
      <Header name="⬅ 打开菜单" />
      <main className="max-w-[540px] mx-auto mt-2 mb-0 bg-[#1e293b] rounded-2xl shadow-lg p-8 sm:p-6">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6d] rounded-lg p-4 mb-2 text-white shadow-md">
          
          <p className="text-center text-sm mt-1 text-gray-300">当前版本还在测试中，欢迎反馈Bug</p>
        </div>
        
        {/* 新的文档区域 - 类似截图中的设计 */}
        <div className="bg-[#1e293b] rounded-xl p-6 mb-6 text-white shadow-md flex items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">POE2词缀助手</h1>
            <p className="text-gray-300 mb-4">专为流放之路2玩家打造的物品筛选工具，直接生成对应的可精准定位的搜索字符串</p>
            <Link 
              to="/instructions" 
              className="inline-block bg-[#2a3a4f] hover:bg-[#354a64] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 border border-[#3a4a5f]"
            >
              使用说明 →
            </Link>
          </div>
          <div className="ml-4">
            <img 
              src={bookIcon} 
              alt="使用说明" 
              className="w-48 h-48 object-contain" 
            />
          </div>
        </div>

        <hr className="my-2 border-t border-gray-200" />

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-white">
            当前功能
          </h2>
          {/* 使用 grid 实现2列布局，并添加现代化特效 */}
          <div className="grid grid-cols-2 gap-4 justify-center mb-6">
            <Link
              to="/vendor"
              className={featureBtnClass + " group justify-center"}
            >
              <img src={vendorIcon} alt="vendor regex" width="32" height="32"
                className="transition-transform duration-200 group-hover:scale-110" />
              <span className="ml-2">商店正则</span>
            </Link>
            <Link
              to="/waystone"
              className={featureBtnClass + " group justify-center"}
            >
              <img src={waystoneIcon} alt="waystone regex" width="32" height="32"
                className="transition-transform duration-200 group-hover:scale-110" />
              <span className="ml-2">地图正则</span>
            </Link>
            <Link
              to="/tablet"
              className={featureBtnClass + " group justify-center"}
            >
              <img src={tabletIcon} alt="tablet regex" width="32" height="32"
                className="transition-transform duration-200 group-hover:scale-110" />
              <span className="ml-2">碑牌正则</span>
            </Link>
            <Link
              to="/relic"
              className={featureBtnClass + " group justify-center"}
            >
              <img src={relicIcon} alt="relic regex" width="32" height="32"
                className="transition-transform duration-200 group-hover:scale-110" />
              <span className="ml-2">圣物正则</span>
            </Link>
          </div>
        </section>

        
      </main>
    </div>
  );
};

// 现代化功能按钮样式（Tailwind类名）
const featureBtnClass =
  "flex items-center bg-[#2a3a4f] rounded-lg px-4 py-2 text-gray-100 font-medium text-base no-underline shadow-sm border border-[#3a4a5f] transition hover:bg-[#354a64] hover:shadow-md";

export default Requests;