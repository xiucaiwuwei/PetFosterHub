import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface EmptyCartProps {
  onContinueShopping: () => void;
}

export function EmptyCart({ onContinueShopping }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ShoppingCart className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">购物车为空</h3>
      <p className="text-gray-500 mb-6 max-w-xs">
        看起来您的购物车还是空的，快去添加一些商品吧！
      </p>
      <button
        onClick={onContinueShopping}
        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        继续购物
      </button>
    </div>
  );
}