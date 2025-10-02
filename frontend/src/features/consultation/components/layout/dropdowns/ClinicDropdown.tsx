import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';

interface ClinicOption {
  value: string;
  label: string;
}

interface ClinicDropdownProps {
  selectedClinic: string;
  onClinicChange: (value: string) => void;
  clinicMenuOpen: boolean;
  setClinicMenuOpen: (open: boolean) => void;
}

const ClinicDropdown: React.FC<ClinicDropdownProps> = ({
  selectedClinic,
  onClinicChange,
  clinicMenuOpen,
  setClinicMenuOpen
}) => {
  // 诊所选项数据
  const clinicOptions: ClinicOption[] = [
    { value: 'all', label: '所有诊所' },
    { value: 'central', label: '中心宠物医院' },
    { value: 'east', label: '东区宠物诊所' },
    { value: 'west', label: '西区宠物医院' },
    { value: 'south', label: '南区宠物诊所' }
  ];
  
  // 获取诊所显示标签
  const getClinicLabel = (value: string) => {
    const clinic = clinicOptions.find(option => option.value === value);
    return clinic ? clinic.label : '所有诊所';
  };

  return (
    <div className="mr-3 relative" onClick={(e) => e.stopPropagation()}>
      <motion.button
        className="w-full flex items-center justify-between bg-white text-orange-600 border border-orange-200 rounded-xl px-3 py-2.5 text-sm font-medium shadow-sm hover:border-orange-300 transition-all duration-300"
        onClick={() => setClinicMenuOpen(!clinicMenuOpen)}
        whileHover={{ y: -1, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-orange-500 mr-2" />
          <span>{getClinicLabel(selectedClinic)}</span>
        </div>
        <motion.div
          animate={{ rotate: clinicMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-orange-500" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {clinicMenuOpen && (
          <motion.div
            className="absolute left-0 top-full mt-1 w-48 bg-white border border-orange-200 rounded-xl shadow-lg z-30 overflow-hidden"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {clinicOptions.map((clinic) => (
              <motion.button
                key={clinic.value}
                className={`w-full text-left px-4 py-3 flex items-center hover:bg-orange-50 transition-colors duration-200 ${selectedClinic === clinic.value ? 'text-orange-600 bg-orange-50' : 'text-gray-700'}`}
                onClick={() => {
                  onClinicChange(clinic.value);
                  setClinicMenuOpen(false);
                }}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className={`w-4 h-4 mr-2 ${selectedClinic === clinic.value ? 'text-orange-500' : 'text-gray-400'}`} />
                {clinic.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClinicDropdown;