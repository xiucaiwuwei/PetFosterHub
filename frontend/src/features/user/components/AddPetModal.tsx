/**
 * 添加宠物模态框组件
 */
import React, { useState } from 'react';
import { Pet } from '@/types';
import { PawPrint, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (petData: Omit<Pet, 'id' | 'ownerId' | 'imageUrls'>, imageFile: File | null) => Promise<void>;
  petsLength: number;
  userId: string;
  isSubmitting: boolean;
}

// 为newPet对象定义类型
interface NewPetType {
  name: string;
  type: string;
  breed: string;
  age: number;
  size: string;
  description: string;
  specialNeeds: string;
  vaccinated: boolean;
  imagePreview: string;
  imageFile: File | null;
}

/**
 * 添加宠物模态框组件
 */
export const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  onAddPet,
  petsLength,
  userId,
  isSubmitting
}) => {
  const [newPet, setNewPet] = useState<NewPetType>({
    name: '',
    type: 'dog',
    breed: '',
    age: 0,
    size: 'small',
    description: '',
    specialNeeds: '',
    vaccinated: true,
    imagePreview: '',
    imageFile: null
  });


  /**
   * 处理宠物照片上传
   */
  const handlePetPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPet({
        ...newPet,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  /**
   * 添加宠物
   */
  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单表单验证
    if (!newPet.name || !newPet.breed || newPet.age === 0) {
      toast.error('请填写必填字段');
      return;
    }
    
    // 创建宠物数据对象
    const petData: Omit<Pet, 'id' | 'ownerId' | 'imageUrls'> = {
      name: newPet.name,
      type: newPet.type as 'dog' | 'cat' | 'other',
      breed: newPet.breed,
      age: newPet.age,
      size: newPet.size as 'small' | 'medium' | 'large',
      description: newPet.description,
      specialNeeds: newPet.specialNeeds,
      vaccinated: newPet.vaccinated
    };
    
    // 调用父组件的添加宠物方法
    try {
      await onAddPet(petData, newPet.imageFile);
      // 重置表单
      setNewPet({
        name: '',
        type: 'dog',
        breed: '',
        age: 0,
        size: 'small',
        description: '',
        specialNeeds: '',
        vaccinated: true,
        imagePreview: '',
        imageFile: null
      });
    } catch (error) {
      console.error('添加宠物失败:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <PawPrint size={20} className="mr-2 text-orange-500" />
            添加宠物
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleAddPet} className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-8 gap-6">
            <div className="md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                宠物照片
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-orange-500 transition-all duration-300 cursor-pointer bg-gray-50 hover:bg-gray-100">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePetPhotoUpload}
                  className="hidden"
                  id="pet-photo"
                />
                <label htmlFor="pet-photo" className="cursor-pointer">
                  {newPet.imagePreview ? (
                    <img 
                      src={newPet.imagePreview} 
                      alt="宠物预览" 
                      className="w-full h-48 object-cover rounded-lg mx-auto shadow-sm" 
                    />
                  ) : (
                    <div className="py-10">
                      <Camera size={36} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-600">点击上传宠物照片</p>
                      <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG 格式</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-5">
              <div>
                <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  宠物名字 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pet-name"
                  value={newPet.name}
                  onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                  placeholder="请输入宠物的名字"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pet-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                    宠物类型 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="pet-type"
                    value={newPet.type}
                    onChange={(e) => setNewPet({...newPet, type: e.target.value})}
                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                    required
                  >
                    <option value="dog">狗狗</option>
                    <option value="cat">猫咪</option>
                    <option value="other">其他宠物</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="pet-breed" className="block text-sm font-medium text-gray-700 mb-1.5">
                    品种 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="pet-breed"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                    placeholder="请输入宠物的品种"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pet-age" className="block text-sm font-medium text-gray-700 mb-1.5">
                    年龄（岁） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="pet-age"
                    min="0"
                    max="20"
                    value={newPet.age || ''}
                    onChange={(e) => setNewPet({...newPet, age: parseInt(e.target.value) || 0})}
                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                    placeholder="请输入宠物的年龄"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="pet-size" className="block text-sm font-medium text-gray-700 mb-1.5">
                    体型
                  </label>
                  <select
                    id="pet-size"
                    value={newPet.size}
                    onChange={(e) => setNewPet({...newPet, size: e.target.value})}
                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                  >
                    <option value="small">小型</option>
                    <option value="medium">中型</option>
                    <option value="large">大型</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="pet-description" className="block text-sm font-medium text-gray-700 mb-1.5">
              宠物描述
            </label>
            <textarea
              id="pet-description"
              rows={3}
              value={newPet.description}
              onChange={(e) => setNewPet({...newPet, description: e.target.value})}
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm resize-none"
              placeholder="描述一下您的宠物性格、爱好等信息"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="pet-special-needs" className="block text-sm font-medium text-gray-700 mb-1.5">
              特殊需求或注意事项
            </label>
            <textarea
              id="pet-special-needs"
              rows={2}
              value={newPet.specialNeeds}
              onChange={(e) => setNewPet({...newPet, specialNeeds: e.target.value})}
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm resize-none"
              placeholder="如特殊饮食要求、药物、行为习惯等"
            ></textarea>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center h-5">
              <input
                id="pet-vaccinated"
                type="checkbox"
                checked={newPet.vaccinated}
                onChange={(e) => setNewPet({...newPet, vaccinated: e.target.checked})}
                className="w-4 h-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded transition-all duration-300"
              />
            </div>
            <label htmlFor="pet-vaccinated" className="ml-2 block text-sm text-gray-700">
              已接种疫苗
            </label>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-opacity-25 mr-2"></div>
                  添加中...
                </span>
              ) : (
                '添加宠物'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};