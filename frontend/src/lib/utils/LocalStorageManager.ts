/**
 * 本地存储管理工具类 - 提供安全、便捷的localStorage操作
 */
export class LocalStorageManager {
  // 存储键的前缀，用于避免键名冲突
  private static readonly PREFIX = 'pet_foster_hub_';

  /**
   * 检查浏览器是否支持localStorage
   * @returns 是否支持localStorage
   */
  private static isSupported(): boolean {
    try {
      const testKey = `${this.PREFIX}test`;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('浏览器不支持localStorage或存储已被禁用');
      return false;
    }
  }

  /**
   * 生成带前缀的存储键
   * @param key 原始键名
   * @returns 带前缀的键名
   */
  private static getPrefixedKey(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  /**
   * 设置本地存储项
   * @param key 存储键
   * @param value 存储值，可以是任何可序列化的类型
   * @param expiryDays 过期天数（可选）
   * @returns 是否设置成功
   */
  static setItem<T>(key: string, value: T, expiryDays?: number): boolean {
    if (!this.isSupported()) return false;

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const item = {
        value,
        expiry: expiryDays ? Date.now() + expiryDays * 24 * 60 * 60 * 1000 : null
      };
      localStorage.setItem(prefixedKey, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error(`设置本地存储项失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 获取本地存储项
   * @param key 存储键
   * @param defaultValue 默认值（可选）
   * @returns 存储的值，如果不存在则返回默认值
   */
  static getItem<T>(key: string, defaultValue?: T): T | undefined {
    if (!this.isSupported()) return defaultValue;

    try {
      // 先尝试查找带前缀的键
      const prefixedKey = this.getPrefixedKey(key);
      let itemStr = localStorage.getItem(prefixedKey);
      
      // 如果带前缀的键不存在，尝试查找不带前缀的键（向后兼容）
      if (!itemStr) {
        itemStr = localStorage.getItem(key);
        
        if (!itemStr) return defaultValue;
        
        // 直接返回原始值，不进行过期检查
        return JSON.parse(itemStr) as T;
      }

      const item = JSON.parse(itemStr);
      
      // 检查是否过期
      if (item.expiry && Date.now() > item.expiry) {
        this.removeItem(key);
        return defaultValue;
      }

      return item.value as T;
    } catch (error) {
      console.error(`获取本地存储项失败 [${key}]:`, error);
      return defaultValue;
    }
  }

  /**
   * 删除本地存储项
   * @param key 存储键
   * @returns 是否删除成功
   */
  static removeItem(key: string): boolean {
    if (!this.isSupported()) return false;

    try {
      const prefixedKey = this.getPrefixedKey(key);
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(`删除本地存储项失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 清空所有与本应用相关的本地存储项
   * @returns 是否清空成功
   */
  static clear(): boolean {
    if (!this.isSupported()) return false;

    try {
      const keysToRemove = Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX));
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('清空本地存储失败:', error);
      return false;
    }
  }

  /**
   * 检查本地存储项是否存在
   * @param key 存储键
   * @returns 是否存在
   */
  static hasItem(key: string): boolean {
    if (!this.isSupported()) return false;

    try {
      const prefixedKey = this.getPrefixedKey(key);
      const itemStr = localStorage.getItem(prefixedKey);
      
      if (!itemStr) return false;

      const item = JSON.parse(itemStr);
      
      // 检查是否过期
      if (item.expiry && Date.now() > item.expiry) {
        this.removeItem(key);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`检查本地存储项失败 [${key}]:`, error);
      return false;
    }
  }

  /**
   * 获取所有与本应用相关的存储键
   * @returns 存储键数组
   */
  static getKeys(): string[] {
    if (!this.isSupported()) return [];

    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .map(key => key.substring(this.PREFIX.length));
    } catch (error) {
      console.error('获取存储键失败:', error);
      return [];
    }
  }

  /**
   * 获取本地存储的使用情况
   * @returns 存储使用情况对象
   */
  static getStorageInfo(): {
    used: number;
    total: number;
    percentUsed: number;
    keysCount: number;
  } {
    if (!this.isSupported()) {
      return { used: 0, total: 0, percentUsed: 0, keysCount: 0 };
    }

    try {
      // 估算已使用的存储空间（以字节为单位）
      let usedBytes = 0;
      const keys = Object.keys(localStorage);
      
      for (const key of keys) {
        if (key.startsWith(this.PREFIX)) {
          usedBytes += key.length + (localStorage.getItem(key)?.length || 0);
        }
      }

      // localStorage通常限制为5MB
      const totalBytes = 5 * 1024 * 1024;
      const percentUsed = (usedBytes / totalBytes) * 100;
      
      return {
        used: usedBytes,
        total: totalBytes,
        percentUsed: Math.round(percentUsed * 100) / 100,
        keysCount: this.getKeys().length
      };
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return { used: 0, total: 0, percentUsed: 0, keysCount: 0 };
    }
  }

  /**
   * 批量设置多个存储项
   * @param items 键值对对象
   * @param expiryDays 过期天数（可选）
   * @returns 成功设置的项数
   */
  static setMultipleItems(items: Record<string, any>, expiryDays?: number): number {
    let successCount = 0;
    
    Object.entries(items).forEach(([key, value]) => {
      if (this.setItem(key, value, expiryDays)) {
        successCount++;
      }
    });

    return successCount;
  }

  /**
   * 批量获取多个存储项
   * @param keys 存储键数组
   * @returns 键值对对象
   */
  static getMultipleItems<T extends Record<string, any>>(keys: string[]): Partial<T> {
    const result: Partial<T> = {};
    
    keys.forEach(key => {
      const value = this.getItem<T[keyof T]>(key);
      if (value !== undefined) {
        result[key as keyof T] = value;
      }
    });

    return result;
  }

  /**
   * 批量删除多个存储项
   * @param keys 存储键数组
   * @returns 成功删除的项数
   */
  static removeMultipleItems(keys: string[]): number {
    let successCount = 0;
    
    keys.forEach(key => {
      if (this.removeItem(key)) {
        successCount++;
      }
    });

    return successCount;
  }
}

export default LocalStorageManager;