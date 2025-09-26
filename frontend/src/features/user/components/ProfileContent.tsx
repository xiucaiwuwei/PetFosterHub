import React, { useState } from 'react';
import { GetUserInfoDto } from '../types';
import { UserProfileForm } from './UserProfileForm';
import { getPetsByOwnerId } from '@/mocks/pets';
import { getBookingsByOwnerId } from '@/mocks/bookings';
import { Pet, Booking } from '@/types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface ProfileContentProps {
  userInfo: GetUserInfoDto | null;
  activeTab: string;
  isEditing: boolean;
  editedUserInfo: GetUserInfoDto | null;
  setEditedUserInfo: (userInfo: GetUserInfoDto | null) => void;
  onCancelEdit: () => void;
  onSaveEdit: (userData: any) => Promise<void>;
}

/**
 * 格式化日期显示
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 个人中心内容组件
 */
export const ProfileContent: React.FC<ProfileContentProps> = ({
  userInfo,
  activeTab,
  isEditing,
  editedUserInfo,
  setEditedUserInfo,
  onCancelEdit,
  onSaveEdit
}) => {
  // 模拟数据状态
  const [pets, setPets] = useState<Pet[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'dog',
    breed: '',
    age: 0,
    size: 'small',
    description: '',
    specialNeeds: '',
    vaccinated: true,
    imagePreview: '',
    imageFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当用户信息加载完成后，获取相关数据
  React.useEffect(() => {
    if (userInfo) {
      // 获取用户的宠物
      const userPets = getPetsByOwnerId(userInfo.id);
      setPets(userPets);
      
      // 获取用户的预订
      const userBookings = getBookingsByOwnerId(userInfo.id);
      setBookings(userBookings);
    }
  }, [userInfo]);

  /**
   * 处理宠物照片上传
   */
  const handlePetPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPet({
        ...newPet,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  /**
   * 添加宠物
   */
  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单表单验证
    if (!newPet.name || !newPet.breed || newPet.age === 0) {
      toast.error('请填写必填字段');
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟API请求
    setTimeout(() => {
      // 创建新宠物对象
      const petToAdd: Pet = {
        id: `p${pets.length + 1}`,
        name: newPet.name,
        type: newPet.type as 'dog' | 'cat' | 'other',
        breed: newPet.breed,
        age: newPet.age,
        size: newPet.size as 'small' | 'medium' | 'large',
        description: newPet.description,
        imageUrls: newPet.imagePreview ? [newPet.imagePreview] : ['https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%8A%A8%E7%89%A9%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8A%A8%E7%89%A9%E7%85%A7%E7%89%87&sign=4916b0c9017e427c2555127ae824f4ee'],
        ownerId: userInfo?.id || '',
        specialNeeds: newPet.specialNeeds,
        vaccinated: newPet.vaccinated
      };
      
      // 添加到宠物列表
      setPets([...pets, petToAdd]);
      
      // 重置表单
      setNewPet({
        name: '',
        type: 'dog',
        breed: '',
        age: 0,
        size: 'small',
        description: '',
        specialNeeds: '',
        vaccinated: true,
        imagePreview: '',
        imageFile: null
      });
      
      setIsSubmitting(false);
      setShowAddPetModal(false);
      toast.success(`${petToAdd.name} 添加成功！`);
    }, 1500);
  };

  if (!userInfo) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-gray-600">加载中...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 个人资料内容 */}
      {activeTab === 'info' && (
        <div>
          {isEditing ? (
            <UserProfileForm
              userInfo={userInfo}
              editedUserInfo={editedUserInfo}
              setEditedUserInfo={setEditedUserInfo}
              onCancel={onCancelEdit}
              onSubmit={onSaveEdit}
            />
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">关于我</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {userInfo.bio || '暂无个人简介'}
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">联系信息</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">邮箱</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userInfo.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">电话</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userInfo.phone || '未填写'}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">地址</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userInfo.address || '未填写'}</dd>
                  </div>
                </dl>
              </div>
              
              {userInfo.role === 'foster' && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">寄养服务资质</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-600">宠物护理专业培训证书</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-600">宠物急救技能认证</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span className="text-gray-600">无犯罪记录证明</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* 我的宠物标签页内容 */}
      {activeTab === 'pets' && userInfo.role === 'owner' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">我的宠物</h3>
            <button 
              onClick={() => setShowAddPetModal(true)}
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <i className="fa-solid fa-plus mr-1"></i>
              添加宠物
            </button>
          </div>
          
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex">
                    <div className="flex-shrink-0 w-32 h-32">
                      <img
                        src={pet.imageUrls[0]}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{pet.name}</h4>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-gray-500">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="text-gray-400 hover:text-red-500">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{pet.breed} · {pet.age}岁</p>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {pet.type === 'dog' ? '狗狗' : pet.type === 'cat' ? '猫咪' : '其他宠物'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {pet.vaccinated ? '已接种疫苗' : '未接种疫苗'}
                        </span>
                      </div>
                      
                      {pet.specialNeeds && (
                        <div className="mt-3">
                          <h5 className="text-xs font-medium text-gray-500">特殊需求:</h5>
                          <p className="text-sm text-gray-600">{pet.specialNeeds}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-paw text-2xl text-orange-500"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">您还没有添加宠物</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                添加您的宠物信息，以便寄养人士更好地了解它们的需求
              </p>
              <button 
                onClick={() => setShowAddPetModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                添加宠物
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 我的寄养服务标签页内容 */}
      {activeTab === 'services' && userInfo.role === 'foster' && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-home text-2xl text-orange-500"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">您还没有创建寄养服务</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            创建寄养服务，开始接收宠物寄养预订
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <i className="fa-solid fa-plus mr-2"></i>
            创建寄养服务
          </button>
        </div>
      )}
      
      {/* 预订记录标签页内容 */}
      {activeTab === 'bookings' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">我的预订</h3>
            <div className="relative">
              <select className="pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-lg appearance-none">
                <option value="all">所有预订</option>
                <option value="pending">待确认</option>
                <option value="confirmed">已确认</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
          
          {bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status === 'pending' ? '待确认' : booking.status === 'confirmed' ? '已确认' : booking.status === 'completed' ? '已完成' : '已取消'}
                      </span>
                      <span className="ml-4 text-sm text-gray-500">
                        预订编号: {booking.id}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ¥{booking.totalPrice}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start mb-4 md:mb-0">
                        <div className="flex-shrink-0">
                          <img
                            src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137"
                            alt="寄养提供者"
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">张明的温馨家庭式宠物寄养</h4>
                          <p className="text-sm text-gray-500">北京市朝阳区</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                        <div className="mb-4 md:mb-0">
                          <h5 className="text-xs font-medium text-gray-500">寄养日期</h5>
                          <p className="text-sm text-gray-900">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-xs font-medium text-gray-500">宠物</h5>
                          <p className="text-sm text-gray-900">豆豆 (金毛寻回犬)</p>
                        </div>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="text-xs font-medium text-gray-500">特殊要求</h5>
                        <p className="text-sm text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <Link to={`/profile/orders/${booking.id}`} className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                        查看详情
                      </Link>
                      {booking.status === 'pending' && (
                        <button className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          取消预订
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-calendar text-2xl text-orange-500"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预订记录</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                您还没有任何寄养预订记录
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                <i className="fa-solid fa-search mr-2"></i>
                寻找寄养服务
              </button>
            </div>
          )}
        </div>
      )}

      {/* 添加宠物模态框 */}
      {showAddPetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">添加宠物</h3>
              <button 
                onClick={() => setShowAddPetModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddPet} className="space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    宠物照片
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePetPhotoUpload}
                      className="hidden"
                      id="pet-photo"
                    />
                    <label htmlFor="pet-photo" className="cursor-pointer">
                      {newPet.imagePreview ? (
                        <img 
                          src={newPet.imagePreview} 
                          alt="宠物预览" 
                          className="w-full h-40 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="py-8">
                          <i className="fa-solid fa-camera text-gray-400 text-3xl mb-2"></i>
                          <p className="text-sm text-gray-500">点击上传宠物照片</p>
                          <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG 格式</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 mb-1">
                      宠物名字 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pet-name"
                      value={newPet.name}
                      onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pet-type" className="block text-sm font-medium text-gray-700 mb-1">
                        宠物类型 <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="pet-type"
                        value={newPet.type}
                        onChange={(e) => setNewPet({...newPet, type: e.target.value})}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="dog">狗狗</option>
                        <option value="cat">猫咪</option>
                        <option value="other">其他宠物</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="pet-breed" className="block text-sm font-medium text-gray-700 mb-1">
                        品种 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="pet-breed"
                        value={newPet.breed}
                        onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pet-age" className="block text-sm font-medium text-gray-700 mb-1">
                        年龄（岁） <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="pet-age"
                        min="0"
                        max="20"
                        value={newPet.age || ''}
                        onChange={(e) => setNewPet({...newPet, age: parseInt(e.target.value) || 0})}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="pet-size" className="block text-sm font-medium text-gray-700 mb-1">
                        体型
                      </label>
                      <select
                        id="pet-size"
                        value={newPet.size}
                        onChange={(e) => setNewPet({...newPet, size: e.target.value})}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="small">小型</option>
                        <option value="medium">中型</option>
                        <option value="large">大型</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="pet-description" className="block text-sm font-medium text-gray-700 mb-1">
                  宠物描述
                </label>
                <textarea
                  id="pet-description"
                  rows={3}
                  value={newPet.description}
                  onChange={(e) => setNewPet({...newPet, description: e.target.value})}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="描述一下您的宠物性格、爱好等信息"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="pet-special-needs" className="block text-sm font-medium text-gray-700 mb-1">
                  特殊需求或注意事项
                </label>
                <textarea
                  id="pet-special-needs"
                  rows={2}
                  value={newPet.specialNeeds}
                  onChange={(e) => setNewPet({...newPet, specialNeeds: e.target.value})}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="如特殊饮食要求、药物、行为习惯等"
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pet-vaccinated"
                  checked={newPet.vaccinated}
                  onChange={(e) => setNewPet({...newPet, vaccinated: e.target.checked})}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                />
                <label htmlFor="pet-vaccinated" className="ml-2 block text-sm text-gray-700">
                  已接种疫苗
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddPetModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      添加中...
                    </span>
                  ) : (
                    '添加宠物'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};