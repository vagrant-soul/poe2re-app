import {Header} from "@/components/header/Header.tsx";
import {Result} from "@/components/result/Result.tsx";
import {defaultSettings, Settings} from "@/app/settings.ts";
import {useEffect, useState, useCallback, useRef} from "react";
import {loadSettings, saveSettings, selectedProfile} from "@/lib/localStorage.ts";
import {generateCustomSearchRegex} from "@/pages/customsearch/CustomSearchResult";
import {Input} from "@/components/ui/input.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
// 引入 opencc-js 库
import { Converter } from 'opencc-js';
// 导入游戏物品数据
import gameItems from "@/data/gameItems.json";
// 导入统一的 GameItem 接口
import { GameItem } from '@/types/GameItem';

// 引入虚拟滚动组件
import { useVirtualizer } from '@tanstack/react-virtual';

// 防抖函数
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function CustomSearch() {
  const globalSettings = loadSettings(selectedProfile())
  const [settings, setSettings] = useState<Settings["customsearch"]>(globalSettings.customsearch);
  const [result, setResult] = useState("");
  const [customInput, setCustomInput] = useState(settings.resultSettings.customText || "");
  // 使用防抖处理输入
  const debouncedInput = useDebounce(customInput, 300);
  // 添加繁体转换结果状态
  const [traditionalText, setTraditionalText] = useState("");
  // 添加搜索建议状态
  const [suggestions, setSuggestions] = useState<GameItem[]>([]);
  // 添加是否使用英文的状态
  const [useEnglish, setUseEnglish] = useState(false);
  // 添加加载状态
  const [isSearching, setIsSearching] = useState(false);

  // 创建简繁转换器
  const converter = Converter({ from: 'cn', to: 'twp' });

  // 添加更多状态管理
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [expandedSuggestions, setExpandedSuggestions] = useState<GameItem[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  
  // 缓存搜索结果
  const searchCache = useRef<Map<string, GameItem[]>>(new Map());
  
  // 优化的搜索函数
  const performSearch = useCallback((searchTerm: string, englishTerm: string) => {
    // 检查缓存
    const cacheKey = searchTerm + '|' + englishTerm;
    if (searchCache.current.has(cacheKey)) {
      return searchCache.current.get(cacheKey) || [];
    }
    
    // 使用更高效的搜索算法
    const searchTermLower = searchTerm.toLowerCase();
    const englishTermLower = englishTerm.toLowerCase();
    
    const matchedItems = gameItems.filter((item: GameItem) => {
      // 先检查最常见的匹配条件
      if (item.name.toLowerCase().includes(searchTermLower)) return true;
      if (item.nameen.toLowerCase().includes(englishTermLower)) return true;
      
      // 检查标签 - 兼容 tag 为 string 或 string[] 的情况
      if (typeof item.tag === 'string') {
        return item.tag.toLowerCase().includes(searchTermLower);
      } else if (Array.isArray(item.tag)) {
        return item.tag.some(tag => tag.toLowerCase().includes(searchTermLower));
      }
      
      return false;
    });
    
    // 缓存结果
    searchCache.current.set(cacheKey, matchedItems);
    return matchedItems;
  }, []);

  // 更新设置
  useEffect(() => {
    const settingsResult = {...globalSettings, customsearch: {...settings}};
    saveSettings(settingsResult);
    setResult(generateCustomSearchRegex(settingsResult));
  }, [settings]);

  // 当自定义输入变化时更新设置
  useEffect(() => {
    setSettings({
      ...settings, 
      resultSettings: {...settings.resultSettings, customText: customInput}
    });
  }, [customInput]);
  
  // 使用防抖后的输入进行搜索
  useEffect(() => {
    if (!debouncedInput) {
      setTraditionalText("");
      setSuggestions([]);
      setExpandedSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    
    // 使用 requestAnimationFrame 避免阻塞UI
    const searchId = requestAnimationFrame(() => {
      const traditional = converter(debouncedInput);
      setTraditionalText(traditional);
      
      if (traditional.length > 0) {
        const matchedItems = performSearch(traditional, debouncedInput);
        
        // 只显示前5个作为快速建议
        setSuggestions(matchedItems.slice(0, 5));
        // 保存完整匹配结果用于展开显示
        setExpandedSuggestions(matchedItems.slice(0, 100)); // 限制最多100条以保证性能
      } else {
        setSuggestions([]);
        setExpandedSuggestions([]);
      }
      
      setIsSearching(false);
    });
    
    return () => cancelAnimationFrame(searchId);
  }, [debouncedInput, performSearch]);
  
  // 虚拟滚动器配置
  const rowVirtualizer = useVirtualizer({
    count: expandedSuggestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70, // 每行的估计高度
    overscan: 5,
  });

  // 处理建议点击
  const handleSuggestionClick = useCallback((item: GameItem, isEnglish: boolean = false) => {
    if (isEnglish) {
      setCustomInput(item.nameen);
      setUseEnglish(true);
    } else {
      setCustomInput(item.name);
      setUseEnglish(false);
    }
    // 关闭展开视图
    setShowAllSuggestions(false);
  }, []);

  return (
    <>
      <Header name="⬅ 简繁智荐"></Header>
      <div className="flex bg-muted grow-0 flex-1 flex-col gap-2">
        <Result
          result={result}
          reset={() => {
            setSettings(defaultSettings.customsearch);
            setCustomInput("");
            setTraditionalText("");
            setSuggestions([]);
            setUseEnglish(false);
          }}
          customText={settings.resultSettings.customText}
          autoCopy={settings.resultSettings.autoCopy}
          setCustomText={(text) => {
            setCustomInput(text);
          }}
          // 保留 setAutoCopy 属性，但不在界面上显示相关控件
          setAutoCopy={(enable) => {
            setSettings({
              ...settings, resultSettings: {...settings.resultSettings, autoCopy: enable}
            })
          }}
        />
      </div>
      <div className="flex grow bg-muted/30 flex-1 flex-col gap-4 p-6">
        <Card className="shadow-md border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-400">简繁智荐</CardTitle>
            <CardDescription>自动简体转繁体，结果将实时显示在上方。支持使用正则表达式语法进行高级搜索<br />例如：射击 → 射擊，伤害 → 傷害，暴击 → 暴擊</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>                
                <div className="flex w-full items-center space-x-2">
                  <Input 
                    type="text"
                    placeholder="输入自定义文本，自动转繁体"
                    className="font-mono"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                  />
                </div>
                
                {/* 简繁转换结果 */}
                {traditionalText && !useEnglish && (
                  <div className="mt-2 p-2 bg-slate-700/50 rounded text-sm">
                    <p className="text-xs text-amber-400 mb-1">简繁转换结果：</p>
                    <p className="font-mono text-white">{traditionalText}</p>
                  </div>
                )}
                
                {/* 搜索建议 */}
                <div className="mt-2 p-2 bg-slate-700/50 rounded text-sm min-h-[60px]">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-amber-400 mb-1">猜你想搜：</p>
                    {suggestions.length > 5 && (
                      <button 
                        onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {showAllSuggestions ? '收起' : '查看更多'}
                      </button>
                    )}
                  </div>
                  
                  {/* 加载状态 */}
                  {isSearching ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-green-400 rounded-full" style={{animationDelay: '0.2s'}}></div>
                        <div className="h-2 w-2 bg-green-400 rounded-full" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {/* 快速建议（默认显示） */}
                      {!showAllSuggestions && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {suggestions.map((item, index) => (
                            <SuggestionItem 
                              key={item.id}
                              item={item}
                              onClick={() => handleSuggestionClick(item)}
                              onEnglishClick={() => handleSuggestionClick(item, true)}
                              isAnimated={true}
                              animationDelay={index * 50}
                            />
                          ))}
                        </div>
                      )}
                      
                      {/* 展开的建议（虚拟滚动） */}
                      {showAllSuggestions && expandedSuggestions.length > 0 && (
                        <div 
                          ref={parentRef}
                          className="h-[300px] overflow-auto mt-2 border border-slate-600/30 rounded"
                        >
                          <div
                            style={{
                              height: `${rowVirtualizer.getTotalSize()}px`,
                              width: '100%',
                              position: 'relative',
                            }}
                          >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                              const item = expandedSuggestions[virtualRow.index];
                              
                              // 根据item.colors确定整体背景色
                              let bgClass = "bg-green-800/30";
                              let hoverBgClass = "hover:bg-green-800/40";
                              let headerBgClass = "bg-green-800/50";
                              let headerHoverBgClass = "hover:bg-green-700/70";
                              
                              // 为不同类型的物品设置不同的背景色
                              switch (item.colors) {
                                case "uniques":
                                  bgClass = "bg-amber-900/30";
                                  hoverBgClass = "hover:bg-amber-900/40";
                                  headerBgClass = "bg-amber-800/50";
                                  headerHoverBgClass = "hover:bg-amber-700/70";
                                  break;
                                case "r":
                                  bgClass = "bg-red-900/30";
                                  hoverBgClass = "hover:bg-red-900/40";
                                  headerBgClass = "bg-red-800/50";
                                  headerHoverBgClass = "hover:bg-red-700/70";
                                  break;
                                case "g":
                                  bgClass = "bg-green-900/30";
                                  hoverBgClass = "hover:bg-green-900/40";
                                  headerBgClass = "bg-green-800/50";
                                  headerHoverBgClass = "hover:bg-green-700/70";
                                  break;
                                case "b":
                                  bgClass = "bg-blue-900/30";
                                  hoverBgClass = "hover:bg-blue-900/40";
                                  headerBgClass = "bg-blue-800/50";
                                  headerHoverBgClass = "hover:bg-blue-700/70";
                                  break;
                                default:
                                  // 默认颜色保持不变
                                  break;
                              }
                              
                              return (
                                <div
                                  key={virtualRow.index}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                  }}
                                  className="p-1"
                                >
                                  <div 
                                    className={`${bgClass} rounded overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md ${hoverBgClass}`}
                                  >
                                    {/* 中文部分 */}
                                    <div 
                                      onClick={() => handleSuggestionClick(item)}
                                      className={`px-3 py-1.5 ${headerBgClass} ${headerHoverBgClass} cursor-pointer flex items-center flex-1`}
                                    >
                                      <span className="font-mono text-white">{item.name}</span>
                                      <div className="flex gap-1 ml-2 flex-wrap">
                                        <TagComponent tag={item.tag} color={item.colors} />
                                      </div>
                                    </div>
                                    
                                    {/* 英文部分 - 独立区域 */}
                                    <div 
                                      onClick={() => handleSuggestionClick(item, true)}
                                      className="px-3 py-1 bg-slate-800/70 hover:bg-slate-700/80 border-t border-slate-600/30 cursor-pointer text-center"
                                    >
                                      <span className="text-xs text-amber-300/80 hover:text-amber-300 font-medium">
                                        {item.nameen}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  ) : customInput ? (
                    <p className="text-xs text-gray-400 py-2 text-center">没有找到匹配的结果</p>
                  ) : (
                    <p className="text-xs text-gray-400 py-2 text-center">请输入搜索内容</p>
                  )}
                </div>                              
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-green-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-400">使用提示</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>直接输入文本进行精确匹配</li>
              <li>使用 | 符号可以进行"或"匹配，例如：<span className="font-mono">火焰|冰冷</span></li>
              <li>使用括号可以分组，例如：<span className="font-mono">(火焰|冰冷)抗性</span></li>
              <li>使用 \d 匹配任意数字，例如：<span className="font-mono">\d+% 移動速度</span></li>
              <li>简体中文会自动转换为繁体中文，例如：<span className="font-mono">伤害 → 傷害</span></li>
              <li>点击"猜你想搜"中的中文名称可以快速填充搜索框</li>
              <li>点击英文名称可以使用英文进行搜索</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  )
}


// 添加动画效果的建议项组件
interface SuggestionItemProps {
  item: GameItem;
  onClick: () => void;
  onEnglishClick: () => void;
  isAnimated?: boolean;
  animationDelay?: number;
}

const SuggestionItem = ({ item, onClick, onEnglishClick, isAnimated = false, animationDelay = 0 }: SuggestionItemProps) => {
  // 根据item.colors确定整体背景色
  let bgClass = "bg-green-800/30";
  let hoverBgClass = "hover:bg-green-800/40";
  let headerBgClass = "bg-green-800/50";
  let headerHoverBgClass = "hover:bg-green-700/70";
  
  // 为不同类型的物品设置不同的背景色
  switch (item.colors) {
    case "uniques":
      bgClass = "bg-amber-900/30";
      hoverBgClass = "hover:bg-amber-900/40";
      headerBgClass = "bg-amber-800/50";
      headerHoverBgClass = "hover:bg-amber-700/70";
      break;
    case "r":
      bgClass = "bg-red-900/30";
      hoverBgClass = "hover:bg-red-900/40";
      headerBgClass = "bg-red-800/50";
      headerHoverBgClass = "hover:bg-red-700/70";
      break;
    case "g":
      bgClass = "bg-green-900/30";
      hoverBgClass = "hover:bg-green-900/40";
      headerBgClass = "bg-green-800/50";
      headerHoverBgClass = "hover:bg-green-700/70";
      break;
    case "b":
      bgClass = "bg-blue-900/30";
      hoverBgClass = "hover:bg-blue-900/40";
      headerBgClass = "bg-blue-800/50";
      headerHoverBgClass = "hover:bg-blue-700/70";
      break;
    default:
      // 默认颜色保持不变
      break;
  }
  
  return (
    <div 
      className={`${bgClass} rounded overflow-hidden flex flex-col 
                 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${hoverBgClass}
                 ${isAnimated ? 'animate-fadeIn' : ''}`}
      style={isAnimated ? { animationDelay: `${animationDelay}ms` } : {}}
    >
      {/* 中文部分 */}
      <div 
        onClick={onClick}
        className={`px-3 py-1.5 ${headerBgClass} ${headerHoverBgClass} cursor-pointer flex items-center`}
      >
        <span className="font-mono text-white">{item.name}</span>
        <div className="flex gap-1 ml-2">
          <TagComponent tag={item.tag} color={item.colors} />
        </div>
      </div>
      
      {/* 英文部分 - 独立区域 */}
      <div 
        onClick={onEnglishClick}
        className="px-3 py-1 bg-slate-800/70 hover:bg-slate-700/80 border-t border-slate-600/30 cursor-pointer text-center"
      >
        <span className="text-xs text-amber-300/80 hover:text-amber-300 font-medium">
          {item.nameen}
        </span>
      </div>
    </div>
  );
};

// 添加标签组件
interface TagProps {
  tag: string | string[];
  color: string;
}

const TagComponent = ({ tag, color }: TagProps) => {
  // 统一的背景颜色，深色但不太暗，适合各种文字颜色
  let bgColorClass = "bg-slate-800/90";
  let borderClass = "border border-slate-600/50";
  let textColorClass = "text-gray-300";
  
  switch (color) {
    case "uniques":
      textColorClass = "text-[#ef6916]";
      borderClass = "border border-[#ef6916]/30";
      break;
    case "r":
      textColorClass = "text-red-500";
      borderClass = "border border-red-500/30";
      break;
    case "g":
      textColorClass = "text-green-500";
      borderClass = "border border-green-500/30";
      break;
    case "b":
      textColorClass = "text-blue-500";
      borderClass = "border border-blue-500/30";
      break;    
    default:
      // 默认颜色保持不变
      break;
  }
  
  // 处理 tag 可能是字符串或字符串数组的情况
  const tagText = Array.isArray(tag) ? tag.join(', ') : tag;
  
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${bgColorClass} ${borderClass} ${textColorClass}`}>
      {tagText}
    </span>
  );
};