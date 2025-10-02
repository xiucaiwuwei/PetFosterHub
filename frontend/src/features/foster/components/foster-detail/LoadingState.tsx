import { Navbar } from '@/components/layout/Navbar.tsx';
import { Footer } from '@/features/home/components/Footer.tsx';

export const LoadingState = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">加载服务详情中...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};