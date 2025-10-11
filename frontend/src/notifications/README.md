# 通知模块

## 目录结构

通知模块按照与项目中其他功能模块（如features/user）一致的结构组织，便于维护和扩展。

```
notifications/
├── components/          # UI组件
│   ├── Notification.tsx             # 单个通知组件
│   ├── NotificationsList.tsx        # 通知列表组件
│   ├── NotificationsContainer.tsx   # 通知容器组件
│   └── index.ts                     # 组件导出入口
├── contexts/            # 上下文管理
│   └── NotificationsContext.tsx     # 通知上下文及状态管理
├── hooks/               # 自定义hooks
│   ├── index.ts                     # hooks导出入口
│   ├── useNotifications.ts          # 通知上下文hook
│   └── useNotificationService.ts    # 通知服务hook
├── types/               # 类型定义
│   ├── dto/                         # 数据传输对象
│   │   ├── NotificationContextType.ts
│   │   └── index.ts
│   ├── entity/                      # 实体类型
│   │   ├── Notification.ts
│   │   └── index.ts
│   ├── enums/                       # 枚举类型
│   │   ├── NotificationType.ts
│   │   └── index.ts
│   └── index.ts                     # 类型导出入口
├── index.ts             # 模块主入口
└── README.md            # 模块说明文档
```

## 功能说明

这是一个功能完整的通知系统，用于在应用中显示各类通知信息。主要功能包括：

- 支持多种通知类型（成功、错误、警告、信息、默认）
- 自动关闭和手动关闭功能
- 未读状态管理
- 点击事件处理
- 响应式设计和美观的UI
- 自动关闭进度条指示器

## 使用方法

### 1. 包装应用

在应用入口文件中使用 `NotificationsProvider` 包装整个应用：

```tsx
import { NotificationsProvider } from './notifications';

function App() {
  return (
    <NotificationsProvider>
      {/* 你的应用内容 */}
    </NotificationsProvider>
  );
}
```

### 2. 添加通知容器

在应用中添加 `NotificationsContainer` 组件来显示通知：

```tsx
import { NotificationsContainer } from './notifications';

function App() {
  return (
    <NotificationsProvider>
      {/* 你的应用内容 */}
      <NotificationsContainer />
    </NotificationsProvider>
  );
}
```

### 3. 显示通知

使用 `useNotificationService` hook 来显示通知：

```tsx
import { useNotificationService } from './notifications';

function MyComponent() {
  const notificationService = useNotificationService();

  const showSuccessNotification = () => {
    notificationService.showSuccess('操作成功！', {
      title: '成功',
      duration: 3000, // 3秒后自动关闭
      onClick: () => console.log('通知被点击')
    });
  };

  // 其他类型的通知
  const showErrorNotification = () => {
    notificationService.showError('操作失败，请重试', { title: '错误' });
  };

  const showWarningNotification = () => {
    notificationService.showWarning('警告信息');
  };

  const showInfoNotification = () => {
    notificationService.showInfo('提示信息');
  };

  return (
    <div>
      <button onClick={showSuccessNotification}>显示成功通知</button>
      <button onClick={showErrorNotification}>显示错误通知</button>
    </div>
  );
}
```

## 自定义配置

### 自定义通知容器位置

通过 className 属性自定义通知容器的位置和样式：

```tsx
<NotificationsContainer className="fixed bottom-4 left-4" />
```

### 自定义通知持续时间

每个通知都可以设置不同的持续时间（毫秒）：

```tsx
notificationService.showSuccess('操作成功！', {
  duration: 10000, // 10秒后自动关闭
});

// 设置为0可以禁用自动关闭
notificationService.showError('操作失败', {
  duration: 0, // 不会自动关闭
});
```