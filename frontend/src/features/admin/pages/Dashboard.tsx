import React from 'react';
import { StatCard } from '../components/StatCard';
import { useAdminStats } from '../hooks/useAdminStats';

/**
 * 管理员仪表盘页面
 */
const Dashboard: React.FC = () => {
  const { 
    stats, 
    isLoading, 
    chartPeriod, 
    setChartPeriod,
    getOrderStatusColor
  } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载统计数据中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <div className="mt-4 md:mt-0">
          <select
            value={chartPeriod}
            onChange={(e) => setChartPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="week">最近7天</option>
            <option value="month">最近30天</option>
            <option value="quarter">最近90天</option>
            <option value="year">最近365天</option>
          </select>
        </div>
      </div>

      {/* 统计卡片行 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="总用户数"
          value={stats.totalUsers}
          change="+5.2%"
          isPositive={true}
          icon="fa-users"
          iconColor="text-blue-500"
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="今日订单"
          value={stats.todayOrders}
          change="+2.8%"
          isPositive={true}
          icon="fa-shopping-cart"
          iconColor="text-green-500"
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="总订单金额"
          value={`¥${stats.totalRevenue}`}
          change="+8.4%"
          isPositive={true}
          icon="fa-coins"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-100"
        />
        <StatCard
          title="待处理请求"
          value={stats.pendingRequests}
          change="-3.1%"
          isPositive={false}
          icon="fa-clock"
          iconColor="text-orange-500"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* 图表和统计行 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 业务趋势图表 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">业务趋势</h2>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 text-sm bg-orange-500 text-white rounded-md"
              >
                订单
              </button>
              <button 
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                收入
              </button>
              <button 
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                用户
              </button>
            </div>
          </div>
          <div className="h-64">
            {/* 这里会集成图表库，目前使用模拟内容 */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <i className="fa-solid fa-chart-line text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500">图表数据加载中...</p>
              </div>
            </div>
          </div>
        </div>

        {/* 用户类型分布 */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">用户类型分布</h2>
          <div className="space-y-4">
            {stats.userTypeDistribution.map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 最近订单 */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">最近订单</h2>
          <button className="text-orange-500 hover:text-orange-600 text-sm flex items-center">
            查看全部 <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单编号
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  服务
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.serviceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ¥{order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                    >
                      {order.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;