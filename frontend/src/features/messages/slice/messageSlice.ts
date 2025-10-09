/**
 * 消息模块Redux状态管理
 */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types/entity/Message';
import { Conversation } from '../types/entity/Conversation';
import { GetMessagesDto, SendMessageDto } from '../types/dto';
import { MessageService } from '../services';
import { toast } from 'sonner';

/**
 * 消息模块状态接口
 */
export interface MessageState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 初始状态
 */
const initialState: MessageState = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  isLoading: false,
  error: null
};

/**
 * 获取对话列表的异步thunk
 */
export const fetchConversations = createAsyncThunk(
  'message/fetchConversations',
  async (userId: string) => {
    return await MessageService.getUserConversations(userId);
  }
);

/**
 * 获取消息列表的异步thunk
 */
export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (dto: GetMessagesDto) => {
    return await MessageService.getConversationMessages(dto);
  }
);

/**
 * 发送消息的异步thunk
 */
export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async (dto: SendMessageDto) => {
    return await MessageService.sendMessage(dto);
  }
);

/**
 * 发送图片消息的异步thunk
 */
export const sendImageMessage = createAsyncThunk(
  'message/sendImageMessage',
  async (
    { 
      conversationId, 
      senderId, 
      receiverId, 
      file, 
      caption 
    }: {
      conversationId: string;
      senderId: string;
      receiverId: string;
      file: File;
      caption?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const message = await MessageService.sendImageMessage(
        conversationId,
        senderId,
        receiverId,
        file,
        caption
      );
      return message;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '发送图片失败');
    }
  }
);

/**
 * 标记消息为已读的异步thunk
 */
export const markConversationAsRead = createAsyncThunk(
  'message/markConversationAsRead',
  async ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    await MessageService.markConversationAsRead(conversationId, userId);
    return conversationId;
  }
);

/**
 * 消息模块slice
 */
export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    /**
     * 设置选中的对话
     */
    setSelectedConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.selectedConversation = action.payload;
    },
    
    /**
     * 清空消息模块状态
     */
    clearMessageState: (state) => {
      state.conversations = [];
      state.selectedConversation = null;
      state.messages = [];
      state.error = null;
    },
    
    /**
     * 添加新消息到当前对话
     */
    addNewMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    }
  },
  
  extraReducers: (builder) => {
    // 获取对话列表
    builder.addCase(fetchConversations.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(fetchConversations.fulfilled, (state, action: PayloadAction<Conversation[]>) => {
      state.isLoading = false;
      state.conversations = action.payload;
    });
    
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || '获取对话列表失败';
      toast.error(state.error);
    });
    
    // 获取消息列表
    builder.addCase(fetchMessages.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(fetchMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
      state.isLoading = false;
      state.messages = action.payload;
    });
    
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || '获取消息列表失败';
      toast.error(state.error);
    });
    
    // 发送消息
    builder.addCase(sendMessage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(sendMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      state.isLoading = false;
      state.messages.push(action.payload);
      
      // 更新对话列表中的最后一条消息
      if (state.selectedConversation) {
        state.conversations = MessageService.updateConversationLastMessage(
          state.conversations,
          state.selectedConversation.conversationId,
          action.payload
        );
      }
    });
    
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || '发送消息失败';
      toast.error(state.error);
    });
    
    // 发送图片消息
    builder.addCase(sendImageMessage.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(sendImageMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      state.isLoading = false;
      state.messages.push(action.payload);
      
      // 更新对话列表中的最后一条消息
      if (state.selectedConversation) {
        state.conversations = MessageService.updateConversationLastMessage(
          state.conversations,
          state.selectedConversation.conversationId,
          action.payload
        );
      }
    });
    
    builder.addCase(sendImageMessage.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || '发送图片失败';
      toast.error(state.error);
    });
    
    // 标记消息为已读
    builder.addCase(markConversationAsRead.fulfilled, (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.map(conv => 
        conv.conversationId === action.payload 
          ? { ...conv, unreadCount: 0 } 
          : conv
      );
    });
  }
});

// 导出actions
export const { setSelectedConversation, clearMessageState, addNewMessage } = messageSlice.actions;

// 导出reducer
export default messageSlice.reducer;