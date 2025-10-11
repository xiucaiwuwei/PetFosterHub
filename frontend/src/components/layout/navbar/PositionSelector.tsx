interface PositionSelectorProps {
  selectedProvince: { name: string };
  selectedCity: { name: string };
  openPositionModal: () => void;
}

export function PositionSelector({ selectedProvince, selectedCity, openPositionModal }: PositionSelectorProps) {
  return (
    <div
      className="flex items-center cursor-pointer hover:text-orange-500 transition-all duration-300 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-300 transform hover:scale-105 relative group"
      onClick={openPositionModal}
    >
      <i className="fa-solid fa-location-dot text-orange-500 mr-2 animate-pulse"></i>
      <span className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors duration-300">{selectedCity.name === '市辖区' ? selectedProvince.name : selectedCity.name}</span>
      <i className="fa-solid fa-chevron-down ml-2 text-xs text-gray-500 transition-transform duration-300 group-hover:rotate-180 group-hover:text-orange-500"></i>
      {/* 添加轻微的背景渐变效果 */}
      <span className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </div>
  );
}