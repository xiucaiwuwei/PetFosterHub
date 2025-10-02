import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const MobileSearchButton: React.FC = () => {
  return (
    <motion.button
      className="md:hidden p-2.5 rounded-full border border-orange-200 text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-300"
      onClick={() => console.log('Search toggle')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="搜索"
    >
      <Search className="w-5 h-5" />
    </motion.button>
  );
};

export default MobileSearchButton;