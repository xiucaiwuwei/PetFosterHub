/**
 * 用于管理宠物数据的自定义hook
 */
import { useState, useEffect, useCallback } from 'react';
import { Pet } from '@/types';
import { getPetsByOwnerId } from '@/mocks/pets';
import { toast } from 'sonner';

interface UsePetsReturn {
  pets: Pet[];
  isLoading: boolean;
  isAddingPet: boolean;
  showAddPetModal: boolean;
  setShowAddPetModal: (show: boolean) => void;
  addPet: (petData: Omit<Pet, 'id' | 'ownerId' | 'imageUrls'>, imageFile: File | null, userId: string) => Promise<void>;
  refreshPets: (userId: string) => Promise<void>;
}

/**
 * 用于管理宠物数据的自定义hook
 */
export const usePets = (userId: string | null = null): UsePetsReturn => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  /**
   * 获取用户的宠物列表
   */
  const fetchPets = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    try {
      // 实际项目中这里应该调用API
      const userPets = getPetsByOwnerId(id);
      setPets(userPets);
    } catch (error) {
      console.error('获取宠物列表失败:', error);
      toast.error('获取宠物列表失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 刷新宠物列表
   */
  const refreshPets = useCallback(async (id: string) => {
    await fetchPets(id);
  }, [fetchPets]);

  /**
   * 添加新宠物
   */
  const addPet = useCallback(async (
    petData: Omit<Pet, 'id' | 'ownerId' | 'imageUrls'>,
    imageFile: File | null,
    userId: string
  ): Promise<void> => {
    // 简单表单验证
    if (!petData.name || !petData.breed || petData.age === 0) {
      toast.error('请填写必填字段');
      throw new Error('请填写必填字段');
    }

    setIsAddingPet(true);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 创建新宠物对象
      const imagePreview = imageFile ? URL.createObjectURL(imageFile) : '';
      
      const newPet: Pet = {
        ...petData,
        id: `p${pets.length + 1}`,
        ownerId: userId,
        imageUrls: imagePreview ? [imagePreview] : ['https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%8A%A8%E7%89%A9%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8A%A8%E7%89%A9%E7%85%A7%E7%89%87&sign=4916b0c9017e427c2555127ae824f4ee']
      };
      
      // 添加到宠物列表
      setPets(prevPets => [...prevPets, newPet]);
      toast.success(`${newPet.name} 添加成功！`);
    } catch (error) {
      console.error('添加宠物失败:', error);
      toast.error('添加宠物失败，请重试');
      throw error;
    } finally {
      setIsAddingPet(false);
    }
  }, [pets.length]);

  // 当用户ID变化时，重新获取宠物列表
  useEffect(() => {
    if (userId) {
      fetchPets(userId);
    }
  }, [userId, fetchPets]);

  return {
    pets,
    isLoading,
    isAddingPet,
    showAddPetModal,
    setShowAddPetModal,
    addPet,
    refreshPets
  };
};