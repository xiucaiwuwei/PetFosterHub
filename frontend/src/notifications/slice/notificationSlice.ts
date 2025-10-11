import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import { toast } from 'sonner';
import { NotificationService } from '../services';
import type { Notification } from '../types';

/**
 * 通知模块状态接口
 */
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * 初始状态
 */
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
};

/**
 * 获取通知列表的异步thunk
 */
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (params?: {
    page?: number;
    size?: number;
    isRead?: boolean;
    type?: string;
  }) => {
    return await NotificationService.getNotifications(params);
  }
);

/**
 * 获取未读通知数量的异步thunk
 */
export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async () => {
    try {
      const notifications = await NotificationService.getNotifications({ isRead: false });
      return notifications.length;
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      throw error;
    }
  }
);

/**
 * 标记单个通知为已读的异步thunk
 */
export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId);
    return notificationId;
  }
);

/**
 * 标记所有通知为已读的异步thunk
 */
export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async () => {
    await NotificationService.markAllAsRead();
  }
);

/**
 * 删除单个通知的异步thunk
 */
export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: string) => {
    await NotificationService.deleteNotification(notificationId);
    return notificationId;
  }
);

/**
 * 批量删除通知的异步thunk
 */
export const deleteNotifications = createAsyncThunk(
  'notification/deleteNotifications',
  async (notificationIds: string[]) => {
    await NotificationService.deleteNotifications(notificationIds);
    return notificationIds;
  }
);

/**
 * 通知模块slice
 */
export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    /**
     * 清除通知错误状态
     */
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取通知列表
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
      state.isLoading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(notification => !notification.isRead).length;
    });
    
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || '获取通知列表失败';
      toast.error(state.error);
    });
    
    // 获取未读通知数量
    builder.addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    });
    
    // 标记单个通知为已读
    builder.addCase(markNotificationAsRead.pending, (state) => {
      state.error = null;
    });
    
    builder.addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });
    
    builder.addCase(markNotificationAsRead.rejected, (state, action) => {
      state.error = action.error.message || '标记通知已读失败';
      toast.error(state.error);
    });
    
    // 标记所有通知为已读
    builder.addCase(markAllNotificationsAsRead.pending, (state) => {
      state.error = null;
    });
    
    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    });
    
    builder.addCase(markAllNotificationsAsRead.rejected, (state, action) => {
      state.error = action.error.message || '标记所有通知已读失败';
      toast.error(state.error);
    });
    
    // 删除单个通知
    builder.addCase(deleteNotification.pending, (state) => {
      state.error = null;
    });
    
    builder.addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
      const notificationIndex = state.notifications.findIndex(n => n.id === action.payload);
      if (notificationIndex !== -1) {
        const deletedNotification = state.notifications[notificationIndex];
        if (!deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(notificationIndex, 1);
      }
    });
    
    builder.addCase(deleteNotification.rejected, (state, action) => {
      state.error = action.error.message || '删除通知失败';
      toast.error(state.error);
    });
    
    // 批量删除通知
    builder.addCase(deleteNotifications.pending, (state) => {
      state.error = null;
    });
    
    builder.addCase(deleteNotifications.fulfilled, (state, action: PayloadAction<string[]>) => {
      const deletedIds = new Set(action.payload);
      
      // 更新未读数量
      const deletedUnreadCount = state.notifications
        .filter(n => deletedIds.has(n.id) && !n.isRead)
        .length;
      state.unreadCount = Math.max(0, state.unreadCount - deletedUnreadCount);
      
      // 删除通知
      state.notifications = state.notifications.filter(n => !deletedIds.has(n.id));
    });
    
    builder.addCase(deleteNotifications.rejected, (state, action) => {
      state.error = action.error.message || '批量删除通知失败';
      toast.error(state.error);
    });
  },
});

// 导出actions
export const { clearNotificationError } = notificationSlice.actions;

// 导出selectors
export const selectNotifications = (state: RootState) => state.notification.notifications;
export const selectUnreadCount = (state: RootState) => state.notification.unreadCount;
export const selectNotificationLoading = (state: RootState) => state.notification.isLoading;
export const selectNotificationError = (state: RootState) => state.notification.error;

export default notificationSlice.reducer;