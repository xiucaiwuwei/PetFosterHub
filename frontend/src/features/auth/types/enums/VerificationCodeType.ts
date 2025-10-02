// 验证码类型枚举 - 定义验证码的不同使用场景
export enum VerificationCodeType {
    // 登录验证码 - 用于用户登录身份验证
    LOGIN = 'login',
    // 注册验证码 - 用于新用户注册时的身份验证
    REGISTER = 'register',
    // 重置密码验证码 - 用于用户重置密码时的身份验证
    RESET_PASSWORD = 'resetPassword',
}