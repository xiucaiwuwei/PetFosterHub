// Home模块的服务层逻辑
import homeApi from '../api/homeApi';
import type { FosterService } from '../types';
import type { Testimonial } from '../types';

// Home服务
class HomeService {
  /**
   * 获取最好的三个寄养服务数据
   * @returns 评分最高的三个寄养服务列表的Promise
   */
  async getTopThreeFosters(): Promise<FosterService[]> {
    console.log('[HomeService] 开始获取最好的三个寄养服务数据');
    try {
      const data = await homeApi.getTopThreeFosters();
      console.log('[HomeService] 获取最好的三个寄养服务数据成功', { count: data?.length || 0 });
      return data;
    } catch (error) {
      console.error('[HomeService] 获取最好的三个寄养服务数据失败', { error: error instanceof Error ? error.message : '未知错误' });
      throw error;
    }
  }

  /**
   * 获取三个用户最新的评价
   * @returns 最新的三个用户评价列表的Promise
   */
  async getLatestThreeTestimonials(): Promise<Testimonial[]> {
    console.log('[HomeService] 开始获取三个用户最新的评价');
    try {
      const data = await homeApi.getLatestThreeTestimonials();
      console.log('[HomeService] 获取三个用户最新的评价成功', { count: data?.length || 0 });
      return data;
    } catch (error) {
      console.error('[HomeService] 获取三个用户最新的评价失败', { error: error instanceof Error ? error.message : '未知错误' });
      throw error;
    }
  }
}

export default new HomeService();