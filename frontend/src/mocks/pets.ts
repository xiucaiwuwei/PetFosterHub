import { Pet } from '@/types';

// 模拟宠物数据
export const pets: Pet[] = [
  {
    id: 'p1',
    name: '豆豆',
    type: 'dog',
    breed: '金毛寻回犬',
    age: 2,
    size: 'large',
    description: '非常温顺友好的金毛犬，喜欢与人互动，会基本指令，已完成训练。不挑食，喜欢户外活动和游泳。',
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E9%87%91%E6%AF%9B%E7%8A%AC%EF%BC%8C%E9%87%91%E8%89%B2%E6%AF%9B%E5%8F%91%EF%BC%8C%E7%AB%99%E7%AB%8B%E5%A7%BF%E5%8A%BF%EF%BC%8C%E5%BE%AE%E7%AC%91&sign=f625972e3043319292b471a545503655',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E9%87%91%E6%AF%9B%E7%8A%AC%E6%88%B7%E5%A4%96%E7%8E%A9%E8%80%8D%E7%85%A7%E7%89%87&sign=39d969f4e8e32ad2107ef2556e569fba'
    ],
    ownerId: 'u4',
    specialNeeds: '每天需要至少1小时户外活动',
    vaccinated: true
  },
  {
    id: 'p2',
    name: '咪咪',
    type: 'cat',
    breed: '英国短毛猫',
    age: 3,
    size: 'medium',
    description: '安静乖巧的英短猫，性格独立，喜欢被抚摸但不喜欢被抱太久。会用猫砂盆，不挑食，喜欢玩逗猫棒。',
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E8%8B%B1%E5%9B%BD%E7%9F%AD%E6%AF%9B%E7%8C%AB%EF%BC%8C%E7%81%B0%E8%89%B2%E6%AF%9B%E5%8F%91%EF%BC%8C%E5%9D%90%E5%A7%BF&sign=22e44ac4f1da21a9d3022d8a602f7cd2',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E8%8B%B1%E7%9F%AD%E7%8C%AB%E7%9D%A1%E8%A7%89%E7%85%A7%E7%89%87&sign=e35bade11f88e9183374132230a9dbc3'
    ],
    ownerId: 'u4',
    vaccinated: true
  },
  {
    id: 'p3',
    name: '小黑',
    type: 'dog',
    breed: '拉布拉多',
    age: 1,
    size: 'medium',
    description: '活泼好动的拉布拉多幼犬，正在训练中，会基本指令。喜欢和其他狗狗玩耍，对人友善。',
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E9%BB%91%E8%89%B2%E6%8B%89%E5%B8%83%E6%8B%89%E5%A4%9A%E7%8A%AC%EF%BC%8C%E5%B9%BC%E7%8A%AC%EF%BC%8C%E7%AB%99%E7%AB%8B&sign=d4e626e36acfc9f276d9fc19793f424d'
    ],
    ownerId: 'u1',
    specialNeeds: '需要定期训练和社交活动',
    vaccinated: true
  }
];

// 获取用户的宠物
export const getPetsByOwnerId = (ownerId: string): Pet[] => {
  return pets.filter(pet => pet.ownerId === ownerId);
};

// 根据ID获取宠物
export const getPetById = (id: string): Pet | undefined => {
  return pets.find(pet => pet.id === id);
};