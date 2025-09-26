import { useState, useEffect } from 'react';
import { FosterService } from '@/types';
import { getFosterServices, searchFosterServices as searchFosters } from '@/mocks/fosters';

export function useFosters() {
  const [fosters, setFosters] = useState<FosterService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [petType, setPetType] = useState<string>('');
  const [providerType, setProviderType] = useState<string>('');
  const [filteredFosters, setFilteredFosters] = useState<FosterService[]>([]);

  // 获取所有寄养服务
  useEffect(() => {
    const fetchFosters = async () => {
      try {
        setLoading(true);
        // 在实际应用中，这里应该是API调用
        const data = getFosterServices();
        setFosters(data);
        setFilteredFosters(data);
      } catch (err) {
        setError('获取寄养服务失败，请稍后重试');
        console.error('Error fetching fosters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFosters();
  }, []);

  // 根据搜索条件筛选寄养服务
   useEffect(() => {
    const results = searchFosters(searchTerm, petType, providerType);
    setFilteredFosters(results);
  }, [searchTerm, petType]);

  // 搜索寄养服务
  const search = (term: string) => {
    setSearchTerm(term);
  };

  // 按宠物类型筛选
   const filterByPetType = (type: string) => {
    setPetType(type);
  };

  // 按提供者类型筛选
  const filterByProviderType = (type: string) => {
    setProviderType(type);
  };

  return {
    fosters,
    filteredFosters,
    loading,
    error,
    search,
    filterByPetType,
    searchTerm,
    petType,
    filterByProviderType
  };
}