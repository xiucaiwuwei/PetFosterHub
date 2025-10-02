/**
 * 寄养主页UI相关逻辑
 * 封装寄养主页的状态管理和UI事件处理逻辑
 */
import { useState, useEffect, useCallback } from 'react';

export interface PetTypeOption {
  value: string;
  label: string;
}

export interface ServiceTypeOption {
  value: string;
  label: string;
}

export interface PriceRange {
  min: number | null;
  max: number | null;
}

interface UseFosterHomeUIOptions {
  onParamsChange: (params: Record<string, any>) => void;
  onFiltersChange: (filters: { petType: string; serviceType: string }) => void;
}

export const useFosterHomeUI = ({ onParamsChange, onFiltersChange }: UseFosterHomeUIOptions) => {
  // 二级导航状态
  const [selectedNavItem, setSelectedNavItem] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  
  // 筛选条件状态
  const [selectedPetType, setSelectedPetType] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [priceRanges, setPriceRanges] = useState<PriceRange>({ min: null, max: null });
  
  // 宠物类型选项
  const petTypes: PetTypeOption[] = [
    { value: '', label: '全部宠物类型' },
    { value: 'dog', label: '狗狗' },
    { value: 'cat', label: '猫咪' },
    { value: 'other', label: '其他宠物' }
  ];
  
  // 服务类型选项
  const serviceTypes: ServiceTypeOption[] = [
    { value: '', label: '全部服务类型' },
    { value: 'home', label: '家庭寄养' },
    { value: 'professional', label: '专业寄养所' },
    { value: 'boarding', label: '宠物旅馆' }
  ];

  // 处理导航项切换
  const handleNavItemChange = useCallback((id: string) => {
    setSelectedNavItem(id);
    onParamsChange({ pageNum: 1 }); // 切换导航项时重置到第一页
    
    // 根据导航项ID设置相应的筛选条件
    switch (id) {
      case 'popular':
        onParamsChange({ sortBy: 'popularity', pageNum: 1 });
        break;
      case 'new':
        onParamsChange({ sortBy: 'newest', pageNum: 1 });
        break;
      case 'discount':
        // 添加优惠折扣的筛选逻辑
        onParamsChange({ keyword: 'discount', pageNum: 1 });
        break;
      case 'nearby':
        // 添加附近寄养的筛选逻辑（假设使用当前位置）
        onParamsChange({ keyword: 'nearby', pageNum: 1 });
        break;
      case 'pet-friendly':
        // 添加宠物友好的筛选逻辑
        onParamsChange({ keyword: 'pet-friendly', pageNum: 1 });
        break;
      case 'professional':
        // 添加专业寄养的筛选逻辑
        onParamsChange({ keyword: 'professional', pageNum: 1 });
        break;
      case 'home-style':
        // 添加家庭式寄养的筛选逻辑
        onParamsChange({ keyword: 'home-style', pageNum: 1 });
        break;
      default:
        // 重置筛选条件
        onParamsChange({
          sortBy: undefined, 
          pageNum: 1 
        });
        break;
    }
  }, [onParamsChange]);

  // 切换筛选面板
  const toggleFilters = useCallback(() => {
    setIsFilterOpen(!isFilterOpen);
  }, [isFilterOpen]);
  
  // 处理宠物类型变化
  const handlePetTypeChange = useCallback((value: string) => {
    setSelectedPetType(value);
  }, []);
  
  // 处理服务类型变化
  const handleServiceTypeChange = useCallback((value: string) => {
    setSelectedServiceType(value);
  }, []);
  
  // 处理价格范围变化
  const handlePriceRangeChange = useCallback((range: PriceRange) => {
    setPriceRanges(range);
  }, []);
  
  // 应用筛选条件
  const handleApplyFilters = useCallback(() => {
    const filters = { petType: selectedPetType, serviceType: selectedServiceType };
    onFiltersChange(filters);
    
    // 应用价格范围筛选
    if (priceRanges.min !== null || priceRanges.max !== null) {
      onParamsChange({ priceMin: priceRanges.min, priceMax: priceRanges.max });
    }
    
    setIsFilterOpen(false);
  }, [selectedPetType, selectedServiceType, priceRanges, onFiltersChange, onParamsChange]);
  
  // 重置筛选条件
  const handleResetFilters = useCallback(() => {
    setSelectedPetType('');
    setSelectedServiceType('');
    setPriceRanges({ min: null, max: null });
  }, []);
  
  // 添加内容区域滚动监听，实现滚动时自动折叠侧边栏
  useEffect(() => {
    const contentElement = document.querySelector('.foster-container .flex-1');
    if (contentElement) {
      const handleScroll = () => {
        if (isFilterOpen) {
          setIsFilterOpen(false);
        }
      };

      contentElement.addEventListener('scroll', handleScroll);
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isFilterOpen]);

  return {
    selectedNavItem,
    isFilterOpen,
    selectedPetType,
    selectedServiceType,
    priceRanges,
    petTypes,
    serviceTypes,
    handleNavItemChange,
    toggleFilters,
    handlePetTypeChange,
    handleServiceTypeChange,
    handlePriceRangeChange,
    handleApplyFilters,
    handleResetFilters
  };
};

export default useFosterHomeUI;