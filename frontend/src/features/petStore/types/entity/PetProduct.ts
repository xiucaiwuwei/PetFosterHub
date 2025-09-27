import type { ProductCategory } from '../enums/ProductCategory';

// 商品规格参数接口
export interface ProductSpecification {
  name: string;
  value: string;
}

// 宠物产品实体接口
export interface PetProduct {
  id: string;
  name: string;
  description: string;
  detailDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  mainImage: string;
  secondaryImages?: string[];
  category: ProductCategory;
  specifications?: ProductSpecification[];
  isNew: boolean;
  isBestseller: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}