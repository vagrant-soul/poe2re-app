import { GameItem } from '@/types/GameItem';
import Fuse from 'fuse.js';

// 创建模糊搜索实例
let fuseInstance: Fuse<GameItem> | null = null;

// 初始化搜索引擎
export function initSearchEngine(items: GameItem[]) {
  const options = {
    keys: ['name', 'nameen', 'tag'],
    threshold: 0.3, // 匹配阈值，越低越精确
    includeScore: true,
    useExtendedSearch: true,
  };
  
  fuseInstance = new Fuse(items, options);
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// 搜索函数
export function searchItems(query: string, limit: number = 100): GameItem[] {
  if (!fuseInstance || !query) return [];
  
  const results = fuseInstance.search(query);
  return results.slice(0, limit).map(result => result.item);
}

// 直接过滤函数 - 用于简单精确匹配
export function filterItems(items: GameItem[], query: string, limit: number = 100): GameItem[] {
  if (!query) return [];
  
  return items
    .filter(item => {
      // 检查名称匹配
      if (item.name.includes(query)) return true;
      if (item.nameen.toLowerCase().includes(query.toLowerCase())) return true;
      
      // 检查标签匹配 - 兼容 tag 为 string 或 string[] 的情况
      if (typeof item.tag === 'string') {
        return item.tag.includes(query);
      } else if (Array.isArray(item.tag)) {
        return item.tag.some(tag => tag.includes(query));
      }
      
      return false;
    })
    .slice(0, limit);
}