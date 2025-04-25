import { useState, useEffect } from 'react';
import { initSearchEngine } from '@/lib/search';
import { GameItem } from '@/types/GameItem';

// 缓存相关常量
const CACHE_KEY = 'gameItemsCache';
const CACHE_TIMESTAMP_KEY = 'gameItemsCacheTimestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

// 创建一个自定义Hook来管理游戏物品数据
export function useGameItems() {
  const [items, setItems] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadGameItems() {
      try {
        setIsLoading(true);
        
        // 尝试从缓存加载数据
        const gameItems = await loadFromCacheOrFetch();
        setItems(gameItems);
        
        // 初始化搜索引擎
        initSearchEngine(gameItems);
      } catch (err) {
        console.error('加载游戏物品失败:', err);
        setError(err instanceof Error ? err : new Error('未知错误'));
      } finally {
        setIsLoading(false);
      }
    }
    
    loadGameItems();
  }, []);
  
  return { items, isLoading, error };
}

// 从缓存或远程获取数据
async function loadFromCacheOrFetch(): Promise<GameItem[]> {
  // 尝试从localStorage获取缓存的数据
  const cachedData = localStorage.getItem(CACHE_KEY);
  const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  
  // 检查缓存是否有效（24小时内）
  const isCacheValid = cachedTimestamp && 
    (Date.now() - parseInt(cachedTimestamp)) < CACHE_DURATION;
  
  // 如果缓存有效，直接返回缓存数据
  if (cachedData && isCacheValid) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      console.warn('缓存数据解析失败，将重新获取数据');
      // 缓存数据解析失败，继续获取新数据
    }
  }
  
  // 如果没有缓存或缓存已过期，则导入数据
  try {
    const gameItems = (await import('@/data/gameItems.json')).default;
    
    // 更新缓存
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(gameItems));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) {
      console.warn('无法更新缓存:', e);
      // 缓存更新失败不影响主要功能
    }
    
    return gameItems;
  } catch (error) {
    console.error('获取游戏物品数据失败:', error);
    // 如果获取失败但有旧缓存，尝试使用旧缓存
    if (cachedData) {
      console.warn('使用过期缓存作为备用');
      return JSON.parse(cachedData);
    }
    throw new Error('无法加载游戏物品数据');
  }
}