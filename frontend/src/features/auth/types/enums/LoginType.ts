// 登录类型枚举 - 定义系统支持的不同登录方式
export enum LoginType {
    // 验证码登录 - 通过手机验证码进行身份验证
    verificationCode = 'verificationCode',
    // 密码登录 - 通过用户名/手机号和密码进行身份验证
    password = 'password',
}