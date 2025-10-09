/**
 * 我的宠物标签页组件
 */
import React from 'react';
import { Pet } from '@/types';
import { PawPrint, Plus, Edit, Trash2 } from 'lucide-react';

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
            <div key={pet.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                <div className="w-full h-48 bg-orange-50 overflow-hidden">
                  <img
                    src={pet.imageUrls[0]}
                    alt={pet.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-orange-500 shadow-md transition-all">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 shadow-md transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg">{pet.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{pet.breed} · {pet.age}岁</p>
                  
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {pet.type === 'dog' ? '狗狗' : pet.type === 'cat' ? '猫咪' : '其他宠物'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {pet.vaccinated ? '已接种疫苗' : '未接种疫苗'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {pet.size === 'small' ? '小型' : pet.size === 'medium' ? '中型' : '大型'}
                  </span>
                </div>
                  
                {pet.specialNeeds && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h5 className="text-xs font-medium text-gray-500 mb-1">特殊需求:</h5>
                    <p className="text-sm text-gray-600">{pet.specialNeeds}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <PawPrint className="text-2xl text-orange-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">您还没有添加宠物</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            添加您的宠物信息，以便寄养人士更好地了解它们的需求
          </p>
          <button 
            onClick={onAddPet}
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={16} className="mr-2" />
            添加宠物
          </button>
        </div>
      )}
    </div>
  );
};