/**
 * 首页组件
 * 负责渲染整个首页的布局和内容，并处理首页数据的初始化
 */
import { useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedFosters } from '../components';
import { HowItWorks } from '../components/HowItWorks';
import { UserReviews } from '../components/UserReviews';
import { Footer } from '../components/Footer.tsx';
import { useHomeActions } from '../hooks';

export default function HomePage() {
  // 获取首页相关的action方法
  const { initializeHomeData } = useHomeActions();

  // 组件挂载时初始化首页所有数据
  useEffect(() => {
    // 初始化home页面所有数据
    initializeHomeData().catch(error => {
      console.error('初始化首页数据失败:', error);
    });
  }, [initializeHomeData]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 via-orange-100/30 to-orange-50">
      {/* 英雄区域，展示网站核心价值主张 */}
      <HeroSection />

      {/* 推荐寄养服务区域，展示精选的寄养服务 */}
      <section>
        <FeaturedFosters />
      </section>

      {/* 工作流程区域，说明平台使用流程 */}
      <section>
        <HowItWorks />
      </section>

      {/* 用户评价区域，展示真实用户反馈 */}
      <section>
        <UserReviews />
      </section>

      {/* 页脚区域，包含网站导航和版权信息 */}
      <section>
        <Footer />
      </section>
    </div>
  );
}