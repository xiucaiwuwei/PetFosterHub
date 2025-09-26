import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/utils';

// 设置分类类型定义
interface SettingCategory {
  id: string;
  name: string;
  icon: string;
}

// 设置项类型定义
interface SettingItem {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'password';
  value: string | boolean | number;
  placeholder?: string;
  options?: { value: string; label: string }[];
  description?: string;
  required?: boolean;
}

// 模拟设置数据
const generateMockSettings = () => {
  return {
    general: [
      {
        id: 'siteName',
        name: '网站名称',
        type: 'text',
        value: '宠物寄养家',
        placeholder: '输入网站名称',
        description: '显示在网站顶部和浏览器标签的名称'
      },
      {
        id: 'siteDescription',
        name: '网站描述',
        type: 'textarea',
        value: '专业的宠物寄养服务平台，连接宠物主人与爱心寄养人士',
        placeholder: '输入网站描述',
        description: '用于SEO和网站介绍'
      },
      {
        id: 'contactEmail',
        name: '联系邮箱',
        type: 'text',
        value: 'contact@petfoster.com',
        placeholder: '输入联系邮箱',
        required: true
      },
      {
        id: 'contactPhone',
        name: '联系电话',
        type: 'text',
        value: '400-123-4567',
        placeholder: '输入联系电话'
      },
      {
        id: 'businessHours',
        name: '工作时间',
        type: 'text',
        value: '周一至周日 9:00-21:00',
        placeholder: '输入工作时间'
      }
    ],
    system: [
      {
        id: 'emailNotifications',
        name: '邮件通知',
        type: 'checkbox',
        value: true,
        description: '启用系统邮件通知功能'
      },
      {
        id: 'smsNotifications',
        name: '短信通知',
        type: 'checkbox',
        value: true,
        description: '启用系统短信通知功能'
      },
      {
        id: 'paymentGateway',
        name: '支付网关',
        type: 'select',
        value: 'alipay',
        options: [
          { value: 'alipay', label: '支付宝' },
          { value: 'wechat', label: '微信支付' },
          { value: 'unionpay', label: '银联支付' }
        ],
        description: '选择默认支付方式'
      },
      {
        id: 'commissionRate',
        name: '平台佣金比例',
        type: 'text',
        value: '10',
        placeholder: '输入佣金比例',
        description: '平台收取的服务佣金百分比 (%)'
      },
      {
        id: 'autoApproveListings',
        name: '自动审核列表',
        type: 'checkbox',
        value: false,
        description: '新发布的寄养服务是否自动通过审核'
      }
    ],
    appearance: [
      {
        id: 'theme',
        name: '主题风格',
        type: 'select',
        value: 'light',
        options: [
          { value: 'light', label: '浅色主题' },
          { value: 'dark', label: '深色主题' },
          { value: 'auto', label: '自动切换' }
        ],
        description: '选择网站主题风格'
      },
      {
        id: 'primaryColor',
        name: '主色调',
        type: 'select',
        value: 'orange',
        options: [
          { value: 'orange', label: '橙色 (默认)' },
          { value: 'blue', label: '蓝色' },
          { value: 'green', label: '绿色' },
          { value: 'purple', label: '紫色' },
          { value: 'red', label: '红色' }
        ],
        description: '选择网站主色调'
      },
      {
        id: 'logo',
        name: '网站Logo',
        type: 'file',
        value: '',
        description: '上传网站Logo图片'
      },
      {
        id: 'favicon',
        name: '网站图标',
        type: 'file',
        value: '',
        description: '上传浏览器标签图标 (ICO格式)'
      }
    ],
    security: [
      {
        id: 'changePassword',
        name: '修改密码',
        type: 'password',
        value: '',
        placeholder: '输入新密码',
        description: '修改管理员登录密码'
      },
      {
        id: 'sessionTimeout',
        name: '会话超时时间',
        type: 'select',
        value: '30',
        options: [
          { value: '15', label: '15分钟' },
          { value: '30', label: '30分钟' },
          { value: '60', label: '1小时' },
          { value: '120', label: '2小时' },
          { value: '240', label: '4小时' }
        ],
        description: '设置管理员会话超时时间'
      },
      {
        id: 'loginAttempts',
        name: '登录尝试次数',
        type: 'text',
        value: '5',
        placeholder: '输入尝试次数',
        description: '允许的最大登录失败次数'
      },
      {
        id: 'ipWhitelist',
        name: 'IP白名单',
        type: 'checkbox',
        value: false,
        description: '启用IP白名单限制管理员登录'
      }
    ]
  };
};

// 设置分类
const categories: SettingCategory[] = [
  { id: 'general', name: '基本设置', icon: 'fa-cog' },
  { id: 'system', name: '系统配置', icon: 'fa-server' },
  { id: 'appearance', name: '外观设置', icon: 'fa-paint-brush' },
  { id: 'security', name: '安全设置', icon: 'fa-shield' }
];

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [settings, setSettings] = useState(generateMockSettings());
  const [originalSettings, setOriginalSettings] = useState(generateMockSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // 处理设置变更
  const handleSettingChange = (category: string, id: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, value } : item
      )
    }));
    setShowSuccessMessage(false);
  };

  // 处理文件上传预览
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: string, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        handleSettingChange(category, id, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // 保存设置
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // 模拟API保存延迟
    setTimeout(() => {
      setOriginalSettings({...settings});
      setIsSaving(false);
      setShowSuccessMessage(true);
      
      // 3秒后隐藏成功提示
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      toast.success('设置保存成功！');
    }, 1200);
  };

  // 重置设置
  const handleResetSettings = () => {
    setSettings({...originalSettings});
    setShowSuccessMessage(false);
  };

  // 判断设置是否有更改
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-500 mt-1">配置系统各项参数和偏好设置</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleResetSettings}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-undo mr-1"></i>
            重置
          </button>
          
          <button
            onClick={handleSaveSettings}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                保存中...
              </>
            ) : (
              <>
                <i className="fa-solid fa-save mr-1"></i>
                保存设置
              </>
            )}
          </button>
        </div>
      </div>
      
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <i className="fa-solid fa-check-circle text-green-500 text-lg mr-3"></i>
          <div>
            <h3 className="text-sm font-medium text-green-800">设置已保存</h3>
            <p className="text-sm text-green-700">您的更改已成功保存</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "px-6 py-4 text-sm font-medium whitespace-nowrap",
                  activeCategory === category.id
                    ? "border-b-2 border-orange-500 text-orange-600"
                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <i className={`fa-solid ${category.icon} mr-2`}></i>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {filePreview && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg flex items-center justify-center">
              <img 
                src={filePreview} 
                alt="预览图" 
                className="max-h-40 max-w-full object-contain"
              />
              <button 
                onClick={() => setFilePreview(null)}
                className="ml-4 text-red-500 hover:text-red-600"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          )}
          
          <div className="space-y-6">
            {settings[activeCategory].map((setting) => (
              <div key={setting.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {setting.name}
                      {setting.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {setting.description && (
                      <p className="text-xs text-gray-500 mt-1">{setting.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-1">
                  {setting.type === 'text' && (
                    <input
                      type="text"
                      value={setting.value as string}
                      onChange={(e) => handleSettingChange(activeCategory, setting.id, e.target.value)}
                      placeholder={setting.placeholder}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  )}
                  
                  {setting.type === 'textarea' && (
                    <textarea
                      rows={4}
                      value={setting.value as string}
                      onChange={(e) => handleSettingChange(activeCategory, setting.id, e.target.value)}
                      placeholder={setting.placeholder}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    ></textarea>
                  )}
                  
                  {setting.type === 'select' && (
                    <select
                      value={setting.value as string}
                      onChange={(e) => handleSettingChange(activeCategory, setting.id, e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {setting.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {setting.type === 'checkbox' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={setting.value as boolean}
                        onChange={(e) => handleSettingChange(activeCategory, setting.id, e.target.checked)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        启用{setting.name.toLowerCase()}
                      </label>
                    </div>
                  )}
                  
                  {setting.type === 'password' && (
                    <input
                      type="password"
                      value={setting.value as string}
                      onChange={(e) => handleSettingChange(activeCategory, setting.id, e.target.value)}
                      placeholder={setting.placeholder}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  )}
                  
                  {setting.type === 'file' && (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <i className="fa-solid fa-cloud-upload text-3xl text-gray-400"></i>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor={setting.id}
                            className="relative cursor-pointer bg-white rounded-md font-medium text-orange-500 hover:text-orange-600 focus-within:outline-none"
                          >
                            <span>上传文件</span>
                            <input
                              id={setting.id}
                              name={setting.id}
                              type="file"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e, activeCategory, setting.id)}
                            />
                          </label>
                          <p className="pl-1">或拖放文件</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG (最大 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
