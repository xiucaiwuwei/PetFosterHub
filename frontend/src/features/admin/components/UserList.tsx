import React from 'react';
import { formatDate } from '../utils/validationUtils';
import { StatusBadge } from './StatusBadge';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  avatar: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: Date;
}

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  searchTerm: string;
  selectedRole: string;
  clearFilters: () => void;
}

/**
 * 用户列表组件
 */
export const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  onViewUser,
  onEditUser,
  onDeleteUser,
  searchTerm,
  selectedRole,
  clearFilters
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载用户数据中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户信息
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                联系方式
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                评分
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={user.avatar} 
                          alt={user.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={user.role === 'owner' ? '宠物主人' : '寄养人士'} 
                      type={user.role === 'owner' ? 'primary' : 'success'} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone ? (
                      <div>
                        <p>{user.phone}</p>
                        {user.address && (
                          <p className="truncate max-w-xs mt-1">{user.address}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">未提供</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.rating ? (
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor(user.rating)
                                  ? 'text-yellow-400'
                                  : i < user.rating
                                  ? 'text-yellow-400 opacity-50'
                                  : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-700">
                          {user.rating.toFixed(1)} ({user.reviewsCount})
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">暂无评分</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onViewUser(user)}
                      className="text-blue-500 hover:text-blue-600 mr-3"
                    >
                      查看
                    </button>
                    <button 
                      onClick={() => onEditUser(user)}
                      className="text-orange-500 hover:text-orange-600 mr-3"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => onDeleteUser(user)}
                      className="text-red-500 hover:text-red-600"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <i className="fa-solid fa-search text-3xl mb-2 text-gray-300"></i>
                    <p>未找到匹配的用户</p>
                    {(searchTerm || selectedRole !== 'all') && (
                      <button 
                        onClick={clearFilters}
                        className="mt-2 text-orange-500 hover:text-orange-600 text-sm"
                      >
                        清除筛选条件
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};