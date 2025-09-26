import type { FosterService } from '../../types';

interface ServiceDescriptionProps {
  service: FosterService;
}

export const ServiceDescription = ({ service }: ServiceDescriptionProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
      <p className="text-gray-500 mb-4">{service.location}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {service.petTypes.map((type) => (
          <span
            key={type}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
          >
            {type === 'dog' && <i className="fa-solid fa-dog mr-1.5"></i>}
            {type === 'cat' && <i className="fa-solid fa-cat mr-1.5"></i>}
            {type === 'other' && <i className="fa-solid fa-paw mr-1.5"></i>}
            {type === 'dog' ? '狗狗' : type === 'cat' ? '猫咪' : '其他宠物'}
          </span>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">服务介绍</h2>
        <div className="prose prose-sm text-gray-600 max-w-none">
          {service.description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};