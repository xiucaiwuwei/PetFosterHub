import React from 'react';
import { motion } from 'framer-motion';
import { Veterinarian } from '../types';
import { Check, Star, StarHalf, Calendar, Clock, Shield, MessageCircle } from 'lucide-react';

interface VetSelectorProps {
  veterinarians: Veterinarian[];
  selectedVet: Veterinarian | null;
  onSelectVet: (vet: Veterinarian) => void;
}

const VetSelector: React.FC<VetSelectorProps> = ({ 
  veterinarians, 
  selectedVet, 
  onSelectVet 
}) => {
  if (veterinarians.length === 0) {
    return (
      <motion.div 
        className="text-center py-16 px-6 bg-gray-50 rounded-xl border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full mb-4">
          <MessageCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无可用的兽医</h3>
        <p className="text-gray-500">请稍后再试或联系客服咨询其他安排</p>
      </motion.div>
    );
  }

  // 渲染星级评分
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {veterinarians.map((vet, index) => (
        <motion.div
          key={vet.id}
          onClick={() => onSelectVet(vet)}
          className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer bg-white ${selectedVet?.id === vet.id ? 'border-orange-500 shadow-xl ring-1 ring-orange-200 bg-orange-50' : 'border-gray-100 hover:border-orange-300 hover:shadow-md hover:bg-orange-50'}
          `}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="p-5 flex">
            <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-orange-100 shadow-sm flex-shrink-0">
              <img
                src={vet.avatar || 'https://placehold.co/200x200?text=Vet+' + vet.name.charAt(0)}
                alt={vet.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            
            <div className="flex-grow ml-5">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  {vet.name}
                  {selectedVet?.id === vet.id && (
                    <motion.span
                      className="ml-2 text-orange-500"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.span>
                  )}
                </h3>
                {selectedVet?.id === vet.id && (
                  <span className="text-xs font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    已选择
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full w-fit">
                <Shield className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                {vet.specialty}
              </div>
              
              <p className="text-sm text-gray-500 mt-1.5">经验 {vet.experience}</p>
              
              <div className="flex items-center mt-3 space-x-1">
                {renderRating(vet.rating)}
                <span className="text-sm text-gray-500 ml-1">
                  {vet.rating.toFixed(1)} ({vet.reviews})
                </span>
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-medium py-1.5 px-3 rounded-lg w-fit shadow-sm">
                问诊费: ¥{vet.price}/次
              </div>
            </div>
          </div>
          
          {/* 可用性指标 */}
          <div className="px-5 py-4 border-t border-gray-100 bg-white/50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1.5 text-green-500" />
                {vet.available ? '今日可约' : '今日已满'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageCircle className="w-4 h-4 mr-1.5 text-blue-500" />
                快速回复
              </div>
            </div>
            
            {!selectedVet?.id && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${vet.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {vet.available ? '可预约' : '暂不可约'}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VetSelector;