import { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/utils';

// 模拟数据 - 用户增长趋势
const userGrowthData = [
  { month: '1月', 新增用户: 40, 总用户: 40 },
  { month: '2月', 新增用户: 30, 总用户: 70 },
  { month: '3月', 新增用户: 50, 总用户: 120 },
  { month: '4月', 新增用户: 78, 总用户: 198 },
  { month: '5月', 新增用户: 48, 总用户: 246 },
  { month: '6月', 新增用户: 68, 总用户: 314 },
  { month: '7月', 新增用户: 90, 总用户: 404 },
  { month: '8月', 新增用户: 120, 总用户: 524 },
  { month: '9月', 新增用户: 85, 总用户: 609 },
  { month: '10月', 新增用户: 110, 总用户: 719 },
  { month: '11月', 新增用户: 130, 总用户: 849 },
  { month: '12月', 新增用户: 150, 总用户: 999 },
];

// 模拟数据 - 订单统计
const orderData = [
  { name: '寄养服务', 订单量: 380, 收入: 120000 },
  { name: '宠物商品', 订单量: 520, 收入: 85000 },
  { name: '宠物美容', 订单量: 240, 收入: 48000 },
  { name: '宠物医疗', 订单量: 180, 收入: 65000 },
  { name: '其他服务', 订单量: 90, 收入: 15000 },
];

// 模拟数据 - 月度收入
const revenueData = [
  { month: '1月', 收入: 12000 },
  { month: '2月', 收入: 19000 },
  { month: '3月', 收入: 22000 },
  { month: '4月', 收入: 28000 },
  { month: '5月', 收入: 35000 },
  { month: '6月', 收入: 42000 },
  { month: '7月', 收入: 48000 },
  { month: '8月', 收入: 52000 },
  { month: '9月', 收入: 45000 },
  { month: '10月', 收入: 58000 },
  { month: '11月', 收入: 65000 },
  { month: '12月', 收入: 78000 },
];

// 模拟数据 - 用户分布
const userDistributionData = [
  { name: '宠物主人', value: 72 },
  { name: '寄养人士', value: 28 },
];

// 颜色配置
const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#ef4444'];

// 格式化金额显示
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Reports() {
  // 状态管理
  const [dateRange, setDateRange] = useState('year');
  const [reportType, setReportType] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    userGrowthRate: 0,
    revenueGrowthRate: 0,
  });

  // 加载模拟数据
  useEffect(() => {
    const timer = setTimeout(() => {
      // 计算汇总统计数据
      const totalUsers = userGrowthData[userGrowthData.length - 1].总用户;
      const totalOrders = orderData.reduce((sum, item) => sum + item.订单量, 0);
      const totalRevenue = orderData.reduce((sum, item) => sum + item.收入, 0);
      const avgOrderValue = Math.round(totalRevenue / totalOrders);
      
      // 计算增长率（与上一周期比较）
      const userGrowthRate = Math.round(
        ((userGrowthData[userGrowthData.length - 1].总用户 - userGrowthData[userGrowthData.length - 2].总用户) / 
         userGrowthData[userGrowthData.length - 2].总用户) * 100
      );
      
      const revenueGrowthRate = Math.round(
        ((revenueData[revenueData.length - 1].收入 - revenueData[revenueData.length - 2].收入) / 
         revenueData[revenueData.length - 2].收入) * 100
      );
      
      setSummaryStats({
        totalUsers,
        totalOrders,
        totalRevenue,
        avgOrderValue,
        userGrowthRate,
        revenueGrowthRate,
      });
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // 导出报表功能
  const exportReport = () => {
    toast.success('报表导出成功！');
  };

  // 加载状态显示
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载报表数据中...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 页面标题和操作栏 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报表分析</h1>
          <p className="text-gray-500 mt-1">查看和分析平台运营数据</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">本年度</option>
              <option value="custom">自定义</option>
            </select>
            
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="overview">数据概览</option>
              <option value="users">用户分析</option>
              <option value="orders">订单分析</option>
              <option value="revenue">收入分析</option>
              <option value="services">服务分析</option>
            </select>
          </div>
          
          <button
            onClick={exportReport}
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out whitespace-nowrap"
          >
            <i className="fa-solid fa-download mr-2"></i>导出报表
          </button>
        </div>
      </div>
      
      {/* 数据概览卡片 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 col-span-1 xl:col-span-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-users text-blue-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">总用户数</h3>
              <div className="flex items-end">
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalUsers.toLocaleString()}</p>
                <span className="ml-2 text-sm font-medium text-green-500 flex items-center">
                  <i className="fa-solid fa-arrow-up mr-1"></i>{summaryStats.userGrowthRate}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData.slice(-6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Line 
                  type="monotone" 
                  dataKey="总用户" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 col-span-1 xl:col-span-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-shopping-cart text-green-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">总订单量</h3>
              <div className="flex items-end">
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalOrders.toLocaleString()}</p>
                <span className="ml-2 text-sm font-medium text-green-500 flex items-center">
                  <i className="fa-solid fa-arrow-up mr-1"></i>12.5%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData.slice(0, 6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Bar 
                  dataKey="订单量" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 col-span-1 xl:col-span-2">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-credit-card text-orange-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">总收入</h3>
              <div className="flex items-end">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.totalRevenue)}</p>
                <span className="ml-2 text-sm font-medium text-green-500 flex items-center">
                  <i className="fa-solid fa-arrow-up mr-1"></i>{summaryStats.revenueGrowthRate}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData.slice(-6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Area 
                  type="monotone" 
                  dataKey="收入" 
                  stroke="#f97316" 
                  fill="#f97316" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
      
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 用户增长趋势图 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-900">用户增长趋势</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-orange-500 text-white rounded-full">新增用户</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">总用户</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userGrowthData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  formatter={(value) => [value, '用户数']}
                />
                <Line 
                  type="monotone" 
                  dataKey="新增用户" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="新增用户"
                />
                <Line 
                  type="monotone" 
                  dataKey="总用户" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="总用户"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 用户类型分布 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-900 mb-6">用户类型分布</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, '占比']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {userDistributionData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="ml-auto text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 第二行图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 服务类型分析 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-gray-900">服务类型分析</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-orange-500 text-white rounded-full">订单量</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">收入</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  formatter={(value, name) => [name === '订单量' ? `${value} 单` : formatCurrency(value), name === '订单量' ? '订单量' : '收入']}
                />
                <Bar 
                  dataKey="订单量" 
                  fill="#f97316" 
                  radius={[0, 4, 4, 0]}
                  name="订单量"
                />
                <Bar 
                  dataKey="收入" 
                  fill="#3b82f6" 
                  radius={[0, 4, 4, 0]}
                  name="收入"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 月度收入趋势 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-900 mb-6">月度收入趋势</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(value) => `¥${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                  }}
                  formatter={(value) => [formatCurrency(value), '收入']}
                />
                <Area 
                  type="monotone" 
                  dataKey="收入" 
                  stroke="#f97316" 
                  fill="#ffedd5" 
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
