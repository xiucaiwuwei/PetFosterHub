import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const ConsultationsLink: React.FC = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to="/profile/consultations"
        className="ml-3 bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 rounded-full p-2.5 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center"
        aria-label="咨询记录"
      >
        <Calendar className="w-5 h-5" />
      </Link>
    </motion.div>
  );
};

export default ConsultationsLink;