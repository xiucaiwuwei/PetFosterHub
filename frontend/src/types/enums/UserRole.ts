// 用户类型枚举 - 定义系统中不同用户角色的权限和功能
export enum UserRole {
    // 宠物主人 - 普通用户角色，可以发布宠物信息和申请寄养
    OWNER = 'OWNER',
    // 寄养提供者 - 提供寄养服务的用户角色
    PROVIDER = 'PROVIDER',
    // 商家用户 - 如宠物用品商店、宠物医院等商业实体
    BUSINESS = 'BUSINESS',
    // 兽医 - 提供专业兽医服务的用户角色
    VETERINARIAN = 'VETERINARIAN',
    // 系统管理员 - 拥有最高权限的系统管理角色
    ADMIN = 'ADMIN',
}
