import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onPetTypeFilter: (type: string) => void;
  initialSearchTerm?: string;
  initialPetType?: string;
}

export function SearchBar({ onSearch, onPetTypeFilter, initialSearchTerm = '', initialPetType = '' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [petType, setPetType] = useState(initialPetType);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handlePetTypeChange = (type: string) => {
    setPetType(type);
    onPetTypeFilter(type);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索寄养服务、位置或关键词..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handlePetTypeChange('')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              petType === ''
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            全部
          </button>
          <button
            type="button"
            onClick={() => handlePetTypeChange('dog')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
              petType === 'dog'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            <i className="fa-solid fa-dog mr-2"></i>狗狗
          </button>
          <button
            type="button"
            onClick={() => handlePetTypeChange('cat')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
              petType === 'cat'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            <i className="fa-solid fa-cat mr-2"></i>猫咪
          </button>
          <button
            type="button"
            onClick={() => handlePetTypeChange('other')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center",
              petType === 'other'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            )}
          >
            <i className="fa-solid fa-paw mr-2"></i>其他
          </button>
        </div>
        
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 whitespace-nowrap"
        >
          <i className="fa-solid fa-search mr-2"></i>搜索
        </button>
      </form>
    </div>
  );
}