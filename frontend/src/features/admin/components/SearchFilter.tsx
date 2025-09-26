import React from 'react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  filterOptions?: Array<{
    label: string;
    value: string;
  }>;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  placeholder?: string;
  filterLabel?: string;
  showAdvanced?: boolean;
  onAdvancedToggle?: () => void;
}

/**
 * 搜索和筛选组件
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  filterOptions,
  selectedFilter,
  onFilterChange,
  placeholder = '搜索...',
  filterLabel = '筛选:',
  showAdvanced = false,
  onAdvancedToggle
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="fa-solid fa-search"></i>
          </span>
          <button
            onClick={onSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="搜索"
          >
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {filterOptions && (
          <div className="flex items-center gap-4">
            {filterLabel && (
              <span className="text-sm text-gray-600 hidden sm:inline">{filterLabel}</span>
            )}
            <select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {onAdvancedToggle && (
          <button
            onClick={onAdvancedToggle}
            className="flex items-center text-sm text-gray-600 hover:text-orange-500 transition-colors"
          >
            <i className={`fa-solid mr-1 ${
              showAdvanced ? 'fa-chevron-down' : 'fa-chevron-right'
            }`}></i>
            高级筛选
          </button>
        )}
      </div>

      {showAdvanced && onAdvancedToggle && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in-down">
          {/* 高级筛选表单内容会根据具体需求实现 */}
          <div className="text-sm text-gray-500">
            高级筛选功能即将上线...
          </div>
        </div>
      )}
    </div>
  );
};