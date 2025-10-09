/**
 * 对话面板组件
 */
import React from 'react';
import { motion } from 'framer-motion';
import { DialogMessageList } from '../dialog/message/DialogMessageList';
import { MessageInput } from '../dialog/input/MessageInput';
import { ConversationHeader } from '../dialog/header/ConversationHeader';
import type { Message } from '../../types/entity/Message';
import type { UserInfo } from '../../types/entity/Conversation';

interface ConversationPanelProps {
  selectedConversation: {
    conversationId: string;
    otherUser: UserInfo;
  } | undefined;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onSendImage: (file: File, caption?: string) => Promise<void>;
  error: string;
  onClose?: () => void;
  isBlocked?: boolean;
  onToggleBlock?: (blocked: boolean) => void;
  typingUsers?: Map<string, boolean>;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  selectedConversation,
  messages,
  isLoading,
  onSendMessage,
  onSendImage,
  error,
  onClose,
  isBlocked = false,
  onToggleBlock,
  typingUsers = new Map(),
}) => {
  // 控制右侧抽屉开关的状态
  const [isOptionsDrawerOpen, setIsOptionsDrawerOpen] = React.useState(false);

  // 切换抽屉状态的处理函数
  const handleToggleOptionsDrawer = () => {
    setIsOptionsDrawerOpen(!isOptionsDrawerOpen);
  };
  if (!selectedConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-6xl mb-4 text-gray-200">💬</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">选择一个对话开始聊天</h2>
        <p className="text-gray-500 max-w-md">
          从左侧列表中选择一个对话，或者开始一个新的对话与宠物主人交流
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="h-full flex flex-col bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ConversationHeader
        otherUser={selectedConversation.otherUser}
        showBackButton={true}
        isOptionsDrawerOpen={isOptionsDrawerOpen}
        onToggleOptionsDrawer={handleToggleOptionsDrawer}
        {...(onClose && { onBack: onClose })}
      />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <DialogMessageList 
        messages={messages} 
        isLoading={isLoading} 
        isOptionsDrawerOpen={isOptionsDrawerOpen}
        onToggleOptionsDrawer={handleToggleOptionsDrawer}
        isBlocked={isBlocked}
        typingUsers={typingUsers}
        {...(onToggleBlock && { onToggleBlock })}
      />
      <MessageInput 
        onSendMessage={onSendMessage} 
        onSendImage={onSendImage} 
        disabled={isBlocked}
      />
    </motion.div>
  );
};