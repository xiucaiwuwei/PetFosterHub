// 存储在localStorage中的token键名
import LocalStorageManager from './LocalStorageManager';

// 认证相关的存储键
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRE_KEY = 'token_expire_time';
const USER_INFO_KEY = 'userInfo';

/**
 * 获取存储的token
 * @returns token字符串或null
 */
export const getToken = (): string | null => {
  return LocalStorageManager.getItem<string>(TOKEN_KEY) || null;
};

/**
 * 存储token
 * @param token 要存储的token字符串
 * @param expiryDays 过期天数（可选）
 * @returns 是否存储成功
 */
export const setToken = (token: string, expiryDays?: number): boolean => {
  return LocalStorageManager.setItem(TOKEN_KEY, token, expiryDays);
};

/**
 * 删除存储的token
 * @returns 是否删除成功
 */
export const removeToken = (): boolean => {
  return LocalStorageManager.removeMultipleItems([
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    TOKEN_EXPIRE_KEY
  ]) === 3;
};

/**
 * 获取刷新token
 * @returns 刷新token字符串或null
 */
export const getRefreshToken = (): string | null => {
  return LocalStorageManager.getItem<string>(REFRESH_TOKEN_KEY) || null;
};

/**
 * 设置刷新token
 * @param refreshToken 刷新token字符串
 * @param expiryDays 过期天数（可选）
 * @returns 是否设置成功
 */
export const setRefreshToken = (refreshToken: string, expiryDays?: number): boolean => {
  return LocalStorageManager.setItem(REFRESH_TOKEN_KEY, refreshToken, expiryDays);
};

/**
 * 获取token过期时间
 * @returns 过期时间戳或null
 */
export const getTokenExpireTime = (): number | null => {
  return LocalStorageManager.getItem<number>(TOKEN_EXPIRE_KEY) || null;
};

/**
 * 设置token过期时间
 * @param expireTime 过期时间戳
 * @returns 是否设置成功
 */
export const setTokenExpireTime = (expireTime: number): boolean => {
  return LocalStorageManager.setItem(TOKEN_EXPIRE_KEY, expireTime);
};

/**
 * 检查token是否已过期
 * @returns 是否过期
 */
export const isTokenExpired = (): boolean => {
  const expireTime = getTokenExpireTime();
  if (!expireTime) return true;
  
  const now = Date.now();
  return now > expireTime;
};

/**
 * 清除所有认证信息
 * @returns 是否清除成功
 */
export const clearAuthInfo = (): boolean => {
  const keysToClear = [
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    TOKEN_EXPIRE_KEY,
    USER_INFO_KEY
  ];
  
  const clearedCount = LocalStorageManager.removeMultipleItems(keysToClear);
  return clearedCount === keysToClear.length;
};

/**
 * 检查是否已登录（是否有有效的token）
 * @returns 是否已登录
 */
export const isLoggedIn = (): boolean => {
  const token = getToken();
  return !!token && !isTokenExpired();
};

/**
 * 存储用户信息
 * @param userInfo 用户信息对象
 * @returns 是否存储成功
 */
export const setUserInfo = <T extends object>(userInfo: T): boolean => {
  return LocalStorageManager.setItem(USER_INFO_KEY, userInfo);
};

/**
 * 获取用户信息
 * @returns 用户信息对象或null
 */
export const getUserInfo = <T extends object>(): T | null => {
  return LocalStorageManager.getItem<T>(USER_INFO_KEY) || null;
};

/**
 * 删除用户信息
 * @returns 是否删除成功
 */
export const removeUserInfo = (): boolean => {
  return LocalStorageManager.removeItem(USER_INFO_KEY);
};

/**
 * 存储完整的认证信息
 * @param token JWT token
 * @param refreshToken 刷新token
 * @param expireTime 过期时间戳
 * @param userInfo 用户信息（可选）
 * @param expiryDays 过期天数（可选）
 * @returns 是否存储成功
 */
export const setAuthInfo = <T extends object>(
  token: string,
  refreshToken: string,
  expireTime: number,
  userInfo?: T,
  expiryDays?: number
): boolean => {
  const items: Record<string, any> = {
    [TOKEN_KEY]: token,
    [REFRESH_TOKEN_KEY]: refreshToken,
    [TOKEN_EXPIRE_KEY]: expireTime
  };
  
  if (userInfo) {
    items[USER_INFO_KEY] = userInfo;
  }
  
  const successCount = LocalStorageManager.setMultipleItems(items, expiryDays);
  return successCount === Object.keys(items).length;
};

/**
 * 获取所有认证信息
 * @returns 包含所有认证信息的对象
 */
export const getAuthInfo = <T extends object>(): {
  token: string | null;
  refreshToken: string | null;
  expireTime: number | null;
  userInfo: T | null;
} => {
  return {
    token: getToken(),
    refreshToken: getRefreshToken(),
    expireTime: getTokenExpireTime(),
    userInfo: getUserInfo<T>(),
  };
};