import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// 订单状态类型
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';

// 订单商品类型
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// 订单类型
export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    zipCode: string;
  };
}

const OrderDrawer: React.FC<OrderDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  
  // 模拟订单数据
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-20240528-789',
      createdAt: '2024-05-28T14:30:00',
      status: 'processing',
      totalPrice: 129.90,
      items: [
        {
          id: 'p1',
          name: '高级宠物干粮',
          price: 89.90,
          quantity: 1,
          imageUrl: '/images/products/dry-food-1.jpg'
        },
        {
          id: 'p2',
          name: '宠物玩具球',
          price: 40.00,
          quantity: 1,
          imageUrl: '/images/products/toy-1.jpg'
        }
      ],
      shippingAddress: {
        name: '张三',
        phone: '138****1234',
        address: '幸福路123号',
        city: '北京市',
        district: '朝阳区',
        zipCode: '100000'
      }
    },
    {
      id: '2',
      orderNumber: 'ORD-20240520-456',
      createdAt: '2024-05-20T10:15:00',
      status: 'completed',
      totalPrice: 59.90,
      items: [
        {
          id: 'p3',
          name: '宠物洗护套装',
          price: 59.90,
          quantity: 1,
          imageUrl: '/images/products/care-1.jpg'
        }
      ],
      shippingAddress: {
        name: '张三',
        phone: '138****1234',
        address: '幸福路123号',
        city: '北京市',
        district: '朝阳区',
        zipCode: '100000'
      }
    }
  ];

  // 根据选中的标签过滤订单
  const filteredOrders = mockOrders.filter(order => {
    if (selectedTab === 'active') {
      return ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status);
    } else {
      return ['completed', 'cancelled'].includes(order.status);
    }
  });

  // 获取订单状态的中文名称和样式
  const getOrderStatusInfo = (status: OrderStatus) => {
    const statusMap = {
      pending: { text: '待付款', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { text: '已确认', className: 'bg-blue-100 text-blue-800' },
      processing: { text: '处理中', className: 'bg-indigo-100 text-indigo-800' },
      shipped: { text: '已发货', className: 'bg-purple-100 text-purple-800' },
      delivered: { text: '已送达', className: 'bg-green-100 text-green-800' },
      cancelled: { text: '已取消', className: 'bg-red-100 text-red-800' },
      completed: { text: '已完成', className: 'bg-gray-100 text-gray-800' }
    };
    return statusMap[status];
  };

  // 格式化价格
  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 处理查看详情
  const handleViewDetails = (orderId: string) => {
    onClose();
    // 这里可以跳转到订单详情页
    navigate(`/profile/orders/${orderId}`);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
    >
      {/* 订单抽屉头部 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">我的订单</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
          aria-label="关闭"
        >
          <i className="fa-solid fa-times text-xl"></i>
        </button>
      </div>

      {/* 订单标签页 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${selectedTab === 'active' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('active')}
          >
            进行中
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${selectedTab === 'completed' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSelectedTab('completed')}
          >
            已完成
          </button>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="flex-grow overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="fa-solid fa-file-invoice text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无{selectedTab === 'active' ? '进行中' : '已完成'}的订单</h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              {selectedTab === 'active' ? '您还没有进行中的订单，快去选购商品吧！' : '您还没有已完成的订单'}            
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              继续购物
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getOrderStatusInfo(order.status);
              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  {/* 订单头部 */}
                  <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  
                  {/* 订单商品 */}
                  <div className="px-4 py-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder.png';
                            }}
                          />
                        </div>
                        <div className="ml-3 flex-grow">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-500">x{item.quantity}</span>
                            <span className="text-sm font-medium text-gray-900">{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 订单底部 */}
                  <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">创建时间: {formatDate(order.createdAt)}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品 合计: 
                        <span className="text-orange-500 ml-1">{formatPrice(order.totalPrice)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="px-3 py-1 border border-orange-500 text-orange-500 text-sm font-medium rounded-md hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 返回顶部按钮 */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <i className="fa-solid fa-arrow-up mr-1"></i>
          返回顶部
        </button>
      </div>
    </motion.div>
  );
};

export default OrderDrawer;