import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// 定义购物车商品类型
export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    discount: number;
    imageUrl: string;
    brand: string;
    weight: string;
  };
  quantity: number;
}

// 定义购物车上下文类型
interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (product: CartItem['product'], quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
}

// 定义购物车操作类型
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { product: CartItem['product']; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

// 定义购物车状态类型
interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// 初始状态
const initialState: CartState = {
  items: [],
  isOpen: false
};

// 购物车 reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.payload.product.id
      );

      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // 如果商品已存在，更新数量
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // 如果商品不存在，添加新商品
        updatedItems = [...state.items, {
          product: action.payload.product,
          quantity: action.payload.quantity
        }];
      }
      
      // 保存到本地存储
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      return { ...state, items: updatedItems };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(
        item => item.product.id !== action.payload.productId
      );
      
      // 保存到本地存储
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      return { ...state, items: updatedItems };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) return state;
      
      const updatedItems = state.items.map(item => 
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      // 保存到本地存储
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      return { ...state, items: updatedItems };
    }
    
    case 'CLEAR_CART': {
      // 清空本地存储
      localStorage.removeItem('cart');
      return { ...state, items: [] };
    }
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
      
    case 'SET_CART':
      return { ...state, items: action.payload };
      
    default:
      return state;
  }
};

// 创建上下文
const CartContext = createContext<CartContextType | undefined>(undefined);

// 购物车提供者组件
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // 从本地存储加载购物车数据
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // 计算商品总数
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  
  // 计算总价
  const totalPrice = state.items.reduce(
    (total, item) => total + (item.product.price * (1 - item.product.discount / 100)) * item.quantity,
    0
  );
  
  // 添加商品到购物车
  const addItem = (product: CartItem['product'], quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };
  
  // 从购物车移除商品
  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };
  
  // 更新商品数量
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };
  
  // 清空购物车
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  // 切换购物车侧边栏显示/隐藏
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };
  
  return (
    <CartContext.Provider value={{
      items: state.items,
      itemCount,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen: state.isOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 自定义 hook 以便在组件中使用购物车上下文
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}