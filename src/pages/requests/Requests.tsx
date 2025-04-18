import vendorIcon from "@/img/whetstone_inventory_icon.png";
import waystoneIcon from "@/img/waystone_inventory_icon.png";
import tabletIcon from "@/img/precursortablet_inventory_icon.png";
import relicIcon from "@/img/relic_inventory_icon.png";
import { Link } from "react-router-dom";
import { Header } from "@/components/header/Header.tsx";

const Requests = () => {
  return (
    <div className="min-h-screen font-sans bg-none">
      <Header name="⬅ 打开菜单" />
      <main className="max-w-[540px] mx-auto mt-2 mb-0 bg-[#1e293b] rounded-2xl shadow-lg p-8 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-3 tracking-wide text-white">
          流放之路2正则工具
        </h1>
        {/* 信息提示卡片区域 */}
        <div className="bg-[rgba(30,41,59,0.08)] rounded-xl px-5 py-4 mb-6 text-[#f3f4f6] shadow-md border-l-4 border-blue-500 text-[15px] leading-relaxed font-normal text-left">
        <div className="font-bold text-base mb-1 text-blue-500 tracking-wide">
            当前版本：V1.0.0
          </div>
          <div className="font-bold text-base mb-1 text-blue-500 tracking-wide">
            温馨提示
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              工具根据开源项目veiset/poe2.re做修改，感谢<span className="text-blue-500 font-semibold mx-1">Vegard Veiset</span>
            </li>
            <li>
              请使用<span className="text-blue-500 font-semibold mx-1">QQ频道</span>进行功能反馈
            </li>
            <li>
              感谢：<span className="font-semibold text-white">Poe2DB 编年史</span> 提供数据支持
            </li>
            <li>
              感谢大家<span className="text-blue-500 font-semibold mx-1">打赏</span>支持！工具已开源，欢迎大家Pr
            </li>
          </ul>
        </div>

        <hr className="my-4 border-t border-gray-200" />

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

        <section>
          <h2 className="text-lg font-medium mb-3 border-b border-gray-200 pb-1 text-white">
            近期更新
          </h2>
          <ul className="space-y-3 text-[15px] pl-0 m-0 list-none">
            <li className="flex items-start gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-green-500 text-white text-xs font-bold align-middle select-none">更新</span>
              <div className="flex-1 text-gray-200">
                <span className="font-semibold text-gray-100">V1.0.0</span>
                <span className="ml-2">发布工具版本，增加地图0门六词缀地图筛选</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-blue-500 text-white text-xs font-bold align-middle select-none">修正</span>
              <div className="flex-1 text-gray-200">
                <span className="font-semibold text-gray-100">V0.9.2</span>
                <span className="ml-2">新增碑牌词缀正则</span>
              </div>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

// 现代化功能按钮样式（Tailwind类名）
const featureBtnClass =
  "flex items-center bg-gray-100 rounded-lg px-4 py-2 text-gray-900 font-medium text-base no-underline shadow-sm border border-gray-200 transition hover:bg-gray-200 hover:shadow-md";

export default Requests;