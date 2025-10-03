/**
 * 寄养服务评论区相关的自定义Hook
 * 封装评论数据管理、点赞点踩和评论提交等逻辑
 */
import { useState, useCallback } from 'react';
import React from 'react';
import { Star } from 'lucide-react';
import type { FosterService } from '@/types';

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface UseCommentsSectionResult {
  comments: Comment[];
  newComment: string;
  newRating: number;
  isCommentModalOpen: boolean;
  renderStars: (rating: number) => React.ReactNode;
  handleLike: (commentId: string) => void;
  handleDislike: (commentId: string) => void;
  handleSubmitComment: () => void;
  setNewComment: (value: string) => void;
  setNewRating: (value: number) => void;
  setIsCommentModalOpen: (value: boolean) => void;
}

/**
 * 寄养服务评论区的自定义Hook
 * 封装评论数据管理、点赞点踩和评论提交等逻辑
 * @returns 评论区相关的状态和操作函数
 */
export const useCommentsSection = (): UseCommentsSectionResult => {
  // 评论数据状态
  const [comments, setComments] = useState<Comment[]>([
    // 模拟评论数据
    {
      id: '1',
      userName: '张先生',
      userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F&sign=123456',
      rating: 5,
      content: '服务非常好，照顾我的猫咪很细心，每天都会发送照片反馈，非常放心！',
      date: '2023-10-15',
      likes: 12,
      dislikes: 0
    },
    {
      id: '2',
      userName: '李女士',
      userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F&sign=654321',
      rating: 4,
      content: '整体不错，环境干净整洁，工作人员也很热情。只是我家狗狗比较调皮，希望能多一点耐心。',
      date: '2023-10-10',
      likes: 8,
      dislikes: 1
    }
  ]);
  
  // 新评论相关状态
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // 渲染星级评分
  const renderStars = useCallback((rating: number): React.ReactNode => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ));
  }, []);

  // 处理点赞
  const handleLike = useCallback((commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (comment.isLiked) {
          // 取消点赞
          return { ...comment, likes: comment.likes - 1, isLiked: false };
        } else {
          // 点赞，如果之前点了踩则取消踩
          const newLikes = comment.likes + 1;
          const newDislikes = comment.isDisliked ? comment.dislikes - 1 : comment.dislikes;
          return { ...comment, likes: newLikes, dislikes: newDislikes, isLiked: true, isDisliked: false };
        }
      }
      return comment;
    }));
  }, [comments]);

  // 处理点踩
  const handleDislike = useCallback((commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (comment.isDisliked) {
          // 取消点踩
          return { ...comment, dislikes: comment.dislikes - 1, isDisliked: false };
        } else {
          // 点踩，如果之前点了赞则取消赞
          const newDislikes = comment.dislikes + 1;
          const newLikes = comment.isLiked ? comment.likes - 1 : comment.likes;
          return { ...comment, dislikes: newDislikes, likes: newLikes, isDisliked: true, isLiked: false };
        }
      }
      return comment;
    }));
  }, [comments]);

  // 提交新评论
  const handleSubmitComment = useCallback(() => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      userName: '当前用户',
      userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F&sign=789012',
      rating: newRating,
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setNewRating(5);
  }, [newComment, newRating, comments]);

  return {
    comments,
    newComment,
    newRating,
    isCommentModalOpen,
    renderStars,
    handleLike,
    handleDislike,
    handleSubmitComment,
    setNewComment,
    setNewRating,
    setIsCommentModalOpen
  };
};

export default useCommentsSection;