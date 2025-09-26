import { Message } from '@/types';
import { users } from './users';

// 生成模拟日期
const createDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// 生成随机时间
const randomTime = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(Math.floor(Math.random() * 12) + 8); // 8am-8pm
  newDate.setMinutes(Math.floor(Math.random() * 60));
  return newDate;
};

// 模拟消息数据
export const messages: Message[] = [
  // 与张明的对话
  {
    id: 'm1',
    conversationId: 'c1',
    senderId: 'u1',
    receiverId: 'u4',
    content: '您好！我看到您对我的寄养服务感兴趣，请问您需要寄养多长时间？',
    createdAt: randomTime(createDate(2)),
    isRead: true
  },
  {
    id: 'm2',
    conversationId: 'c1',
    senderId: 'u4',
    receiverId: 'u1',
    content: '您好！我计划出差5天，从下周一到下周五，请问有空位吗？',
    createdAt: randomTime(createDate(2)),
    isRead: true
  },
  {
    id: 'm3',
    conversationId: 'c1',
    senderId: 'u1',
    receiverId: 'u4',
    content: '有的，我下周一到周五有空位。您的宠物有什么特殊需求吗？',
    createdAt: randomTime(createDate(1)),
    isRead: true
  },
  
  // 与李华的对话
  {
    id: 'm4',
    conversationId: 'c2',
    senderId: 'u2',
    receiverId: 'u4',
    content: '您好！您之前咨询的猫咪寄养服务，我可以提供上门接送服务。',
    createdAt: randomTime(createDate(3)),
    isRead: true
  },
  {
    id: 'm5',
    conversationId: 'c2',
    senderId: 'u4',
    receiverId: 'u2',
    content: '太好了！接送服务需要额外付费吗？',
    createdAt: randomTime(createDate(3)),
    isRead: true
  },
  
  // 与王芳的新消息
  {
    id: 'm6',
    conversationId: 'c3',
    senderId: 'u3',
    receiverId: 'u4',
    content: '您好！我看到您预约了下下周的猫咪寄养，想确认一下您的猫咪是否有特殊饮食需求？',
    createdAt: randomTime(createDate(0)),
    isRead: false
  }
];

// 获取所有对话
export const getConversations = (userId: string) => {
  // 按conversationId分组
  const conversationsMap = new Map<string, Message[]>();
  
  messages.forEach(message => {
    if (message.senderId === userId || message.receiverId === userId) {
      if (!conversationsMap.has(message.conversationId)) {
        conversationsMap.set(message.conversationId, []);
      }
      conversationsMap.get(message.conversationId)!.push(message);
    }
  });
  
  // 转换为数组并排序
  const conversations = Array.from(conversationsMap.values())
    .map(msgs => {
      // 获取对方用户ID
      const otherUserId = msgs[0].senderId === userId ? msgs[0].receiverId : msgs[0].senderId;
      // 查找对方用户信息
      const otherUser = users.find(u => u.id === otherUserId);
      // 获取最新消息
      const lastMessage = [...msgs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      // 未读消息数量
      const unreadCount = msgs.filter(m => m.receiverId === userId && !m.isRead).length;
      
      return {
        conversationId: msgs[0].conversationId,
        otherUser,
        lastMessage,
        unreadCount,
        messages: msgs
      };
    })
    // 按最新消息时间排序
    .sort((a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime());
  
  return conversations;
};

// 获取特定对话的所有消息
export const getMessagesByConversationId = (conversationId: string) => {
  return messages.filter(message => message.conversationId === conversationId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};

// 发送新消息
export const sendMessage = (conversationId: string, senderId: string, receiverId: string, content: string): Message => {
  const newMessage: Message = {
    id: `m${messages.length + 1}`,
    conversationId,
    senderId,
    receiverId,
    content,
    createdAt: new Date(),
    isRead: false
  };
  
  messages.push(newMessage);
  return newMessage;
};

// 标记消息为已读
export const markAsRead = (conversationId: string, userId: string) => {
  messages.forEach(message => {
    if (message.conversationId === conversationId && message.receiverId === userId) {
      message.isRead = true;
    }
  });
};
