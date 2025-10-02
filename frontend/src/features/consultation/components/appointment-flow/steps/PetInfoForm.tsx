import React from 'react';
import { motion } from 'framer-motion';
import { Dog, Cat, Rabbit, Info, AlertCircle } from 'lucide-react';

interface PetInfoFormProps {
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  petAge: string;
  symptoms: string;
  errors: Record<string, string>;
  onPetNameChange: (value: string) => void;
  onPetTypeChange: (value: 'dog' | 'cat' | 'other') => void;
  onPetAgeChange: (value: string) => void;
  onSymptomsChange: (value: string) => void;
}

const PetInfoForm: React.FC<PetInfoFormProps> = ({
  petName,
  petType,
  petAge,
  symptoms,
  errors,
  onPetNameChange,
  onPetTypeChange,
  onPetAgeChange,
  onSymptomsChange
}) => {
  return (
    <motion.div 
      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center text-sm font-medium text-gray-500 mb-6">
        <Info className="w-4 h-4 mr-2 text-orange-400" />
        宠物信息
      </div>
      
      <div className="space-y-5">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            宠物名称
          </label>
          <div className="relative">
            <input
              type="text"
              value={petName}
              onChange={(e) => onPetNameChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-sm ${errors.petName ? 'border-red-300 text-red-900 bg-red-50' : 'border-gray-100 hover:border-orange-200'}`}
              placeholder="请输入宠物名称"
            />
            {petName && !errors.petName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
          {errors.petName && (
            <motion.div 
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {errors.petName}
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            宠物类型
          </label>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              type="button"
              className={`py-3 px-3 border rounded-xl text-sm font-medium transition-all duration-300 shadow-sm flex flex-col items-center justify-center ${petType === 'dog' 
                ? 'border-orange-500 bg-gradient-to-br from-orange-400 to-orange-500 text-white' 
                : 'border-gray-100 hover:border-orange-300 hover:bg-orange-50'}`}
              onClick={() => onPetTypeChange('dog')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Dog className={`w-6 h-6 mb-1.5 ${petType === 'dog' ? 'text-white' : 'text-gray-400'}`} />
              狗狗
            </motion.button>
            <motion.button
              type="button"
              className={`py-3 px-3 border rounded-xl text-sm font-medium transition-all duration-300 shadow-sm flex flex-col items-center justify-center ${petType === 'cat' 
                ? 'border-orange-500 bg-gradient-to-br from-orange-400 to-orange-500 text-white' 
                : 'border-gray-100 hover:border-orange-300 hover:bg-orange-50'}`}
              onClick={() => onPetTypeChange('cat')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Cat className={`w-6 h-6 mb-1.5 ${petType === 'cat' ? 'text-white' : 'text-gray-400'}`} />
              猫咪
            </motion.button>
            <motion.button
              type="button"
              className={`py-3 px-3 border rounded-xl text-sm font-medium transition-all duration-300 shadow-sm flex flex-col items-center justify-center ${petType === 'other' 
                ? 'border-orange-500 bg-gradient-to-br from-orange-400 to-orange-500 text-white' 
                : 'border-gray-100 hover:border-orange-300 hover:bg-orange-50'}`}
              onClick={() => onPetTypeChange('other')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Rabbit className={`w-6 h-6 mb-1.5 ${petType === 'other' ? 'text-white' : 'text-gray-400'}`} />
              其他
            </motion.button>
          </div>
          {errors.petType && (
            <motion.div 
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {errors.petType}
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            宠物年龄 (岁)
          </label>
          <div className="relative">
            <input
              type="text"
              value={petAge}
              onChange={(e) => onPetAgeChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-sm ${errors.petAge ? 'border-red-300 text-red-900 bg-red-50' : 'border-gray-100 hover:border-orange-200'}`}
              placeholder="请输入宠物年龄"
            />
            {petAge && !errors.petAge && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
          {errors.petAge && (
            <motion.div 
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {errors.petAge}
            </motion.div>
          )}
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <label className="block text-sm font-medium text-gray-700">
            症状描述
          </label>
          <div className="relative">
            <textarea
              value={symptoms}
              onChange={(e) => onSymptomsChange(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-sm ${errors.symptoms ? 'border-red-300 text-red-900 bg-red-50' : 'border-gray-100 hover:border-orange-200'}`}
              placeholder="请简要描述宠物的症状或需要咨询的问题..."
            ></textarea>
            {symptoms && !errors.symptoms && (
              <div className="absolute right-3 bottom-3 text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
          {errors.symptoms && (
            <motion.div 
              className="flex items-center mt-1 text-sm text-red-600"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {errors.symptoms}
            </motion.div>
          )}
          
          <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg mt-2">
            <div className="flex items-start">
              <Info className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-orange-400 flex-shrink-0" />
              <p>详细的症状描述有助于兽医更准确地了解宠物情况，提高诊断效率</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PetInfoForm;