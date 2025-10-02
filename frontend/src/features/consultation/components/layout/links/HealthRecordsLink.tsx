import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const HealthRecordsLink: React.FC = () => {
  return (
    <motion.a
      href="/profile/health-records"
      className="ml-3 px-3 py-2.5 rounded-lg text-sm font-medium text-orange-600 border border-orange-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all duration-300 flex items-center"
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <Heart className="w-4 h-4 mr-1.5" />
      健康档案
    </motion.a>
  );
};

export default HealthRecordsLink;