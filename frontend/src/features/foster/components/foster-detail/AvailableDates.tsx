/**
 * 可用日期展示组件
 * 用于显示寄养服务的可预订日期范围
 */
import type {FosterService} from '@/types';
import {formatDate} from '@/features/foster/utils/formatUtils';

interface AvailableDatesProps {
    service: FosterService;
}

export const AvailableDates = ({service}: AvailableDatesProps) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">可用日期</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">可预订从</p>
                        <p className="text-gray-900 font-medium">{formatDate(service.availableFrom)}</p>
                    </div>
                    <div className="hidden md:block text-gray-400">
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    <div className="md:text-right">
                        <p className="text-sm text-gray-500 mb-1">至</p>
                        <p className="text-gray-900 font-medium">{formatDate(service.availableTo)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};