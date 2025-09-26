import React from 'react';
import { motion } from 'framer-motion';
import { Veterinarian } from '../types';

interface VetSelectorProps {
  veterinarians: Veterinarian[];
  selectedVet: Veterinarian | null;
  onSelectVet: (vet: Veterinarian) => void;
}

const VetSelector: React.FC<VetSelectorProps> = ({ 
  veterinarians, 
  selectedVet, 
  onSelectVet 
}) => {
  if (veterinarians.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">暂无可用的兽医，请稍后再试</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {veterinarians.map((vet) => (
        <motion.div
          key={vet.id}
          onClick={() => onSelectVet(vet)}
          className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
            selectedVet?.id === vet.id 
              ? 'border-orange-500 shadow-lg' 
              : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
          }`}
          whileHover={{ y: -5 }}
        >
          <div className="p-4 flex">
            <img
              src={vet.avatar}
              alt={vet.name}
              className="w-20 h-20 rounded-lg object-cover mr-4 flex-shrink-0"
            />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-900">{vet.name}</h3>
                {vet.available ? (
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    可预约
                  </span>
                ) : (
                  <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    暂不可约
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{vet.specialty} · {vet.experience}</p>
               
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa-solid fa-star ${
                        i < Math.floor(vet.rating)
                          ? 'text-yellow-400'
                          : i < vet.rating
                          ? 'text-yellow-400 opacity-50'
                          : 'text-gray-300'
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {vet.rating.toFixed(1)} ({vet.reviews})
                </span>
              </div>
               
              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900">¥{vet.price}</span>
                <span className="text-sm text-gray-500">/次问诊</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VetSelector;