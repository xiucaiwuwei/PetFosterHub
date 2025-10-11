/**
 * 用户角色枚举 - 定义系统中不同用户角色的权限和功能
 */
export enum UserRole {
    OWNER = 'OWNER', // 宠物主人 - 普通用户角色，可以发布宠物信息和申请寄养
    PROVIDER = 'PROVIDER', // 寄养提供者 - 提供寄养服务的用户角色
    BUSINESS = 'BUSINESS', // 商家用户 - 如宠物用品商店、宠物医院等商业实体
    VETERINARIAN = 'VETERINARIAN', // 兽医 - 提供专业兽医服务的用户角色
    ADMIN = 'ADMIN', // 系统管理员 - 拥有最高权限的系统管理角色
}
