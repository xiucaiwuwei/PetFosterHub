import { productApi } from '../api/productApi';
import type { PetProduct } from '@/features/petStore/types';
import type { ProductCategory } from '@/features/petStore/types';
import type { ProductSortOption } from '@/features/petStore/types';
import type { ProductResponseDto } from '@/features/petStore/types';

interface GetProductsParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  category?: ProductCategory;
  sortBy?: ProductSortOption;
}

interface GetProductsResult {
  items: PetProduct[];
  total: number;
  page: number;
  pageSize: number;
}

class ProductService {
  // 获取商品列表
  async getProducts(params: GetProductsParams): Promise<GetProductsResult> {
    try {
      const response = await productApi.getProducts({
        page: params.page,
        pageSize: params.pageSize,
        searchTerm: params.searchTerm,
        category: params.category,
        sortBy: params.sortBy
      });
      
      // 转换DTO到实体
      const items = response.data.items.map((item: ProductResponseDto) => this.transformToEntity(item));
      
      return {
        items,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize
      };
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  }

  // 获取商品详情
  async getProductDetail(id: string): Promise<PetProduct> {
    try {
      const response = await productApi.getProductDetail(id);
      return this.transformToEntity(response.data);
    } catch (error) {
      console.error('Failed to get product detail:', error);
      throw error;
    }
  }

  // 添加商品到购物车
  async addToCart(productId: string, quantity: number): Promise<void> {
    try {
      await productApi.addToCart({
        productId,
        quantity
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  }

  // 创建订单
  async createOrder(productIds: string[], quantities: number[]): Promise<string> {
    try {
      const orderItems = productIds.map((id, index) => ({
        productId: id,
        quantity: quantities[index]
      }));
      
      const response = await productApi.createOrder({ items: orderItems });
      return response.data.orderId;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // 转换DTO到实体
  private transformToEntity(dto: ProductResponseDto): PetProduct {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      detailDescription: dto.detailDescription,
      price: dto.price,
      originalPrice: dto.originalPrice,
      discount: dto.discount,
      stock: dto.stock,
      mainImage: dto.mainImage,
      secondaryImages: dto.secondaryImages,
      category: dto.category,
      specifications: dto.specifications,
      isNew: dto.isNew,
      isBestseller: dto.isBestseller,
      rating: dto.rating,
      reviewCount: dto.reviewCount,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };
  }
}

export const productService = new ProductService();