// 用户角色枚举
export enum UserRole {
  OWNER = 'OWNER',
  PROVIDER = 'PROVIDER',
  BUSINESS = 'BUSINESS',
  VETERINARIAN = 'VETERINARIAN',
  ADMIN = 'ADMIN'
}

// 用户信息接口
export interface UserInfo {
  name: string;
  role?: string;
}

// 对话接口
export interface Conversation {
  otherUser: UserInfo;
  [key: string]: any;
}

/**
 * 获取用户角色显示文本
 * @param conversation 对话对象
 * @returns 用户角色显示文本
 */
export const getUserRoleDisplay = (conversation: Conversation): string => {
  const userName = conversation.otherUser.name;
  const userRole = conversation.otherUser.role;
  
  // 如果角色信息存在，则根据UserRole枚举映射显示文本
  if (userRole) {
    const normalizedRole = userRole.toUpperCase();
    
    if (normalizedRole === UserRole.OWNER || normalizedRole === 'OWNER') {
      return '宠物主人';
    } else if (normalizedRole === UserRole.PROVIDER || normalizedRole === 'PROVIDER' || normalizedRole === 'FOSTER') {
      return '寄养提供者';
    } else if (normalizedRole === UserRole.BUSINESS || normalizedRole === 'BUSINESS') {
      return '商家';
    } else if (normalizedRole === UserRole.VETERINARIAN || normalizedRole === 'VETERINARIAN') {
      return '兽医';
    } else if (normalizedRole === UserRole.ADMIN || normalizedRole === 'ADMIN') {
      return '管理员';
    }
    
    return '';
  }
  
  // 为了演示不同角色的颜色效果，我们根据用户名的第一个字符来分配不同的角色
  const firstChar = userName.charAt(0).toLowerCase();
  
  if (['a', 'b', 'c', 'd', 'e'].includes(firstChar)) {
    return '宠物主人';
  } else if (['f', 'g', 'h', 'i', 'j'].includes(firstChar)) {
    return '寄养提供者';
  } else if (['k', 'l', 'm', 'n', 'o'].includes(firstChar)) {
    return '商家';
  } else if (['p', 'q', 'r', 's', 't'].includes(firstChar)) {
    return '兽医';
  } else {
    return '管理员';
  }
};

/**
 * 获取角色对应的样式类
 * @param conversation 对话对象
 * @returns CSS类名
 */
export const getRoleStyleClass = (conversation: Conversation): string => {
  const userName = conversation.otherUser.name;
  const userRole = conversation.otherUser.role;
  
  // 根据角色返回不同的CSS类
  if (userRole) {
    const normalizedRole = userRole.toUpperCase();
    
    if (normalizedRole === UserRole.OWNER || normalizedRole === 'OWNER') {
      return 'bg-green-100 text-green-800';
    } else if (normalizedRole === UserRole.PROVIDER || normalizedRole === 'PROVIDER' || normalizedRole === 'FOSTER') {
      return 'bg-blue-100 text-blue-800';
    } else if (normalizedRole === UserRole.BUSINESS || normalizedRole === 'BUSINESS') {
      return 'bg-orange-100 text-orange-800';
    } else if (normalizedRole === UserRole.VETERINARIAN || normalizedRole === 'VETERINARIAN') {
      return 'bg-purple-100 text-purple-800';
    } else if (normalizedRole === UserRole.ADMIN || normalizedRole === 'ADMIN') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-600';
    }
  }
  
  // 当没有角色信息时，根据用户名首字母分配不同的颜色样式
  const firstChar = userName.charAt(0).toLowerCase();
  
  if (['a', 'b', 'c', 'd', 'e'].includes(firstChar)) {
    return 'bg-green-100 text-green-800';
  } else if (['f', 'g', 'h', 'i', 'j'].includes(firstChar)) {
    return 'bg-blue-100 text-blue-800';
  } else if (['k', 'l', 'm', 'n', 'o'].includes(firstChar)) {
    return 'bg-orange-100 text-orange-800';
  } else if (['p', 'q', 'r', 's', 't'].includes(firstChar)) {
    return 'bg-purple-100 text-purple-800';
  } else {
    return 'bg-red-100 text-red-800';
  }
};