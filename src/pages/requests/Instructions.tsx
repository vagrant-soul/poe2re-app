import { Header } from "@/components/header/Header.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import dashangImg from "@/img/dashang.png";
import { useState } from "react";

// 定义当前版本号常量
const CURRENT_VERSION = 'V1.2.0';

// 使用类型断言简化代码
const Instructions = () => {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [isBrowserEnv, setIsBrowserEnv] = useState(false);
  
  const checkForUpdates = async () => {
    setIsChecking(true);
    setCheckError(null);
    setIsBrowserEnv(false);
    
    try {
      // 检查 window.electron 是否存在
      if (typeof window !== 'undefined' && (window as any).electron) {
        try {
          // 如果在 Electron 环境中
          const version = await (window as any).electron.ipcRenderer.invoke('check-for-updates');
          setLatestVersion(version);
        } catch (error) {
          console.error('检查更新失败:', error);
          setCheckError(error instanceof Error ? error.message : '检查更新失败');
        }
      } else {
        // 如果在浏览器环境中，标记为浏览器环境
        setIsBrowserEnv(true);
        console.log('浏览器环境检测到，无法检查更新');
      }
    } catch (error) {
      console.error('检查环境失败:', error);
      setCheckError(error instanceof Error ? error.message : '检查更新失败');
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <div className="min-h-screen font-sans bg-none">
      <Header name="⬅ 打开菜单" />
      <main className="max-w-[800px] mx-auto mt-2 mb-0 bg-[#1e293b] rounded-2xl shadow-lg p-8 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-wide text-white">
          使用说明
        </h1>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="bg-[rgba(30,41,59,0.08)] rounded-xl px-5 py-4 text-[#f3f4f6] shadow-md border-l-4 border-blue-500 text-[15px] leading-relaxed font-normal text-left flex-1">
            <div className="font-bold text-base mb-1 text-blue-500 tracking-wide flex items-center justify-between">
              <div>
                当前版本：
                <span className="inline-block px-2 py-0.5 rounded bg-green-500 text-white text-xs font-bold align-middle select-none">{CURRENT_VERSION}</span>
              </div>
              <button 
                onClick={checkForUpdates}
                disabled={isChecking}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200 flex items-center"
              >
                {isChecking ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    检查中...
                  </span>
                ) : "检查更新"}
              </button>
            </div>
            {isBrowserEnv && (
              <div className="text-sm mt-1 mb-2 text-amber-400">
                ⚠️ 浏览器环境无法检查更新，请在应用中使用此功能
              </div>
            )}
            {latestVersion && !isBrowserEnv && (
              <div className={`text-sm mt-1 mb-2 ${latestVersion === CURRENT_VERSION ? 'text-green-400' : 'text-yellow-400'}`}>
                {latestVersion === CURRENT_VERSION ? '✓ 已是最新版本' : `✦ 发现新版本: ${latestVersion}`}
              </div>
            )}
            {checkError && (
              <div className="text-sm mt-1 mb-2 text-red-400">
                ✗ {checkError}
              </div>
            )}
            <div className="font-bold text-base mb-1 text-blue-500 tracking-wide">
              温馨提示
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                工具根据开源项目veiset/poe2.re做修改，感谢<span className="text-blue-500 font-semibold mx-1">Vegard Veiset</span>
              </li>
              
              <li>
                感谢：<span className="font-semibold text-white">Poe2DB 编年史</span> 提供数据支持
              </li>
              <li>
                感谢大家<span className="text-blue-500 font-semibold mx-1">打赏</span>支持！工具已开源，欢迎大家Pr
              </li>
              <li>
                请使用<span className="text-blue-500 font-semibold mx-1">QQ频道</span>进行功能反馈
                <ul className="list-disc pl-5 mt-1">
                  <li>QQ频道：流放之路研习所</li>
                  <li>频道号：pathofexile</li>
                  <li>微信小程序搜索：qq频道 打开小程序后同上搜索</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-[rgba(30,41,59,0.08)] rounded-xl px-5 py-4 shadow-md border-r-4 border-blue-500 md:max-w-[200px]">
            <p className="text-blue-500 font-bold text-center mb-2">打赏赞助</p>
            <img 
              src={dashangImg} 
              alt="赞赏码" 
              className="w-auto h-auto max-w-[160px] rounded-md shadow-sm" 
            />
            <p className="text-gray-300 text-sm text-center mt-2">打赏2块钱，开心一整天</p>
          </div>
        </div>
        {/* 近期更新部分 */}
        <section>
          <h2 className="text-lg font-medium mb-3 border-b border-gray-200 pb-1 text-white">
            近期更新
          </h2>
          <ul className="space-y-3 text-[15px] pl-0 m-0 list-none">
          <li className="flex items-start gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-[#ef6916] text-white text-xs font-bold align-middle select-none">新增</span>
              <div className="flex-1 text-gray-200">
                <span className="font-semibold text-gray-100">V1.2.0</span>
                <span className="ml-2"></span>
                <ul className="list-disc pl-5 mt-1">
                  <li>新增简繁智荐页面(Beta)</li>
                  <li>修复个别错误</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-green-500 text-white text-xs font-bold align-middle select-none">更新</span>
              <div className="flex-1 text-gray-200">
                <span className="font-semibold text-gray-100">V1.1.0</span>
                <span className="ml-2">命名为：POE2词缀助手</span>
                <ul className="list-disc pl-5 mt-1">
                  <li>新增使用说明页面</li>
                  <li>优化程序，加入托盘图标</li>
                  <li>支持更新检查，没有服务器，暂不提供在线更新</li>
                  <li>修复自定义输入部分个别页面无效的问题</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-green-500 text-white text-xs font-bold align-middle select-none">更新</span>
              <div className="flex-1 text-gray-200">
                <span className="font-semibold text-gray-100">V1.0.0</span>
                <span className="ml-2">发布工具版本，增加地图0门六词缀地图筛选</span>
              </div>
            </li>
            
          </ul>
        </section>
        <hr className="my-2 border-t border-gray-200" />
        <Accordion type="single" collapsible className="w-full mb-6">
          <AccordionItem value="vendor">
            <AccordionTrigger className="text-white text-lg font-medium">商店正则使用说明</AccordionTrigger>
            <AccordionContent className="text-gray-200">
              <p className="mb-2">商店正则功能用于筛选NPC商店中的物品，可按以下步骤使用：</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>选择匹配模式（任意匹配或同时匹配）</li>
                <li>勾选需要的物品属性（品质、插槽等）</li>
                <li>设置移动速度筛选条件</li>
                <li>选择物品词缀和抗性需求</li>
                <li>设置物品等级和需求等级范围</li>
                <li>选择物品稀有度和物品类型</li>
                <li>复制生成的正则表达式到游戏中使用</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="waystone">
            <AccordionTrigger className="text-white text-lg font-medium">地图正则使用说明</AccordionTrigger>
            <AccordionContent className="text-gray-200">
              <p className="mb-2">地图正则功能用于筛选换界石（地图），可按以下步骤使用：</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>设置全局选项（四舍五入、匹配超过100%数字等）</li>
                <li>设置地图阶级范围</li>
                <li>选择地图稀有度（腐化、非腐化等）</li>
                <li>选择前缀匹配模式（任何/所有）</li>
                <li>勾选需要的特殊词缀（掉落机率、瘋癲等）</li>
                <li>从列表中选择需要的前缀和后缀</li>
                <li>复制生成的正则表达式到游戏中使用</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tablet">
            <AccordionTrigger className="text-white text-lg font-medium">碑牌正则使用说明</AccordionTrigger>
            <AccordionContent className="text-gray-200">
              <p className="mb-2">碑牌正则功能用于筛选先祖碑牌，可按以下步骤使用：</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>选择匹配模式（匹配任何前缀或后缀/全需匹配）</li>
                <li>从列表中选择需要的前缀</li>
                <li>从列表中选择需要的后缀</li>
                <li>复制生成的正则表达式到游戏中使用</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="relic">
            <AccordionTrigger className="text-white text-lg font-medium">圣物正则使用说明</AccordionTrigger>
            <AccordionContent className="text-gray-200">
              <p className="mb-2">圣物正则功能用于筛选游戏中的圣物物品，可按以下步骤使用：</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>选择匹配模式</li>
                <li>从列表中选择需要的前缀</li>
                <li>从列表中选择需要的后缀</li>
                <li>复制生成的正则表达式到游戏中使用</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="bg-[rgba(30,41,59,0.08)] rounded-xl px-5 py-4 mb-6 text-[#f3f4f6] shadow-md border-l-4 border-yellow-500 text-[15px] leading-relaxed font-normal text-left">
          <div className="font-bold text-base mb-1 text-yellow-500 tracking-wide">
            常见问题
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-semibold">问：正则表达式长度超过限制怎么办？</p>
              <p>答：游戏中正则表达式长度限制为50个字符，当超过限制时，请减少筛选条件。</p>
            </div>
            <div>
              <p className="font-semibold">问：如何在游戏中使用生成的正则表达式？</p>
              <p>答：在游戏物品栏中按下Ctrl+F打开搜索框，粘贴正则表达式即可。</p>
            </div>
            <div>
              <p className="font-semibold">问：为什么我的筛选没有效果？</p>
              <p>答：请检查是否启用了正则表达式模式（搜索框中的".*"图标），并确保正则表达式格式正确。</p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          <p>如有更多问题，请加入QQ频道：流放之路研习所（频道号：pathofexile）进行反馈</p>
        </div>
      </main>
    </div>
  );
};

export default Instructions;