import React, { useState } from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/contexts/cartContext';

import { EmptyCart } from './EmptyCart';
import { CartItem } from './CartItem';
import { CheckoutModal } from './CheckoutModal';

interface CartSidebarProps {
  onClose: () => void;
}

// 格式化价格显示
function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function CartSidebar({ onClose }: CartSidebarProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <div className="w-full">
      {/* 购物车头部 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">购物车</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 购物车商品列表 */}
      <div className="flex-grow overflow-y-auto p-6">
        {items.length === 0 ? (
          <EmptyCart onContinueShopping={onClose} />
        ) : (
          <div className="space-y-6">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </ul>
            
            {/* 清空购物车按钮 */}
            <button
              onClick={clearCart}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清空购物车
            </button>
          </div>
        )}
      </div>

      {/* 购物车底部 - 结算区域 */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">小计</span>
              <span className="text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">运费</span>
              <span className="text-gray-900">免费</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-medium text-gray-900">总计</span>
              <span className="font-bold text-lg text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
          </div>
           
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition hover:scale-[1.02] active:scale-[0.98]"
          >
            去结算
          </button>
          
          {/* 结算模态框 */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={items}
            totalPrice={totalPrice}
            onClearCart={clearCart}
          />
        </div>
      )}
    </div>
  );
}