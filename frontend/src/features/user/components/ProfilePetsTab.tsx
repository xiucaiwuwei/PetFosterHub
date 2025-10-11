/**
 * 我的宠物标签页组件
 */
import React from 'react';
import { Pet } from '@/types';
import { PawPrint, Plus, Edit, Trash2, Heart, Award, Info } from 'lucide-react';

interface ProfilePetsTabProps {
  pets: Pet[];
  onAddPet: () => void;
}

/**
 * 我的宠物标签页组件
 */
export const ProfilePetsTab: React.FC<ProfilePetsTabProps> = ({
  pets,
  onAddPet
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <PawPrint className="mr-2 text-orange-500" size={22} />
          我的宠物
        </h3>
        <button 
          onClick={onAddPet}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus size={16} className="mr-2" />
          添加宠物
        </button>
      </div>
      
      {pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="relative">
                {/* 宠物图片 - 精美的卡片顶部设计 */}
                <div className="w-full h-48 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden rounded-t-xl">
                  <img
                    src={pet.imageUrls[0]}
                    alt={pet.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* 装饰元素 - 更精致的渐变遮罩 */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
                
                {/* 操作按钮 - 更流畅的动画效果 */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-orange-500 shadow-md transition-all duration-300 hover:bg-orange-50 hover:scale-105">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 shadow-md transition-all duration-300 hover:bg-red-50 hover:scale-105">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* 喜爱按钮 - 更有吸引力的设计 */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <button className="p-2 bg-white rounded-full text-gray-500 hover:text-red-500 shadow-md transition-all duration-300 hover:bg-red-50 hover:scale-105">
                    <Heart size={16} />
                  </button>
                </div>
              </div>
              
              {/* 宠物信息 */}
              <div className="p-5 bg-white rounded-b-xl">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg flex items-center transition-colors duration-300 group-hover:text-orange-600">
                    {pet.name}
                    {/* 特殊标记 - 更醒目的设计 */}
                    {pet.specialNeeds && (
                      <span className="ml-2 text-red-500 animate-pulse transition-transform duration-300 hover:scale-110">
                        <Info size={16} />
                      </span>
                    )}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3 font-medium">{pet.breed} · {pet.age}岁</p>
                  
                {/* 标签组 - 更精美的样式 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-all duration-300 hover:bg-blue-200 hover:shadow-sm transform hover:scale-105">
                    {pet.type === 'dog' ? '狗狗' : pet.type === 'cat' ? '猫咪' : '其他宠物'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 transition-all duration-300 hover:bg-green-200 hover:shadow-sm transform hover:scale-105">
                    {pet.vaccinated ? '已接种疫苗' : '未接种疫苗'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 transition-all duration-300 hover:bg-purple-200 hover:shadow-sm transform hover:scale-105">
                    {pet.size === 'small' ? '小型' : pet.size === 'medium' ? '中型' : '大型'}
                  </span>
                </div>
                  
                {/* 特殊需求 - 增强视觉效果 */}
                {pet.specialNeeds && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100 shadow-sm transition-all duration-500 hover:bg-orange-100 hover:shadow-md transform hover:-translate-y-1">
                    <h5 className="text-xs font-medium text-orange-600 mb-1 flex items-center">
                      <Info size={12} className="mr-1" />
                      特殊需求
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">{pet.specialNeeds}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden transition-all duration-500 hover:shadow-md">
          {/* 背景装饰 - 更精美的动态效果 */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-orange-50 to-transparent opacity-50"></div>
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-orange-100 opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-orange-100 opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="relative z-10">
            {/* 宠物图标 - 更生动的设计 */}
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transform transition-all duration-700 hover:scale-110 hover:shadow-xl">
              <PawPrint className="text-3xl text-white" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">您还没有添加宠物</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              添加您的宠物信息，以便寄养人士更好地了解它们的需求
            </p>
            <button 
              onClick={onAddPet}
              className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:scale-105"
            >
              <Plus size={16} className="mr-2" />
              添加宠物
            </button>
          </div>
        </div>
      )}
    </div>
  );
};