import React, { useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { ServiceFeatures } from '../components/ServiceFeatures';
import { FeaturedFosters } from '../components/FeaturedFosters';
import { HowItWorks } from '../components/HowItWorks';
import { Footer } from '@/components/layout/Footer';
import { useHomeActions } from '../hooks';

export default function Home() {
  const { initializeHomeData } = useHomeActions();

  useEffect(() => {
    // 初始化home页面所有数据
    initializeHomeData();
  }, [initializeHomeData]);

  return (
    <div>
      <HeroSection />
      <ServiceFeatures />
      <FeaturedFosters />
      <HowItWorks />
      <Footer />
    </div>
  );
}