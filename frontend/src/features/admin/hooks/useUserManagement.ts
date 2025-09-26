/**
 * 用户管理自定义Hook
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { 
  fetchUsers, 
  updateUser, 
  deleteUser, 
  setSelectedUser 
} from '../slice/adminSlice';
import { GetUsersDto, UpdateUserDto } from '../types/dto';
import adminService from '../services/adminService';

/**
 * 用户管理Hook
 */
export const useUserManagement = () => {
  const dispatch = useDispatch();
  const { users, selectedUser, loading } = useSelector((state: RootState) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [editErrors, setEditErrors] = useState<string[]>([]);

  // 获取用户列表
  const loadUsers = (params?: Partial<GetUsersDto>) => {
    const queryParams: GetUsersDto = {
      searchTerm: params?.searchTerm || searchTerm,
      role: params?.role || selectedRole,
      page: params?.page || currentPage,
      pageSize: params?.pageSize || usersPerPage
    };
    dispatch(fetchUsers(queryParams));
  };

  // 初始化加载
  useEffect(() => {
    loadUsers();
  }, []);

  // 搜索和筛选变化时重新加载
  useEffect(() => {
    setCurrentPage(1); // 重置到第一页
    loadUsers({
      searchTerm,
      role: selectedRole,
      page: 1
    });
  }, [searchTerm, selectedRole]);

  // 分页变化时重新加载
  useEffect(() => {
    loadUsers({
      page: currentPage
    });
  }, [currentPage]);

  // 处理查看用户详情
  const handleViewUser = (user: any) => {
    dispatch(setSelectedUser(user));
    setIsDetailModalOpen(true);
  };

  // 处理编辑用户
  const handleEditUser = (user: any) => {
    dispatch(setSelectedUser(user));
    setEditedUser({ ...user });
    setEditErrors([]);
    setIsEditModalOpen(true);
  };

  // 处理删除用户
  const handleDeleteUser = (user: any) => {
    dispatch(setSelectedUser(user));
    setIsDeleteModalOpen(true);
  };

  // 确认删除用户
  const confirmDeleteUser = () => {
    if (!selectedUser) return;
    
    dispatch(deleteUser(selectedUser.id))
      .unwrap()
      .then(() => {
        setIsDeleteModalOpen(false);
        // 可以在这里添加toast提示
      })
      .catch((error) => {
        console.error('删除用户失败:', error);
        // 可以在这里添加错误提示
      });
  };

  // 保存用户编辑
  const saveUserEdit = async () => {
    if (!editedUser) return;
    
    try {
      // 验证用户数据
      const result = await adminService.user.updateUser(editedUser);
      
      // 调用Redux action更新状态
      dispatch(updateUser(result));
      
      setIsEditModalOpen(false);
      setEditErrors([]);
      // 可以在这里添加toast提示
    } catch (error) {
      console.error('更新用户失败:', error);
      setEditErrors([error instanceof Error ? error.message : '更新用户失败']);
      // 可以在这里添加错误提示
    }
  };

  // 处理编辑字段变化
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedUser) return;
    
    const { name, value } = e.target;
    setEditedUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  // 清除筛选条件
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setCurrentPage(1);
  };

  return {
    users: users.data,
    totalUsers: users.total,
    selectedUser,
    isLoading: users.loading || loading,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    currentPage,
    setCurrentPage,
    usersPerPage,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    editedUser,
    editErrors,
    handleViewUser,
    handleEditUser,
    handleDeleteUser,
    confirmDeleteUser,
    saveUserEdit,
    handleEditChange,
    clearFilters,
    totalPages: Math.ceil(users.total / usersPerPage)
  };
};