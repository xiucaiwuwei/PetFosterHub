import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  discount: number;
  brand: string;
  weight: string;
}

interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

// 格式化价格显示
function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const discountedPrice = item.product.price * (1 - item.product.discount / 100);

  return (
    <li className="py-4 flex">
      <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            {item.product.name}
          </h3>
          <button
              onClick={() => onRemove(item.product.id)}
              className="text-gray-400 hover:text-red-500"
              aria-label="删除商品"
            >
              <Trash2 className="w-4 h-4" />
            </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">{item.product.brand} · {item.product.weight}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-md w-24">
            <button
                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                className="px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={item.quantity <= 1}
                aria-label="减少数量"
              >
                <Minus className="w-3 h-3" />
              </button>
            <span className="px-2 py-1 border-x border-gray-300 text-center w-8">
              {item.quantity}
            </span>
            <button
                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                className="px-2 py-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="增加数量"
              >
                <Plus className="w-3 h-3" />
              </button>
          </div>
          
          <div className="text-sm font-medium text-gray-900">
            {formatPrice(discountedPrice)}
          </div>
        </div>
      </div>
    </li>
  );
}