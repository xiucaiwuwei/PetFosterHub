import { ServiceType } from '../types/enums';

interface ApplicationSummaryProps {
  formData: Record<string, any>;
}

/**
 * 服务提供者申请信息摘要组件
 * 用于在提交前显示用户填写的所有信息
 */
const ApplicationSummary = ({ formData }: ApplicationSummaryProps) => {
  // 获取服务类型的显示文本
  const getServiceTypeText = (type: string) => {
    switch (type) {
      case ServiceType.PET_SITTING:
        return '宠物上门照顾';
      case ServiceType.DOG_WALKING:
        return '宠物外出遛弯';
      case ServiceType.PET_GROOMING:
        return '宠物美容服务';
      case ServiceType.MULTI_SERVICE:
        return '多项服务';
      default:
        return '未选择';
    }
  };

  // 获取经验年限的显示文本
  const getExperienceYearsText = (years: string) => {
    switch (years) {
      case 'less1':
        return '1年以内';
      case '1-3':
        return '1-3年';
      case '3-5':
        return '3-5年';
      case 'more5':
        return '5年以上';
      default:
        return '未提供';
    }
  };

  // 检查是否有文件类型的图片
  const isFileImage = (image: any) => {
    return image instanceof File;
  };

  // 渲染可用时间
  const renderAvailability = () => {
    const availability = [];
    if (formData.availableWeekdays) availability.push('工作日');
    if (formData.availableWeekends) availability.push('周末');
    if (formData.availableEvenings) availability.push('晚间服务');
    
    return availability.length > 0 ? availability.join('、') : '未设置';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <div className="px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">申请信息摘要</h2>
        
        {/* 基本信息部分 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-24">姓名：</span>
              <span className="text-gray-900 font-medium">{formData.name || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">手机号码：</span>
              <span className="text-gray-900 font-medium">{formData.phone || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">电子邮箱：</span>
              <span className="text-gray-900 font-medium">{formData.email || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">身份证号：</span>
              <span className="text-gray-900 font-medium">
                {formData.idCard ? formData.idCard.replace(/(.{6})(.*)(.{4})/, '$1******$3') : '-'}
              </span>
            </div>
            <div className="md:col-span-2 flex">
              <span className="text-gray-500 w-24">详细地址：</span>
              <span className="text-gray-900 font-medium">{formData.address || '-'}</span>
            </div>
          </div>
        </div>
        
        {/* 服务信息部分 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">服务信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-24">服务类型：</span>
              <span className="text-gray-900 font-medium">{getServiceTypeText(formData.serviceType)}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">服务经验：</span>
              <span className="text-gray-900 font-medium">
                {formData.hasExperience ? getExperienceYearsText(formData.experienceYears) : '无经验'}
              </span>
            </div>
            <div className="md:col-span-2">
              <div className="mb-2">
                <span className="text-gray-500">服务特色描述：</span>
              </div>
              <div className="text-gray-900 font-medium bg-gray-50 p-3 rounded border border-gray-200">
                {formData.serviceDesc || '-'}
              </div>
            </div>
          </div>
        </div>
        
        {/* 服务时间部分 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">可用时间</h3>
          <div className="flex text-sm">
            <span className="text-gray-500 w-24">服务时段：</span>
            <span className="text-gray-900 font-medium">{renderAvailability()}</span>
          </div>
        </div>
        
        {/* 服务定价部分 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">服务定价</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-24">基础价格：</span>
              <span className="text-gray-900 font-medium">¥{formData.basePrice || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">附加价格：</span>
              <span className="text-gray-900 font-medium">¥{formData.additionalPrice || '-'}</span>
            </div>
          </div>
        </div>
        
        {/* 紧急联系人部分 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">紧急联系人</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-24">姓名：</span>
              <span className="text-gray-900 font-medium">{formData.emergencyContactName || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">手机号码：</span>
              <span className="text-gray-900 font-medium">{formData.emergencyContactPhone || '-'}</span>
            </div>
            <div className="md:col-span-2">
              <div className="mb-2">
                <span className="text-gray-500">其他补充信息：</span>
              </div>
              <div className="text-gray-900 font-medium bg-gray-50 p-3 rounded border border-gray-200">
                {formData.additionalInfo || '-'}
              </div>
            </div>
          </div>
        </div>
        
        {/* 文件上传确认 */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">上传文件确认</h3>
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-32">身份证正面：</span>
              <span className="text-green-600 font-medium">
                {formData.idCardFront ? '已上传' : '未上传'}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-32">身份证反面：</span>
              <span className="text-green-600 font-medium">
                {formData.idCardBack ? '已上传' : '未上传'}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-32">服务照片：</span>
              <span className="text-green-600 font-medium">
                {formData.servicePhotos && formData.servicePhotos.length > 0 
                  ? `已上传 ${formData.servicePhotos.length} 张` 
                  : '未上传'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummary;