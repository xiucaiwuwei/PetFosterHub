import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { users } from '@/mocks/users.ts';
import { User } from '@/types';
import { cn } from '@/lib/utils/utils';

// 格式化日期显示
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function Users() {
  // 状态管理
  const [usersList, setUsersList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取用户数据
  useEffect(() => {
    // 模拟API加载延迟
    const timer = setTimeout(() => {
      setUsersList(users);
      setFilteredUsers(users);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // 搜索和筛选用户
  useEffect(() => {
    let result = [...usersList];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.phone && user.phone.includes(term))
      );
    }
    
    // 角色筛选
    if (selectedRole !== 'all') {
      result = result.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, selectedRole, usersList]);

  // 分页逻辑
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 处理用户详情查看
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  // 处理用户编辑
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedUser({...user});
    setIsEditModalOpen(true);
  };

  // 处理用户删除
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // 确认删除用户
  const confirmDeleteUser = () => {
    if (!selectedUser) return;
    
    // 模拟删除API调用
    setIsLoading(true);
    setTimeout(() => {
      setUsersList(prev => prev.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      toast.success(`用户 ${selectedUser.name} 已删除`);
    }, 600);
  };

  // 保存用户编辑
  const saveUserEdit = () => {
    if (!editedUser) return;
    
    // 模拟保存API调用
    setIsLoading(true);
    setTimeout(() => {
      setUsersList(prev => 
        prev.map(user => user.id === editedUser.id ? editedUser : user)
      );
      setIsEditModalOpen(false);
      setIsLoading(false);
      toast.success(`用户 ${editedUser.name} 已更新`);
    }, 600);
  };

  // 处理编辑字段变化
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedUser) return;
    
    const { name, value } = e.target;
    setEditedUser(prev => prev ? {...prev, [name]: value} : null);
  };

  // 渲染分页控件
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            // 只显示当前页附近的页码
            if (
              i === 0 || 
              i === totalPages - 1 || 
              Math.abs(i + 1 - currentPage) <= 1
            ) {
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === i + 1
                      ? 'z-10 bg-orange-500 border-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              );
            } else if (
              (i === 1 && currentPage > 3) || 
              (i === totalPages - 2 && currentPage < totalPages - 2)
            ) {
              return (
                <span key={i} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              );
            }
            return null;
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    );
  };

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载用户数据中...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有用户账户</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">所有角色</option>
            <option value="owner">宠物主人</option>
            <option value="foster">寄养人士</option>
          </select>
        </div>
      </div>
      
      {/* 用户列表卡片 */}
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
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'owner' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'owner' ? '宠物主人' : '寄养人士'}
                      </span>
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
                        onClick={() => handleViewUser(user)}
                        className="text-blue-500 hover:text-blue-600 mr-3"
                      >
                        查看
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-orange-500 hover:text-orange-600 mr-3"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user)}
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
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedRole('all');
                        }}
                        className="mt-2 text-orange-500 hover:text-orange-600 text-sm"
                      >
                        清除筛选条件
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        {renderPagination()}
      </div>
    </div>
  );
}