import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

interface FilterButtonProps {
  onToggleFilters?: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onToggleFilters }) => {
  if (!onToggleFilters) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggleFilters}
      className="ml-3 bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 rounded-full p-2.5 transition-all duration-300 shadow-sm hover:shadow"
      aria-label="筛选"
    >
      <Filter className="w-5 h-5" />
    </motion.button>
  );
};

export default FilterButton;