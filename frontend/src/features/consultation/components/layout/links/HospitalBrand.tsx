import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

const HospitalBrand: React.FC = () => {
  return (
    <div className="hidden md:flex items-center ml-4 border-l border-orange-200 pl-4">
      <motion.div 
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <HeartPulse className="w-5 h-5 text-orange-500" />
        <span className="text-orange-600 font-semibold text-sm">宠物健康中心</span>
      </motion.div>
    </div>
  );
};

export default HospitalBrand;