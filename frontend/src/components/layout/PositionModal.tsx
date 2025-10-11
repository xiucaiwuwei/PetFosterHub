import { useState, useEffect } from 'react';

// 添加自定义动画样式
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.geo-select:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.geo-button {
  transition: all 0.3s ease;
}

.geo-button:hover {
  transform: translateY(-1px);
}

.geo-button:active {
  transform: translateY(0);
}`;

// 确保样式只被添加一次
if (!document.head.contains(style)) {
  document.head.appendChild(style);
}

interface Province {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
  provinceCode: string;
}

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (province: Province, city: City) => void;
  selectedProvince: Province;
  selectedCity: City;
}

/**
 * 位置选择模态框组件
 * 显示在屏幕中间，用于选择省份和城市
 */
export function PositionModal({
  isOpen,
  onClose,
  onSelect,
  selectedProvince,
  selectedCity
}: PositionModalProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [currentProvince, setCurrentProvince] = useState<Province>(selectedProvince);
  const [currentCity, setCurrentCity] = useState<City>(selectedCity);

  // 从JSON文件加载省份和城市数据
  useEffect(() => {
    const loadGeoData = async () => {
      if (isOpen) {
        try {
          // 加载省份数据
          const provincesResponse = await fetch('/geo-data/provinces.json');
          const provincesData = await provincesResponse.json();
          setProvinces(provincesData);

          // 加载城市数据
          const citiesResponse = await fetch('/geo-data/cities.json');
          const citiesData = await citiesResponse.json();
          setCities(citiesData);

          // 初始过滤显示当前选中省份的城市
          const currentCities = citiesData.filter((city: City) => city.provinceCode === currentProvince.code);
          setFilteredCities(currentCities);

        } catch (error) {
          console.error('加载地理数据失败:', error);
        }
      }
    };

    if (isOpen) {
      loadGeoData();
    }
  }, [isOpen, currentProvince.code]);

  // 当选择的省份改变时，过滤显示对应的城市
  useEffect(() => {
    if (currentProvince && cities.length > 0) {
      const provinceCities = cities.filter((city: City) => city.provinceCode === currentProvince.code);
      setFilteredCities(provinceCities);
      // 如果有城市，则默认选择第一个
      if (provinceCities.length > 0) {
        setCurrentCity(provinceCities[0]);
      }
    }
  }, [currentProvince, cities]);

  // 当组件打开时，重置当前选择为传入的已选值
  useEffect(() => {
    if (isOpen) {
      setCurrentProvince(selectedProvince);
      setCurrentCity(selectedCity);
    }
  }, [isOpen, selectedProvince, selectedCity]);

  // 处理确认选择
  const handleConfirm = () => {
    onSelect(currentProvince, currentCity);
    onClose();
  };

  // 处理点击背景关闭
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 阻止模态框内容点击事件冒泡
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div
        className="fixed inset-0 bg-black bg-opacity-30 z-30 flex justify-center items-start pt-20 p-4 backdrop-blur-sm animate-fadeIn"
        style={{ minHeight: '100vh', minWidth: '100vw', top: 0, left: 0 }}
        onClick={handleBackgroundClick}
      >
        <div
          className="bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden animate-[scaleUp_0.3s_ease-out] border border-gray-100 mx-auto"
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
          onClick={handleContentClick}
      >
        {/* 模态框头部 */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fa-solid fa-location-dot text-orange-500 mr-2"></i>
            选择城市
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            onClick={onClose}
            aria-label="关闭"
          >
            <i className="fa-solid fa-times text-lg"></i>
          </button>
        </div>

        {/* 模态框内容 */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 省份选择 */}
            <div className="space-y-2 animate-[slideIn_0.4s_ease-out_0.1s_both]">
              <label className="block text-sm font-medium text-gray-700">选择省份</label>
              <div className="relative">
                <select
                  className="geo-select block w-full pl-4 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-lg appearance-none bg-white transition-all duration-200 hover:border-gray-300"
                  value={currentProvince.code}
                  onChange={(e) => {
                    const province = provinces.find(p => p.code === e.target.value);
                    if (province) {
                      setCurrentProvince(province);
                    }
                  }}
                >
                  {provinces.map(province => (
                    <option key={province.code} value={province.code} className="py-2">
                      {province.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <i className="fa-solid fa-chevron-down text-xs transition-transform duration-200"></i>
                </div>
              </div>
            </div>

            {/* 城市选择 */}
            <div className="space-y-2 animate-[slideIn_0.4s_ease-out_0.2s_both]">
              <label className="block text-sm font-medium text-gray-700">选择城市</label>
              <div className="relative">
                <select
                  className="geo-select block w-full pl-4 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-lg appearance-none bg-white transition-all duration-200 hover:border-gray-300"
                  value={currentCity.code}
                  onChange={(e) => {
                    const city = filteredCities.find(c => c.code === e.target.value);
                    if (city) {
                      setCurrentCity(city);
                    }
                  }}
                >
                  {filteredCities.map(city => (
                    <option key={city.code} value={city.code} className="py-2">
                      {city.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <i className="fa-solid fa-chevron-down text-xs transition-transform duration-200"></i>
                </div>
              </div>
            </div>
          </div>

          {/* 当前选中的位置显示 */}
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 animate-[slideIn_0.4s_ease-out_0.3s_both]">
            <p className="text-sm text-gray-700 flex items-center">
              <i className="fa-solid fa-check-circle text-orange-500 mr-2"></i>
              <span className="font-medium">当前选择:</span> <span className="ml-1 font-semibold text-orange-600">{currentProvince.name} {currentCity.name}</span>
            </p>
          </div>
        </div>

        {/* 模态框底部 */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100 rounded-b-2xl">
          <button
            className="geo-button px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="geo-button px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500 border border-transparent rounded-lg hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md"
            onClick={handleConfirm}
          >
            确认选择
          </button>
        </div>
      </div>
    </div>
  );
}