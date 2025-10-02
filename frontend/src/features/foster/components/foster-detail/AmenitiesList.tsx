/**
 * 设施与服务列表组件
 * 用于展示寄养服务提供的各种设施和服务
 */
import type { FosterService } from '../../types';

interface AmenitiesListProps {
  service: FosterService;
}

export const AmenitiesList = ({ service }: AmenitiesListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">提供的设施与服务</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {service.amenities.map((amenity, index) => (
          <div key={index} className="flex items-center text-gray-700">
            <i className="fa-solid fa-check text-green-500 mr-2"></i>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};