import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { PetProduct } from '@/features/petStore/types/entity/PetProduct';

// 定义收藏夹上下文类型
interface FavoritesContextType {
  items: PetProduct[];
  itemCount: number;
  addItem: (product: PetProduct) => void;
  removeItem: (productId: string) => void;
  clearFavorites: () => void;
  isOpen: boolean;
  toggleFavorites: () => void;
  isFavorited: (productId: string) => boolean;
}

// 定义收藏夹操作类型
type FavoritesAction =
  | { type: 'ADD_ITEM'; payload: PetProduct }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'TOGGLE_FAVORITES' }
  | { type: 'SET_FAVORITES'; payload: PetProduct[] };

// 定义收藏夹状态类型
interface FavoritesState {
  items: PetProduct[];
  isOpen: boolean;
}

// 初始状态
const initialState: FavoritesState = {
  items: [],
  isOpen: false
};

// 收藏夹 reducer
const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // 检查商品是否已在收藏夹中
      const isAlreadyFavorited = state.items.some(
        item => item.id === action.payload.id
      );
      
      // 如果商品已在收藏夹中，不执行任何操作
      if (isAlreadyFavorited) return state;
      
      const updatedItems = [...state.items, action.payload];
      
      // 保存到本地存储
      localStorage.setItem('favorites', JSON.stringify(updatedItems));
      
      return { ...state, items: updatedItems };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        item => item.id !== action.payload
      );
      
      // 保存到本地存储
      localStorage.setItem('favorites', JSON.stringify(updatedItems));
      
      return { ...state, items: updatedItems };
    }
    
    case 'CLEAR_FAVORITES': {
      // 清空本地存储
      localStorage.removeItem('favorites');
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
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// 收藏夹提供者组件
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  
  // 从本地存储加载收藏夹数据
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // 确保解析后的数据是数组格式
        if (Array.isArray(parsedFavorites)) {
          dispatch({ type: 'SET_FAVORITES', payload: parsedFavorites });
        } else {
          console.warn('Invalid favorites data format, initializing empty favorites');
          dispatch({ type: 'SET_FAVORITES', payload: [] });
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
      // 发生错误时初始化空收藏夹
      dispatch({ type: 'SET_FAVORITES', payload: [] });
    }
  }, []);
  
  // 计算收藏商品总数
  const itemCount = state.items.length;
  
  // 添加商品到收藏夹
  const addItem = (product: PetProduct) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  // 从收藏夹移除商品
  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  // 清空收藏夹
  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };
  
  // 切换收藏夹侧边栏显示/隐藏
  const toggleFavorites = () => {
    dispatch({ type: 'TOGGLE_FAVORITES' });
  };
  
  // 检查商品是否已收藏
  const isFavorited = (productId: string) => {
    return state.items.some(item => item.id === productId);
  };
  
  return (
    <FavoritesContext.Provider value={{
      items: state.items,
      itemCount,
      addItem,
      removeItem,
      clearFavorites,
      isOpen: state.isOpen,
      toggleFavorites,
      isFavorited
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// 自定义 hook 以便在组件中使用收藏夹上下文
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};