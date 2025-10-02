/*
 * 收藏夹上下文组件
 * 管理用户收藏的寄养服务数据和操作
 */
import { createContext, useReducer, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { FosterService } from '@/features/foster/types/entity';

// 定义寄养服务收藏夹上下文类型
interface FosterFavoritesContextType {
  items: FosterService[];
  itemCount: number;
  favoritesCount: number; // 作为itemCount的别名
  addItem: (service: FosterService) => void;
  removeItem: (serviceId: string) => void;
  clearFavorites: () => void;
  isOpen: boolean;
  toggleFavorites: () => void;
  isFavorited: (serviceId: string) => boolean;
}

// 定义收藏夹操作类型
type FosterFavoritesAction =
  | { type: 'ADD_ITEM'; payload: FosterService }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'TOGGLE_FAVORITES' }
  | { type: 'SET_FAVORITES'; payload: FosterService[] };

// 定义收藏夹状态类型
interface FosterFavoritesState {
  items: FosterService[];
  isOpen: boolean;
}

// 初始状态
const initialState: FosterFavoritesState = {
  items: [],
  isOpen: false
};

// 收藏夹 reducer
const fosterFavoritesReducer = (state: FosterFavoritesState, action: FosterFavoritesAction): FosterFavoritesState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // 检查服务是否已在收藏夹中
      const isAlreadyFavorited = state.items.some(
        item => item.id === action.payload.id
      );
      
      // 如果服务已在收藏夹中，不执行任何操作
      if (isAlreadyFavorited) return state;
      
      const updatedItems = [...state.items, action.payload];
      
      // 保存到本地存储
      localStorage.setItem('fosterFavorites', JSON.stringify(updatedItems));
      
      return { ...state, items: updatedItems };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        item => item.id !== action.payload
      );
      
      // 保存到本地存储
      localStorage.setItem('fosterFavorites', JSON.stringify(updatedItems));
      
      return { ...state, items: updatedItems };
    }
    
    case 'CLEAR_FAVORITES': {
      // 清空本地存储
      localStorage.removeItem('fosterFavorites');
      return { ...state, items: [] };
    }
    
    case 'TOGGLE_FAVORITES':
      return { ...state, isOpen: !state.isOpen };
      
    case 'SET_FAVORITES':
      return { ...state, items: action.payload };
      
    default:
      return state;
  }
};

// 创建上下文
const FosterFavoritesContext = createContext<FosterFavoritesContextType | undefined>(undefined);

// 收藏夹提供者组件
export const FosterFavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(fosterFavoritesReducer, initialState);
  
  // 从本地存储加载收藏夹数据
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('fosterFavorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // 确保解析后的数据是数组格式
        if (Array.isArray(parsedFavorites)) {
          dispatch({ type: 'SET_FAVORITES', payload: parsedFavorites });
        } else {
          console.warn('Invalid foster favorites data format, initializing empty favorites');
          dispatch({ type: 'SET_FAVORITES', payload: [] });
        }
      }
    } catch (error) {
      console.error('Failed to load foster favorites from localStorage:', error);
      // 发生错误时初始化空收藏夹
      dispatch({ type: 'SET_FAVORITES', payload: [] });
    }
  }, []);
  
  // 计算收藏服务总数
  const itemCount = state.items.length;
  
  // 添加服务到收藏夹
  const addItem = (service: FosterService) => {
    dispatch({ type: 'ADD_ITEM', payload: service });
  };
  
  // 从收藏夹移除服务
  const removeItem = (serviceId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: serviceId });
  };
  
  // 清空收藏夹
  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };
  
  // 切换收藏夹侧边栏显示/隐藏
  const toggleFavorites = () => {
    dispatch({ type: 'TOGGLE_FAVORITES' });
  };
  
  // 检查服务是否已收藏
  const isFavorited = (serviceId: string) => {
    return state.items.some(item => item.id === serviceId);
  };
  
  return (
    <FosterFavoritesContext.Provider value={{
      items: state.items,
      itemCount,
      favoritesCount: itemCount, // 别名，方便在其他地方使用
      addItem,
      removeItem,
      clearFavorites,
      isOpen: state.isOpen,
      toggleFavorites,
      isFavorited
    }}>
      {children}
    </FosterFavoritesContext.Provider>
  );
};

// 自定义hook，用于使用收藏夹上下文
export const useFosterFavorites = () => {
  const context = useContext(FosterFavoritesContext);
  if (context === undefined) {
    throw new Error('useFosterFavorites must be used within a FosterFavoritesProvider');
  }
  return context;
};