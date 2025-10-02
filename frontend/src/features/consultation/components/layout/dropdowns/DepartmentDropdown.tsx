import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, ChevronDown } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

interface DepartmentDropdownProps {
  selectedNavItem: string;
  onNavItemChange: (id: string) => void;
  primaryNavItems: NavItem[];
  departmentMenuOpen: boolean;
  setDepartmentMenuOpen: (open: boolean) => void;
}

const DepartmentDropdown: React.FC<DepartmentDropdownProps> = ({
  selectedNavItem,
  onNavItemChange,
  primaryNavItems,
  departmentMenuOpen,
  setDepartmentMenuOpen
}) => {
  // 获取科室显示标签
  const getDepartmentLabel = (value: string) => {
    const department = primaryNavItems.find(item => item.id === value);
    return department ? department.label : '全部科目';
  };

  return (
    <div className="mr-3 relative" onClick={(e) => e.stopPropagation()}>
      <motion.button
        className="w-full flex items-center justify-between bg-white text-orange-600 border border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium shadow-sm hover:border-orange-300 transition-all duration-300"
        onClick={() => setDepartmentMenuOpen(!departmentMenuOpen)}
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <Stethoscope className="w-4 h-4 text-orange-500 mr-2" />
          <span>{getDepartmentLabel(selectedNavItem)}</span>
        </div>
        <motion.div
          animate={{ rotate: departmentMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-orange-500" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {departmentMenuOpen && (
          <motion.div
            className="absolute left-0 top-full mt-1 w-48 bg-white border border-orange-200 rounded-xl shadow-lg z-30 overflow-hidden"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {primaryNavItems.map((item) => (
              <motion.button
                key={item.id}
                className={`w-full text-left px-4 py-3 flex items-center hover:bg-orange-50 transition-colors duration-200 ${selectedNavItem === item.id ? 'text-orange-600 bg-orange-50' : 'text-gray-700'}`}
                onClick={() => {
                  onNavItemChange(item.id);
                  setDepartmentMenuOpen(false);
                }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Stethoscope className={`w-4 h-4 mr-2 ${selectedNavItem === item.id ? 'text-orange-500' : 'text-gray-400'}`} />
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentDropdown;