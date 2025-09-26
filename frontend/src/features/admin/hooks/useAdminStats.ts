/**
 * 管理员统计自定义Hook
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { fetchStats } from '../slice/adminSlice';
import adminService from '../services/adminService';

/**
 * 管理员统计Hook
 */
export const useAdminStats = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state: RootState) => state.admin);
  
  const [trendData, setTrendData] = useState<any[]>([]);
  const [userTypeData, setUserTypeData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // 颜色配置
  const COLORS = ['#f97316', '#4ade80', '#3b82f6', '#8b5cf6', '#ec4899'];

  // 获取统计数据
  const loadStats = async () => {
    try {
      setStatsLoading(true);
      
      // 调用API获取统计数据
      const result = await adminService.stats.getStats();
      
      // 更新Redux状态
      dispatch(fetchStats());
      
      // 设置组件状态
      if (result.trendData) {
        setTrendData(result.trendData);
      }
      
      if (result.userTypes) {
        setUserTypeData(result.userTypes);
      }
      
      // 生成模拟的最近订单数据
      const mockRecentOrders = [
        { id: 'ORD-8732', type: '寄养服务', user: '赵强', date: '2023-06-15', status: '已完成', amount: '¥680.00' },
        { id: 'ORD-8731', type: '宠物食品', user: '李华', date: '2023-06-14', status: '已支付', amount: '¥129.00' },
        { id: 'ORD-8730', type: '寄养服务', user: '王芳', date: '2023-06-14', status: '进行中', amount: '¥960.00' },
        { id: 'ORD-8729', type: '宠物用品', user: '张明', date: '2023-06-13', status: '已发货', amount: '¥256.00' },
        { id: 'ORD-8728', type: '线上问诊', user: '陈静', date: '2023-06-12', status: '已完成', amount: '¥150.00' }
      ];
      
      setRecentOrders(mockRecentOrders);
    } catch (error) {
      console.error('获取统计数据失败:', error);
      // 可以在这里添加错误处理
    } finally {
      setStatsLoading(false);
    }
  };

  // 初始化加载统计数据
  useEffect(() => {
    loadStats();
  }, []);

  // 刷新统计数据
  const refreshStats = () => {
    loadStats();
  };

  // 切换图表周期
  const handlePeriodChange = (period: 'monthly' | 'quarterly' | 'yearly') => {
    setChartPeriod(period);
    
    // 根据选择的周期更新趋势数据
    if (period === 'monthly') {
      setTrendData([
        { name: '1月', 寄养订单: 40, 商品订单: 24, 收入: 14000 },
        { name: '2月', 寄养订单: 30, 商品订单: 43, 收入: 18000 },
        { name: '3月', 寄养订单: 50, 商品订单: 22, 收入: 16000 },
        { name: '4月', 寄养订单: 78, 商品订单: 39, 收入: 25000 },
        { name: '5月', 寄养订单: 48, 商品订单: 49, 收入: 22000 },
        { name: '6月', 寄养订单: 68, 商品订单: 38, 收入: 28000 }
      ]);
    } else if (period === 'quarterly') {
      setTrendData([
        { name: 'Q1', 寄养订单: 120, 商品订单: 89, 收入: 48000 },
        { name: 'Q2', 寄养订单: 194, 商品订单: 126, 收入: 75000 },
        { name: 'Q3', 寄养订单: 178, 商品订单: 142, 收入: 72000 },
        { name: 'Q4', 寄养订单: 210, 商品订单: 155, 收入: 85000 }
      ]);
    } else if (period === 'yearly') {
      setTrendData([
        { name: '2020', 寄养订单: 450, 商品订单: 320, 收入: 180000 },
        { name: '2021', 寄养订单: 580, 商品订单: 450, 收入: 240000 },
        { name: '2022', 寄养订单: 690, 商品订单: 580, 收入: 310000 },
        { name: '2023', 寄养订单: 820, 商品订单: 680, 收入: 370000 }
      ]);
    }
  };

  // 获取订单状态样式
  const getOrderStatusClassName = (status: string): string => {
    const statusClassMap: Record<string, string> = {
      '已完成': 'bg-green-100 text-green-800',
      '已支付': 'bg-blue-100 text-blue-800',
      '进行中': 'bg-yellow-100 text-yellow-800',
      '已发货': 'bg-purple-100 text-purple-800',
      '已取消': 'bg-red-100 text-red-800',
      '待确认': 'bg-gray-100 text-gray-800'
    };
    return statusClassMap[status] || 'bg-gray-100 text-gray-800';
  };

  return {
    stats,
    trendData,
    userTypeData,
    recentOrders,
    statsLoading: statsLoading || loading,
    chartPeriod,
    COLORS,
    refreshStats,
    handlePeriodChange,
    getOrderStatusClassName
  };
};