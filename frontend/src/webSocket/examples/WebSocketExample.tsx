import React, { useState, useCallback } from 'react';
import {
  useWebSocket,
  ConnectionStatus
} from '../index';
import type { Message } from '@/features/messages/types/entity/Message';
import type { Conversation } from '@/features/messages/types/entity/Conversation';

/**
 * WebSocket模块使用示例
 * 展示如何在React组件中集成和使用WebSocket功能
 */
export const WebSocketExample: React.FC = () => {
  // 用户ID（实际应用中应该从认证状态获取）
  const userId = 'current-user-id';

  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 自定义WebSocket配置（可选）

  // 处理新消息
  const handleNewMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);

    // 自动发送已读确认
    if (message.receiverId === userId) {
      sendReadReceipt(message.conversationId, [message.id]);
    }
  }, [userId]);

  // 处理对话更新
  const handleConversationUpdate = useCallback((conversation: Conversation) => {
    setConversations(prev => {
      const index = prev.findIndex(c => c.conversationId === conversation.conversationId);
      if (index >= 0) {
        const newConversations = [...prev];
        newConversations[index] = conversation;
        return newConversations;
      } else {
        return [...prev, conversation];
      }
    });
  }, []);

  // 使用WebSocket Hook
  const {
    status,
    connectionError,
    currentUserStatus,
    connect,
    disconnect,
    sendReadReceipt,
    sendTypingStatus
  } = useWebSocket(userId, handleNewMessage, handleConversationUpdate);

  // 连接到WebSocket
  const handleConnect = async () => {
    try {
      await connect();
      console.log('WebSocket连接成功');
    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  };

  // 断开WebSocket连接
  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log('WebSocket断开成功');
    } catch (error) {
      console.error('WebSocket断开失败:', error);
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversationId) return;

    try {
      // 这里应该调用应用的消息API发送消息
      // 实际应用中，消息发送后会通过WebSocket接收到新消息的推送
      const messageData = {
        conversationId: currentConversationId,
        content: messageInput.trim(),
        type: 'TEXT'
      };

      // 假设这里有一个发送消息的API调用
      console.log('发送消息:', messageData);

      // 清空输入框
      setMessageInput('');
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    // 处理正在输入状态
    if (currentConversationId) {
      const newIsTyping = value.trim().length > 0;
      if (newIsTyping !== isTyping) {
        setIsTyping(newIsTyping);

        // 发送输入状态
        sendTypingStatus(currentConversationId, newIsTyping)
          .catch(error => console.error('发送输入状态失败:', error));
      }
    }
  };

  // 渲染连接状态
  const renderConnectionStatus = () => {
    switch (status) {
      case ConnectionStatus.CONNECTED:
        return <span style={{ color: 'green' }}>已连接</span>;
      case ConnectionStatus.CONNECTING:
        return <span style={{ color: 'orange' }}>连接中...</span>;
      case ConnectionStatus.DISCONNECTED:
        return <span style={{ color: 'gray' }}>已断开</span>;
      case ConnectionStatus.DISCONNECTING:
        return <span style={{ color: 'orange' }}>断开中...</span>;
      case ConnectionStatus.FAILED:
        return <span style={{ color: 'red' }}>连接失败</span>;
      default:
        return <span>未知状态</span>;
    }
  };

  // 渲染错误信息
  const renderError = () => {
    if (connectionError) {
      return (
        <div style={{ color: 'red', marginTop: '10px' }}>
          错误: {connectionError.message}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>WebSocket示例应用</h1>

      <div style={{ marginBottom: '20px' }}>
        <p>连接状态: {renderConnectionStatus()}</p>
        <button
          onClick={handleConnect}
          disabled={status === ConnectionStatus.CONNECTED || status === ConnectionStatus.CONNECTING}
          style={{ marginRight: '10px' }}
        >
          连接
        </button>
        <button
          onClick={handleDisconnect}
          disabled={status === ConnectionStatus.DISCONNECTED || status === ConnectionStatus.DISCONNECTING}
        >
          断开
        </button>
        {renderError()}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>对话列表</h3>
        {conversations.length > 0 ? (
          <ul>
            {conversations.map(conversation => (
              <li key={conversation.conversationId}>
                <button
                  onClick={() => setCurrentConversationId(conversation.conversationId)}
                  style={{ fontWeight: currentConversationId === conversation.conversationId ? 'bold' : 'normal' }}
                >
                  {conversation.otherUser?.name || '未命名对话'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>暂无对话</p>
        )}
      </div>

      {currentConversationId && (
        <div>
          <h3>消息列表</h3>
          <div style={{ height: '300px', border: '1px solid #ccc', padding: '10px', overflowY: 'auto', marginBottom: '10px' }}>
            {messages.filter(msg => msg.conversationId === currentConversationId).map(message => (
              <div key={message.id} style={{ marginBottom: '10px' }}>
                <p><strong>{message.senderId === userId ? '我' : '对方'}:</strong> {message.content}</p>
                <small style={{ color: 'gray' }}>时间: {new Date(message.createdAt).toLocaleString()}</small>
                {message.isRead && <small style={{ marginLeft: '10px', color: 'blue' }}>已读</small>}
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入消息..."
              style={{ width: '80%', padding: '8px' }}
            />
            <button onClick={handleSendMessage} style={{ padding: '8px 16px', marginLeft: '10px' }}>
              发送
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>用户状态</h3>
        {Array.from(currentUserStatus.entries()).length > 0 ? (
          <ul>
            {Array.from(currentUserStatus.entries()).map(([userId, status]) => (
              <li key={userId}>
                用户 {userId}: {status}
              </li>
            ))}
          </ul>
        ) : (
          <p>暂无用户状态信息</p>
        )}
      </div>
    </div>
  );
};