import type { Testimonial } from '../types';

// 用户评价模拟数据
export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: '张小姐',
    avatar: 'https://picsum.photos/id/1005/100/100',
    content: '服务非常好，工作人员对宠物很有耐心，我的狗狗在寄养期间很开心，下次还会选择这里！',
    rating: 5
  },
  {
    id: 'testimonial-2',
    name: '李先生',
    avatar: 'https://picsum.photos/id/1012/100/100',
    content: '环境干净整洁，服务专业，每天都会发送宠物的照片和视频，让我非常放心。',
    rating: 5
  },
  {
    id: 'testimonial-3',
    name: '王女士',
    avatar: 'https://picsum.photos/id/1027/100/100',
    content: '寄养体验很好，价格合理，工作人员很负责任，强烈推荐给有需要的宠物主人。',
    rating: 4
  }
];