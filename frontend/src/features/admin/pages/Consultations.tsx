import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/utils';

// 问诊类型定义
interface Consultation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  petName: string;
  petType: string;
  veterinarianId: string;
  veterinarianName: string;
  type: 'video' | 'text';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  time: string;
  duration: number;
  symptoms: string;
  diagnosis?: string;
  treatment?: string;
  cost: number;
}

// 格式化日期显示
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function Consultations() {
  // 状态管理
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [consultationsPerPage] = useState(10);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedConsultation, setEditedConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 生成模拟问诊数据
  useEffect(() => {
    // 模拟API加载延迟
    const timer = setTimeout(() => {
      const mockConsultations: Consultation[] = [
        {
          id: 'con-001',
          userId: 'u4',
          userName: '赵强',
          userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E8%BF%90%E5%8A%A8%E9%A3%8E%E6%A0%BC%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=66572c72fe2bc067c919e7742c2a81e6',
          petName: '豆豆',
          petType: '金毛寻回犬',
          veterinarianId: 'vet1',
          veterinarianName: '张医生',
          type: 'video',
          status: 'completed',
          date: '2023-06-15',
          time: '10:30',
          duration: 20,
          symptoms: '最近食欲下降，精神不振，偶尔呕吐',
          diagnosis: '消化不良',
          treatment: '调整饮食，服用消化酶',
          cost: 120
        },
        {
          id: 'con-002',
          userId: 'u2',
          userName: '李华',
          userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BC%80%E6%9C%97%E7%AC%91%E5%AE%B9%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=8dc301c48f3190d00930598ba3ff11f3',
          petName: '咪咪',
          petType: '英国短毛猫',
          veterinarianId: 'vet2',
          veterinarianName: '李医生',
          type: 'text',
          status: 'pending',
          date: '2023-06-16',
          time: '15:00',
          duration: 15,
          symptoms: '眼睛有分泌物，频繁抓挠耳朵',
          cost: 80
        },
        {
          id: 'con-003',
          userId: 'u3',
          userName: '王芳',
          userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E6%B8%A9%E6%9F%94%E6%B0%94%E8%B4%A8%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=a499604ce8edcd1a07b0b26633c885e7',
          petName: '小黑',
          petType: '拉布拉多',
          veterinarianId: 'vet1',
          veterinarianName: '张医生',
          type: 'video',
          status: 'in_progress',
          date: '2023-06-16',
          time: '11:00',
          duration: 25,
          symptoms: '皮肤瘙痒，有红色斑点',
          diagnosis: '过敏性皮炎',
          cost: 150
        },
        {
          id: 'con-004',
          userId: 'u1',
          userName: '张明',
          userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137',
          petName: '小白',
          petType: '萨摩耶',
          veterinarianId: 'vet3',
          veterinarianName: '王医生',
          type: 'video',
          status: 'cancelled',
          date: '2023-06-14',
          time: '09:30',
          duration: 0,
          symptoms: '走路姿势异常，不爱活动',
          cost: 0
        },
        {
          id: 'con-005',
          userId: 'u4',
          userName: '赵强',
          userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E8%BF%90%E5%8A%A8%E9%A3%8E%E6%A0%BC%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=66572c72fe2bc067c919e7742c2a81e6',
          petName: '豆豆',
          petType: '金毛寻回犬',
          veterinarianId: 'vet2',
          veterinarianName: '李医生',
          type: 'text',
          status: 'completed',
          date: '2023-06-10',
          time: '16:45',
          duration: 15,
          symptoms: '大便稀软，食欲不振',
          diagnosis: '肠胃感冒',
          treatment: '服用益生菌，清淡饮食',
          cost: 80
        }
      ];
      
      setConsultations(mockConsultations);
      setFilteredConsultations(mockConsultations);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // 搜索和筛选问诊
  useEffect(() => {
    let result = [...consultations];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(con => 
        con.id.toLowerCase().includes(term) ||
        con.userName.toLowerCase().includes(term) ||
        con.petName.toLowerCase().includes(term) ||
        con.veterinarianName.toLowerCase().includes(term) ||
        con.symptoms.toLowerCase().includes(term)
      );
    }
    
    // 状态筛选
    if (selectedStatus !== 'all') {
      result = result.filter(con => con.status === selectedStatus);
    }
    
    // 类型筛选
    if (selectedType !== 'all') {
      result = result.filter(con => con.type === selectedType);
    }
    
    setFilteredConsultations(result);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, selectedStatus, selectedType, consultations]);

  // 分页逻辑
  const indexOfLastConsultation = currentPage * consultationsPerPage;
  const indexOfFirstConsultation = indexOfLastConsultation - consultationsPerPage;
  const currentConsultations = filteredConsultations.slice(indexOfFirstConsultation, indexOfLastConsultation);
  const totalPages = Math.ceil(filteredConsultations.length / consultationsPerPage);

  // 处理问诊详情查看
  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDetailModalOpen(true);
  };

  // 处理问诊编辑
  const handleEditConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setEditedConsultation({...consultation});
    setIsEditModalOpen(true);
  };

  // 处理问诊删除
  const handleDeleteConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDeleteModalOpen(true);
  };

  // 确认删除问诊
  const confirmDeleteConsultation = () => {
    if (!selectedConsultation) return;
    
    // 模拟删除API调用
    setIsLoading(true);
    setTimeout(() => {
      setConsultations(prev => prev.filter(con => con.id !== selectedConsultation.id));
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      toast.success(`问诊记录 ${selectedConsultation.id} 已删除`);
    }, 600);
  };

  // 保存问诊编辑
  const saveConsultationEdit = () => {
    if (!editedConsultation) return;
    
    // 模拟保存API调用
    setIsLoading(true);
    setTimeout(() => {
      setConsultations(prev => 
        prev.map(con => con.id === editedConsultation.id ? editedConsultation : con)
      );
      setIsEditModalOpen(false);
      setIsLoading(false);
      toast.success(`问诊记录 ${editedConsultation.id} 已更新`);
    }, 600);
  };

  // 处理编辑字段变化
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedConsultation) return;
    
    const { name, value } = e.target;
    setEditedConsultation(prev => prev ? {...prev, [name]: value} : null);
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
        <p className="text-gray-600">加载问诊数据中...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">问诊管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有宠物问诊记录</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="搜索问诊记录..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">所有状态</option>
            <option value="pending">待处理</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">所有类型</option>
            <option value="video">视频问诊</option>
            <option value="text">文字问诊</option>
          </select>
        </div>
      </div>
      
      {/* 问诊列表卡片 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  问诊信息
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户与宠物
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  医生信息
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期与类型
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态与费用
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentConsultations.length > 0 ? (
                currentConsultations.map((consultation) => (
                  <tr 
                    key={consultation.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consultation.id}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {consultation.symptoms}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={consultation.userAvatar} 
                            alt={consultation.userName} 
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{consultation.userName}</div>
                          <div className="text-sm text-gray-500">{consultation.petName} ({consultation.petType})</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{consultation.veterinarianName}</div>
                      <div className="text-xs text-gray-500">
                        {consultation.type === 'video' ? '视频问诊' : '文字问诊'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{formatDate(consultation.date)}</div>
                      <div>{consultation.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          consultation.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : consultation.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : consultation.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                          {consultation.status === 'pending' ? '待处理' : 
                           consultation.status === 'in_progress' ? '进行中' :
                           consultation.status === 'completed' ? '已完成' : '已取消'}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 ml-4">
                          ¥{consultation.cost}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewConsultation(consultation)}
                        className="text-blue-500 hover:text-blue-600 mr-3"
                      >
                        查看
                      </button>
                      <button 
                        onClick={() => handleEditConsultation(consultation)}
                        className="text-orange-500 hover:text-orange-600 mr-3"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDeleteConsultation(consultation)}
                        className="text-red-500 hover:text-red-600"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="fa-solid fa-search text-3xl mb-2 text-gray-300"></i>
                      <p>未找到匹配的问诊记录</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedStatus('all');
                          setSelectedType('all');
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
      
      {/* 问诊详情模态框 */}
      {isDetailModalOpen && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">问诊详情</h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">问诊编号</h4>
                  <p className="text-lg font-semibold text-gray-900">{selectedConsultation.id}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">问诊状态</h4>
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      selectedConsultation.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : selectedConsultation.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedConsultation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedConsultation.status === 'pending' ? '待处理' : 
                       selectedConsultation.status === 'in_progress' ? '进行中' :
                       selectedConsultation.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">问诊类型</h4>
                    <p className="text-gray-900">
                      {selectedConsultation.type === 'video' ? '视频问诊' : '文字问诊'}
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">问诊费用</h4>
                    <p className="text-xl font-bold text-gray-900">¥{selectedConsultation.cost}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">问诊日期</h4>
                  <p className="text-gray-900">{formatDate(selectedConsultation.date)}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">问诊时间</h4>
                    <p className="text-gray-900">{selectedConsultation.time}</p>
                  </div>
                  
                  {selectedConsultation.duration > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">问诊时长</h4>
                      <p className="text-gray-900">{selectedConsultation.duration} 分钟</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">用户与宠物信息</h4>
                
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <img
                      src={selectedConsultation.userAvatar}
                      alt={selectedConsultation.userName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h5 className="text-lg font-medium text-gray-900">{selectedConsultation.userName}</h5>
                    <p className="text-gray-500 mt-1">用户ID: {selectedConsultation.userId}</p>
                    <p className="text-gray-500 mt-1">宠物: {selectedConsultation.petName} ({selectedConsultation.petType})</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">问诊信息</h4>
                
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">症状描述</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedConsultation.symptoms}</p>
                  </div>
                </div>
                
                {selectedConsultation.diagnosis && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">诊断结果</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedConsultation.diagnosis}</p>
                    </div>
                  </div>
                )}
                
                {selectedConsultation.treatment && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-2">治疗建议</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{selectedConsultation.treatment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* 编辑问诊模态框 */}
      {isEditModalOpen && editedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">编辑问诊状态</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-1">问诊编号</h4>
                <p className="text-lg font-semibold text-gray-900">{editedConsultation.id}</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  问诊状态
                </label>
                <select
                  id="status"
                  name="status"
                  value={editedConsultation.status}
                  onChange={handleEditChange}
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="pending">待处理</option>
                  <option value="in_progress">进行中</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              
              {editedConsultation.status === 'completed' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                      诊断结果
                    </label>
                    <textarea
                      id="diagnosis"
                      name="diagnosis"
                      value={editedConsultation.diagnosis || ''}
                      onChange={handleEditChange}
                      rows={2}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="输入诊断结果..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                      治疗建议
                    </label>
                    <textarea
                      id="treatment"
                      name="treatment"
                      value={editedConsultation.treatment || ''}
                      onChange={handleEditChange}
                      rows={2}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="输入治疗建议..."
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                取消
              </button>
              <button
                onClick={saveConsultationEdit}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                保存更改
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* 删除确认模态框 */}
      {isDeleteModalOpen && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">确认删除问诊记录</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fa-solid fa-exclamation-circle text-red-500 text-2xl"></i>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">确定要删除此问诊记录吗？</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    此操作不可撤销。删除后，相关的所有问诊数据将被永久移除。
                  </p>
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">问诊编号: {selectedConsultation.id}</p>
                    <p className="text-sm text-gray-500 mt-1">用户: {selectedConsultation.userName} - 宠物: {selectedConsultation.petName}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteConsultation}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                确认删除
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
