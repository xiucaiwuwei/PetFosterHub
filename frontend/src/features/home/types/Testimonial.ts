/**
 * 用户评价接口
 * 用于展示用户对寄养服务的评价信息
 */
export interface Testimonial {
    /**
     * 评价ID
     */
    id: string;
    
    /**
     * 用户名称
     */
    name: string;
    
    /**
     * 用户头像URL
     */
    avatar: string;
    
    /**
     * 评价内容
     */
    content: string;
    
    /**
     * 评分等级（1-5分）
     */
    rating: number;
}