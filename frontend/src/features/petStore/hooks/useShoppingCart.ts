import { useState, useEffect } from 'react';
import type { PetProduct } from '@/features/petStore/types';

interface CartItem {
  product: PetProduct;
  quantity: number;
}

export const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // 从localStorage加载购物车数据
  useEffect(() => {
    const savedCart = localStorage.getItem('petStoreCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
  }, []);

  // 更新购物车统计信息
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    setCartCount(count);
    setCartTotal(total);
    
    // 保存到localStorage
    localStorage.setItem('petStoreCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 添加商品到购物车
  const addToCart = (product: PetProduct, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // 如果商品已存在，更新数量
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // 如果商品不存在，添加新商品
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  // 更新购物车中商品的数量
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => {
      return prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
    });
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};