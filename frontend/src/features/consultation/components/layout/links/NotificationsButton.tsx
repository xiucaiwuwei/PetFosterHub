import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

interface NotificationsButtonProps {
  notificationsCount?: number;
}

const NotificationsButton: React.FC<NotificationsButtonProps> = ({ notificationsCount = 0 }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="ml-3 bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 rounded-full p-2.5 transition-all duration-300 shadow-sm hover:shadow relative flex items-center justify-center"
      aria-label="通知"
    >
      <Bell className="w-5 h-5" />
      {notificationsCount > 0 && (
        <motion.span 
          className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {notificationsCount}
        </motion.span>
      )}
    </motion.button>
  );
};

export default NotificationsButton;