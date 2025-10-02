/**
 * 服务提供者信息展示组件
 * 显示寄养服务提供者的相关信息
 */
import {useNavigate} from 'react-router-dom';
import type {FosterService} from '../../types';

interface ProviderInfoProps {
    service: FosterService;
}

export const ProviderInfo = ({service}: ProviderInfoProps) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center">
                <img
                    src={service.providerAvatar}
                    alt={service.providerName}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.providerName}</h3>
                    <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fa-solid fa-star ${i < Math.floor(service.rating) ? 'text-yellow-400' : i < service.rating ? 'text-yellow-400 opacity-50' : 'text-gray-300'}`}
                                ></i>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
              {service.rating.toFixed(1)} ({service.reviewsCount}条评价)
            </span>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/messages')}
                    className="ml-auto px-4 py-2 border border-orange-500 text-orange-500 bg-white rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
                >
                    <i className="fa-solid fa-comment mr-1"></i> 联系提供者
                </button>
            </div>
        </div>
    );
};