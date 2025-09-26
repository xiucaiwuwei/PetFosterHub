/**
 * 对话列表组件
 */
import { Conversation } from '../types/entity';
import { formatDate } from '../utils/validationUtils';
import { cn } from '@/lib/utils';

/**
 * 对话列组件的属性接口
 */
export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  currentUserId: string;
  className?: string;
}

/**
 * 对话列表组件
 */
export const ConversationList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation, 
  currentUserId, 
  className = '' 
}: ConversationListProps) => {
  return (
    <div className={cn('divide-y divide-gray-200', className)}>
      {conversations.map((conversation) => (
        <button
          key={conversation.conversationId}
          onClick={() => onSelectConversation(conversation)}
          className={cn(
            'w-full flex items-start p-4 text-left hover:bg-gray-50 transition-colors duration-150 ease-in-out',
            selectedConversationId === conversation.conversationId 
              ? 'bg-orange-50 border-l-4 border-orange-500' 
              : ''
          )}
        >
          <img
            src={conversation.otherUser.avatar}
            alt={conversation.otherUser.name}
            className="w-12 h-12 rounded-full object-cover mr-3 flex-shrink-0"
          />
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-gray-900 truncate">{conversation.otherUser.name}</h3>
              <span className="text-xs text-gray-500">
                {formatDate(new Date(conversation.lastMessage.createdAt))}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {conversation.lastMessage.senderId === currentUserId ? '我: ' : ''}
              {conversation.lastMessage.content}
            </p>
          </div>
          {conversation.unreadCount > 0 && (
            <span className="ml-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
              {conversation.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};