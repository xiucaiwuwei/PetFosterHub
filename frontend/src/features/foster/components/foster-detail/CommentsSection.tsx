/**
 * 评论模块
 * 提供用户对服务的评论和评分功能，包括查看评论、发表评论、点赞、评分等
 */
import React, { useState } from 'react';
import { Send, ThumbsUp, ThumbsDown, X, Star } from 'lucide-react';
import type { FosterService } from '@/types';
import useCommentsSection from '../../hooks/useCommentsSection';

interface CommentsSectionProps {
  service: FosterService;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ service }) => {
  // 使用自定义hook处理数据逻辑
  const {
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
  } = useCommentsSection();

  return (
    <div className="mt-16 px-4 sm:px-6 lg:px-8">
      <div className="border-t border-gray-200 pt-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">用户评论 ({service.reviewsCount || 0})</h2>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900 mr-2">{service.rating || 0}</span>
              <div className="flex flex-col items-center">
                <div className="flex">
                  {renderStars(service.rating || 0)}
                </div>
                <span className="text-sm text-gray-500 mt-1">基于 {service.reviewsCount || 0} 条评论</span>
              </div>
            </div>
            <button
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition duration-200 flex items-center"
              onClick={() => setIsCommentModalOpen(true)}
            >
              发表评论 <Send className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 评论模态框 */}
        {isCommentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">添加您的评论</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => {
                    setIsCommentModalOpen(false);
                    setNewComment('');
                    setNewRating(5);
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">您的评分</label>
                  <div className="flex">
                    {Array(5).fill(0).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-6 h-6 cursor-pointer ${index < newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                        onClick={() => setNewRating(index + 1)}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-6 relative">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 resize-none"
                    placeholder="分享您的体验..."
                    rows={6}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value.slice(0, 200))}
                    maxLength={200}
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                    {newComment.length}/200
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition duration-200"
                    onClick={() => {
                      setIsCommentModalOpen(false);
                      setNewComment('');
                      setNewRating(5);
                    }}
                  >
                    取消
                  </button>
                  <button
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition duration-200 flex items-center"
                    onClick={() => {
                      handleSubmitComment();
                      setIsCommentModalOpen(false);
                    }}
                  >
                    提交评论 <Send className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 评论列表 */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无评论，成为第一个评论的用户吧！</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition duration-200">
                <div className="flex items-center mb-3">
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{comment.userName}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex mr-2">
                        {renderStars(comment.rating)}
                      </div>
                      <span>{comment.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors"
                    onClick={() => handleLike(comment.id)}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-1 ${comment.isLiked ? 'text-blue-500 fill-blue-500' : ''}`} />
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors"
                    onClick={() => handleDislike(comment.id)}
                  >
                    <ThumbsDown className={`w-4 h-4 mr-1 ${comment.isDisliked ? 'text-red-500 fill-red-500' : ''}`} />
                    <span>{comment.dislikes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};