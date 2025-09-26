import { useState, useEffect, useCallback } from 'react';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

interface LocalStorageViewerProps {
  className?: string;
  keys?: string[];
  defaultCollapsed?: boolean; // 是否默认折叠
  compact?: boolean; // 是否使用紧凑模式
  theme?: 'default' | 'modern' | 'vibrant'; // 主题选择
}

/**
 * 本地存储查看器组件 - 用于展示和删除本地存储的信息
 */
export function LocalStorageViewer({
  className = '',
  keys = ['userInfo', 'token'],
  defaultCollapsed = false,
  compact = false,
  theme = 'default' // 新增主题支持
}: LocalStorageViewerProps) {
  // 主题颜色映射
  const themeColors = {
    default: {
      primary: 'blue-500',
      secondary: 'gray-600',
      background: 'bg-white',
      backgroundDark: 'bg-gray-900',
      border: 'border-gray-200',
      borderDark: 'border-gray-800'
    },
    modern: {
      primary: 'indigo-500',
      secondary: 'gray-500',
      background: 'bg-white/90',
      backgroundDark: 'bg-gray-850',
      border: 'border-indigo-100',
      borderDark: 'border-indigo-900/50'
    },
    vibrant: {
      primary: 'purple-500',
      secondary: 'pink-500',
      background: 'bg-gradient-to-br from-white to-purple-50',
      backgroundDark: 'bg-gradient-to-br from-gray-900 to-purple-900/30',
      border: 'border-purple-100',
      borderDark: 'border-purple-800/30'
    }
  };

  const currentTheme = themeColors[theme as keyof typeof themeColors] || themeColors.default;
  const [storageData, setStorageData] = useState<Record<string, any>>({});
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // 读取本地存储数据
  const loadStorageData = useCallback(() => {
    const data: Record<string, any> = {};
    
    // 读取指定的键
    keys.forEach(key => {
      try {
        const value = LocalStorageManager.getItem(key);
        if (value !== undefined) {
          data[key] = value;
        }
      } catch (error) {
        console.error(`读取键 ${key} 失败:`, error);
        data[key] = `读取失败: ${error instanceof Error ? error.message : '未知错误'}`;
      }
    });
    
    setStorageData(data);
  }, [keys]);

  // 切换键的展开/折叠状态
  const toggleKey = (key: string) => {
    const newExpandedKeys = new Set(expandedKeys);
    if (newExpandedKeys.has(key)) {
      newExpandedKeys.delete(key);
    } else {
      newExpandedKeys.add(key);
    }
    setExpandedKeys(newExpandedKeys);
  };

  // 格式化值用于显示
  const formatValue = (value: any) => {
    if (value === null || value === undefined) {
      return String(value);
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  // 删除指定的键
  const deleteKey = useCallback((key: string) => {
    try {
      LocalStorageManager.removeItem(key);
      loadStorageData();
      toast.success(`删除成功: 已删除键: ${key}`);
    } catch (error) {
      console.error(`删除键 ${key} 失败:`, error);
      toast.error(`删除失败: 删除键 ${key} 时出错`);
    }
  }, [loadStorageData]);

  // 清空所有指定的键
  const clearAllKeys = useCallback(() => {
    try {
      keys.forEach(key => {
        LocalStorageManager.removeItem(key);
      });
      loadStorageData();
      toast.success('清空成功: 已清空所有指定的键');
    } catch (error) {
      console.error('清空键失败:', error);
      toast.error('清空失败: 清空键时出错');
    }
  }, [keys, loadStorageData]);



  // 组件挂载时加载数据
  useEffect(() => {
    loadStorageData();
  }, []);

  // 切换整个组件的折叠状态
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          `${currentTheme.background} ${currentTheme.border} rounded-xl shadow-md overflow-hidden dark:${currentTheme.backgroundDark} dark:${currentTheme.borderDark}`,
          compact && 'text-xs',
          className,
          'backdrop-blur-sm'
        )}
      >
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-850 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <svg className={`w-5 h-5 text-${currentTheme.primary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <h3 className={cn(
                'font-medium text-gray-800 dark:text-gray-200 font-semibold',
                compact ? 'text-sm' : 'text-base'
              )}>本地存储查看器</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Object.keys(storageData).length} 个存储项
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {Object.keys(storageData).length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.confirm('确定要清空所有指定的本地存储键吗？此操作无法撤销。')) {
                    clearAllKeys();
                  }
                }}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 transition-all duration-200 border border-red-100 dark:border-red-800/30"
                title="清空所有键"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                清空所有
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(107, 114, 128, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCollapse}
              className="flex items-center gap-1.5 p-1.5 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
              title={isCollapsed ? '展开面板' : '收起面板'}
            >
              {isCollapsed ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  展开
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  收起
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4">
                {Object.keys(storageData).length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-16 px-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 text-gray-300 dark:bg-gray-800 dark:text-gray-700 shadow-inner">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">没有找到数据</h4>
                    <p className="max-w-md">未检测到指定的本地存储键，数据可能尚未保存或已被清除</p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={loadStorageData}
                      className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      刷新数据
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    <AnimatePresence>
                      {Object.entries(storageData).map(([key, value]) => {
                          const isObject = typeof value === 'object' && value !== null;
                          const isExpanded = expandedKeys.has(key);
                           
                          // 获取显示值
                          const displayValue = () => {
                            return isObject && isExpanded 
                              ? formatValue(value) 
                              : (isObject ? `[对象: ${Object.keys(value).join(', ')}]` : formatValue(value));
                          };
                           
                          return (
                            <motion.div 
                              key={key} 
                              initial={{ opacity: 0, y: 10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.98 }}
                              transition={{ duration: 0.3 }}
                              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-850 dark:border-gray-700 mb-4 hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-850 dark:to-gray-800">
                                <div className="flex items-center gap-2">
                                  <svg className={`w-4 h-4 text-${currentTheme.primary} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                  <span className={cn(
                                    'font-mono font-medium text-gray-800 dark:text-gray-300 truncate max-w-[200px]',
                                    compact ? 'text-xs' : 'text-sm'
                                  )} title={key}>{key}</span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                                    {typeof value}
                                    {isObject && ` (${Object.keys(value).length} 项)`}
                                  </span>
                                </div>
                                <div className="flex gap-1.5">
                                  {isObject && (
                                    <motion.button
                                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(107, 114, 128, 0.1)' }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => toggleKey(key)}
                                      className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                                      title={isExpanded ? '收起对象' : '展开对象'}
                                    >
                                      {isExpanded ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      )}
                                    </motion.button>
                                  )}
                                  <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      if (window.confirm(`确定要删除键 "${key}" 吗？此操作无法撤销。`)) {
                                        deleteKey(key);
                                      }
                                    }}
                                    className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                    title="删除此键"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </motion.button>
                                </div>
                              </div>
                               
                              <AnimatePresence>
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="w-full overflow-hidden"
                                >
                                  <div className={`
                                    font-mono text-xs p-4 bg-gray-50 border-t border-gray-100
                                    ${isObject && isExpanded ? 'whitespace-pre-wrap' : 'whitespace-normal'}
                                    dark:bg-gray-900 dark:border-gray-800
                                    ${compact && 'p-2 text-[10px]'}
                                  `}>
                                    <motion.code 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.3 }}
                                      className="text-gray-700 dark:text-gray-300"
                                    >{displayValue()}</motion.code>
                                  </div>
                                </motion.div>
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );
}

export default LocalStorageViewer;