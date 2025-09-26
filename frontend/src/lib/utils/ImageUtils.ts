/**
 * 图片工具类 - 提供图片加载、处理、压缩和验证等功能
 */
export class ImageUtils {
  /**
   * 加载图片
   * @param src 图片URL或DataURL
   * @returns Promise<HTMLImageElement> 图片加载完成的Promise
   */
  static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // 处理跨域图片
      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      
      img.src = src;
    });
  }

  /**
   * 将图片转换为DataURL
   * @param img HTMLImageElement 或 File 对象
   * @param type 图片类型，默认为'image/png'
   * @param quality 图片质量，范围0-1，默认为0.92
   * @returns Promise<string> DataURL字符串
   */
  static async toDataURL(
    img: HTMLImageElement | File,
    type: string = 'image/png',
    quality: number = 0.92
  ): Promise<string> {
    if (img instanceof File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(img);
      });
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    return canvas.toDataURL(type, quality);
  }

  /**
   * 调整图片尺寸
   * @param img HTMLImageElement 或图片URL
   * @param maxWidth 最大宽度
   * @param maxHeight 最大高度
   * @param keepAspectRatio 是否保持宽高比，默认为true
   * @returns Promise<HTMLImageElement> 调整后的图片
   */
  static async resizeImage(
    img: HTMLImageElement | string,
    maxWidth: number,
    maxHeight: number,
    keepAspectRatio: boolean = true
  ): Promise<HTMLImageElement> {
    const image = typeof img === 'string' ? await this.loadImage(img) : img;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    let newWidth = maxWidth;
    let newHeight = maxHeight;

    if (keepAspectRatio) {
      const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
      newWidth = Math.floor(image.width * ratio);
      newHeight = Math.floor(image.height * ratio);
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image, 0, 0, newWidth, newHeight);

    const resizedImage = new Image();
    resizedImage.src = canvas.toDataURL('image/png');
    
    return new Promise((resolve) => {
      resizedImage.onload = () => resolve(resizedImage);
    });
  }

  /**
   * 压缩图片
   * @param file 图片文件
   * @param maxSizeKB 最大文件大小（KB）
   * @param maxWidth 最大宽度，超出将调整尺寸
   * @returns Promise<File> 压缩后的文件
   */
  static async compressImage(
    file: File,
    maxSizeKB: number = 500,
    maxWidth: number = 2000
  ): Promise<File> {
    if (!file.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }

    const img = await this.loadImage(URL.createObjectURL(file));
    
    // 先调整尺寸
    if (img.width > maxWidth) {
      const resizedImg = await this.resizeImage(img, maxWidth, img.height * (maxWidth / img.width));
      img.src = resizedImg.src;
    }

    // 计算目标大小（字节）
    const maxSizeBytes = maxSizeKB * 1024;
    let quality = 0.9;
    
    // 通过二分法寻找最佳质量
    let minQuality = 0.1;
    let maxQuality = 1.0;
    let compressedDataUrl = '';
    
    // 创建画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // 最多尝试10次
    for (let i = 0; i < 10; i++) {
      compressedDataUrl = canvas.toDataURL(file.type, quality);
      
      // DataURL转换为字节数（不包括data:image/xxx;base64,前缀）
      const byteString = atob(compressedDataUrl.split(',')[1]);
      const bytesLength = byteString.length;
      
      if (bytesLength <= maxSizeBytes || Math.abs(maxQuality - minQuality) < 0.05) {
        break;
      }
      
      // 如果太大，降低质量；如果太小，提高质量
      if (bytesLength > maxSizeBytes) {
        maxQuality = quality;
        quality = (minQuality + maxQuality) / 2;
      } else {
        minQuality = quality;
        quality = (minQuality + maxQuality) / 2;
      }
    }

    // 将DataURL转换为File对象
    const blob = await (await fetch(compressedDataUrl)).blob();
    return new File([blob], file.name, { type: file.type });
  }

  /**
   * 生成图片预览URL
   * @param file 图片文件
   * @returns string 预览URL
   */
  static generatePreviewUrl(file: File): string {
    if (!file.type.startsWith('image/')) {
      throw new Error('File is not an image');
    }
    
    return URL.createObjectURL(file);
  }

  /**
   * 释放图片预览URL
   * @param url 预览URL
   */
  static revokePreviewUrl(url: string): void {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Failed to revoke object URL:', error);
    }
  }

  /**
   * 获取图片尺寸信息
   * @param src 图片URL或File对象
   * @returns Promise<{width: number, height: number}> 图片尺寸
   */
  static async getImageDimensions(src: string | File): Promise<{ width: number; height: number }> {
    let imageSrc: string;
    let cleanupFn: (() => void) | undefined;
    
    if (src instanceof File) {
      imageSrc = URL.createObjectURL(src);
      cleanupFn = () => URL.revokeObjectURL(imageSrc);
    } else {
      imageSrc = src;
    }

    try {
      const img = await this.loadImage(imageSrc);
      return { width: img.width, height: img.height };
    } finally {
      if (cleanupFn) {
        cleanupFn();
      }
    }
  }

  /**
   * 验证图片文件
   * @param file 图片文件
   * @param options 验证选项
   * @returns {isValid: boolean, message?: string} 验证结果
   */
  static validateImageFile(
    file: File,
    options: {
      maxSizeKB?: number;
      minWidth?: number;
      minHeight?: number;
      allowedTypes?: string[];
    } = {}
  ): { isValid: boolean; message?: string } {
    const { maxSizeKB = 10240, allowedTypes = [] } = options;
    
    // 检查是否为图片文件
    if (!file.type.startsWith('image/')) {
      return { isValid: false, message: '文件不是有效的图片格式' };
    }
    
    // 检查文件类型是否在允许的列表中
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { isValid: false, message: `不支持的图片格式，仅支持${allowedTypes.join(', ')}` };
    }
    
    // 检查文件大小
    if (file.size > maxSizeKB * 1024) {
      return { isValid: false, message: `文件大小不能超过${maxSizeKB}KB` };
    }
    
    // 对于尺寸检查，需要异步操作，这里不执行
    // 如果需要完整尺寸检查，请使用validateImageFileAsync方法
    
    return { isValid: true };
  }

  /**
   * 异步验证图片文件（包括尺寸检查）
   * @param file 图片文件
   * @param options 验证选项
   * @returns Promise<{isValid: boolean, message?: string}> 验证结果
   */
  static async validateImageFileAsync(
    file: File,
    options: {
      maxSizeKB?: number;
      minWidth?: number;
      minHeight?: number;
      allowedTypes?: string[];
    } = {}
  ): Promise<{ isValid: boolean; message?: string }> {
    // 先进行基本验证
    const basicValidation = this.validateImageFile(file, options);
    if (!basicValidation.isValid) {
      return basicValidation;
    }
    
    const { minWidth = 0, minHeight = 0 } = options;
    
    // 如果不需要尺寸检查，直接返回有效
    if (minWidth <= 0 && minHeight <= 0) {
      return { isValid: true };
    }
    
    try {
      // 检查图片尺寸
      const { width, height } = await this.getImageDimensions(file);
      
      if (width < minWidth || height < minHeight) {
        return { 
          isValid: false, 
          message: `图片尺寸不能小于${minWidth}x${minHeight}像素` 
        };
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, message: '图片尺寸验证失败' };
    }
  }

  /**
   * 从图片URL提取文件名
   * @param url 图片URL
   * @returns string 文件名
   */
  static extractFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
      return filename || 'image';
    } catch (error) {
      // 如果URL解析失败，尝试从字符串中提取
      const parts = url.split('/');
      return parts[parts.length - 1] || 'image';
    }
  }

  /**
   * 创建图片加载错误处理器
   * @param fallbackImageUrl 加载失败时显示的备用图片URL
   * @returns (event: Event) => void 错误处理函数
   */
  static createImageErrorHandler(fallbackImageUrl: string): (event: Event) => void {
    return (event: Event) => {
      const target = event.target as HTMLImageElement;
      if (target.src !== fallbackImageUrl) {
        target.src = fallbackImageUrl;
      }
    };
  }
}

export default ImageUtils;