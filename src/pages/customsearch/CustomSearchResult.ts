import {Settings} from "@/app/settings.ts";
import { Converter } from 'opencc-js';

export function generateCustomSearchRegex(settings: Settings): string {
  // 如果自定义文本为空，则返回空字符串
  if (!settings.customsearch.resultSettings.customText) {
    return "";
  }
  
  // 创建简繁转换器
  const converter = Converter({ from: 'cn', to: 'twp' });
  
  // 将简体转换为繁体
  const traditionalText = converter(settings.customsearch.resultSettings.customText);
  
  // 返回繁体文本作为搜索结果
  return traditionalText;
}