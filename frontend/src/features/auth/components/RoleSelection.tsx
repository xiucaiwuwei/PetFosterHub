import React from 'react';
import {motion} from 'framer-motion';
import { UserRole } from '@/types';

interface RoleSelectionProps {
    role: UserRole;
    onRoleChange: (role: UserRole) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({role, onRoleChange}) => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-6">
                <motion.button
                    type="button"
                    onClick={() => onRoleChange(UserRole.OWNER)}
                    className={`py-4 px-6 rounded-xl text-base font-medium transition-all duration-300 ${role === UserRole.OWNER
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                    whileHover={{scale: 1.03}}
                    whileTap={{scale: 0.98}}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <i className="fa-solid fa-paw text-xl"></i>
                        <span>宠物主人</span>
                    </div>
                </motion.button>
                <motion.button
                    type="button"
                    onClick={() => onRoleChange(UserRole.PROVIDER)}
                    className={`py-4 px-6 rounded-xl text-base font-medium transition-all duration-300 ${role === UserRole.PROVIDER
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                    whileHover={{scale: 1.03}}
                    whileTap={{scale: 0.98}}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <i className="fa-solid fa-home text-xl"></i>
                        <span>寄养人士</span>
                    </div>
                </motion.button>
                <motion.button
                    type="button"
                    onClick={() => onRoleChange(UserRole.BUSINESS)}
                    className={`py-4 px-6 rounded-xl text-base font-medium transition-all duration-300 ${role === UserRole.BUSINESS
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                    whileHover={{scale: 1.03}}
                    whileTap={{scale: 0.98}}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <i className="fa-solid fa-store text-xl"></i>
                        <span>商城店家</span>
                    </div>
                </motion.button>
                <motion.button
                    type="button"
                    onClick={() => onRoleChange(UserRole.VETERINARIAN)}
                    className={`py-4 px-6 rounded-xl text-base font-medium transition-all duration-300 ${role === UserRole.VETERINARIAN
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                    whileHover={{scale: 1.03}}
                    whileTap={{scale: 0.98}}
                >
                    <div className="flex items-center justify-center space-x-3">
                        <i className="fa-solid fa-stethoscope text-xl"></i>
                        <span>宠物医生</span>
                    </div>
                </motion.button>
            </div>
        </div>
    );
};

export default RoleSelection;