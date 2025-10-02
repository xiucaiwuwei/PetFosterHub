import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  if (!onSearch) return null;

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="text"
        placeholder="搜索科目、症状..."
        className="py-2 pl-10 pr-4 w-64 rounded-xl bg-white border border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all duration-300 shadow-sm"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-orange-500" />
    </motion.div>
  );
};

export default SearchBar;