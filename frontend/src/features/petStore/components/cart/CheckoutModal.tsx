import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, CheckCircle, Check, AlertCircle, ArrowLeft, ArrowRight, FileText, ShoppingBag } from 'lucide-react';

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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemType[];
  totalPrice: number;
  onClearCart: () => void;
}

// 格式化价格显示
function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function CheckoutModal({ isOpen, onClose, items, totalPrice, onClearCart }: CheckoutModalProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
    notes: ''
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('alipay');
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  
  const checkoutSteps = [
    { id: 'step1', title: '收货地址' },
    { id: 'step2', title: '支付方式' },
    { id: 'step3', title: '订单确认' }
  ];
  
  const paymentMethods = [
    { id: 'alipay', name: '支付宝', description: '推荐使用支付宝APP扫码支付', icon: 'alipay' },
    { id: 'wechat', name: '微信支付', description: '推荐使用微信APP扫码支付', icon: 'wechat' },
    { id: 'card', name: '银行卡', description: '支持储蓄卡和信用卡支付', icon: 'card' }
  ];
  
  const handleNextStep = () => {
    if (currentStep < checkoutSteps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // 处理订单提交
      setCurrentStep(4);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">结算中心</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 步骤指示器 */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between">
            {checkoutSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep >= index + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {currentStep > index + 1 ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs ${currentStep >= index + 1 ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 结算内容区域 */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">收货地址</h4>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      收件人姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="请输入收件人姓名"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      联系电话 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="请输入联系电话"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    详细地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="请输入详细地址"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      省份/城市 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">请选择</option>
                      <option value="beijing">北京市</option>
                      <option value="shanghai">上海市</option>
                      <option value="guangzhou">广州市</option>
                      <option value="shenzhen">深圳市</option>
                      <option value="hangzhou">杭州市</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      区/县 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.district}
                      onChange={(e) => setShippingAddress({...shippingAddress, district: e.target.value})}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="请输入区/县"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      邮政编码
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="请输入邮政编码"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    备注信息
                  </label>
                  <textarea
                    value={shippingAddress.notes}
                    onChange={(e) => setShippingAddress({...shippingAddress, notes: e.target.value})}
                    rows={2}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="选填，如：放门口、电话通知等"
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">支付方式</h4>
              
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === method.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedPaymentMethod === method.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                        {selectedPaymentMethod === method.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xl font-bold mr-3 ${selectedPaymentMethod === method.id ? 'text-orange-500' : 'text-gray-500'}`}>
                          {method.icon === 'alipay' && '支'}
                          {method.icon === 'wechat' && '微'}
                          {method.icon === 'card' && '银'}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 mr-3" />
                  <div>
                    <h5 className="font-medium text-orange-800">支付安全提示</h5>
                    <p className="text-sm text-orange-700 mt-1">
                      我们采用加密技术保障您的支付安全，所有支付信息不会被存储
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">订单确认</h4>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">订单商品</h5>
                <ul className="divide-y divide-gray-200">
                  {items.map(item => {
                    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
                    return (
                      <li key={item.product.id} className="py-3 flex">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md mr-3"
                        />
                        <div className="flex-grow">
                          <h6 className="font-medium text-gray-900 line-clamp-1">{item.product.name}</h6>
                          <p className="text-sm text-gray-500">{item.product.brand} · {item.product.weight}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-900">
                              {formatPrice(discountedPrice)} × {item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatPrice(discountedPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">商品总价</span>
                  <span className="text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">运费</span>
                  <span className="text-gray-900">免费</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">优惠</span>
                  <span className="text-green-600">-¥0.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-lg text-gray-900">订单总计</span>
                  <span className="font-bold text-lg text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="agreement" className="ml-3 text-sm text-gray-600">
                  我已阅读并同意<a href="#" className="text-orange-500 hover:underline">《服务条款》</a>和<a href="#" className="text-orange-500 hover:underline">《隐私政策》</a>
                </label>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="text-center py-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-12 h-12 text-green-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">支付成功！</h4>
              <p className="text-gray-600 mb-6">您的订单已提交成功，我们将尽快为您发货</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block">
                <p className="text-sm text-gray-900">
                  订单编号: <span className="font-medium">ORD-{Date.now().toString().slice(-8)}</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onClearCart();
                  }}
                  className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  完成购物
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/profile?tab=orders');
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FileText className="w-5 h-5 mr-2" />查看订单
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        {currentStep < 4 && (
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />上一步
            </button>
            
            <button
              onClick={handleNextStep}
              disabled={currentStep === 3 && !agreementAccepted}
              className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${currentStep === 3 && !agreementAccepted ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
            >
              {currentStep === 3 ? (
                <>
                  提交订单
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  下一步
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}