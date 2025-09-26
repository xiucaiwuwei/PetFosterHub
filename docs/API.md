# PetFosterHub API文档

## API概述

PetFosterHub提供RESTful API接口，用于前后端通信和第三方集成。所有API接口均遵循REST设计原则，支持常用的HTTP方法。

## 访问方式

### 基础URL

开发环境：`http://localhost:8080/api`
生产环境：`https://your-domain.com/api`

### API版本

当前版本：`v1`

所有API路径都以版本号开头，例如：`/api/v1/users`

### 认证方式

PetFosterHub使用JWT (JSON Web Token)进行身份认证：

1. 登录接口返回JWT令牌
2. 后续请求在HTTP头中添加：`Authorization: Bearer {token}`
3. 令牌有效期为24小时，过期后需使用刷新令牌获取新令牌

## API分类

### 用户管理
- 注册、登录、登出
- 个人信息管理
- 权限管理

### 宠物管理
- 宠物资料CRUD
- 宠物健康记录
- 宠物相册

### 寄养服务
- 寄养申请发布
- 申请处理与匹配
- 订单管理

### 消息系统
- 即时消息
- 系统通知
- 评论互动

### 支付系统
- 订单支付
- 账单查询
- 提现申请

## API文档查看

### Swagger UI

项目集成了SpringDoc OpenAPI，可以通过以下地址访问交互式API文档：

开发环境：`http://localhost:8080/swagger-ui.html`

### API规范

所有API遵循以下规范：

1. **请求格式**
   - 内容类型：`application/json`
   - 请求参数：URL参数或请求体JSON

2. **响应格式**
   - 统一响应结构：
     ```json
     {
       "code": 200,          // 状态码
       "message": "success", // 消息描述
       "data": {}            // 响应数据
     }
     ```

3. **状态码**
   - 200: 请求成功
   - 400: 请求参数错误
   - 401: 未授权，需要登录
   - 403: 权限不足
   - 404: 请求资源不存在
   - 500: 服务器内部错误

## API使用示例

以下是几个常用API的使用示例：

### 用户登录

```bash
# 请求
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "example@mail.com",
  "password": "password123"
}

# 响应
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "example@mail.com",
      "nickname": "Example User",
      "avatar": "https://example.com/avatar.jpg",
      "roles": ["USER"]
    }
  }
}
```

### 获取宠物列表

```bash
# 请求
GET /api/v1/pets?page=1&size=10&status=AVAILABLE
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 响应
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Max",
        "type": "DOG",
        "breed": "Golden Retriever",
        "age": 2,
        "gender": "MALE",
        "description": "Friendly and energetic dog.",
        "status": "AVAILABLE",
        "images": ["https://example.com/max1.jpg", "https://example.com/max2.jpg"]
      }
    ],
    "pageable": {
      "pageNumber": 1,
      "pageSize": 10
    },
    "totalPages": 5,
    "totalElements": 48
  }
}
```

## API变更记录

### v1.0.0
- 初始版本发布
- 包含用户管理、宠物管理、寄养服务、消息系统和支付系统的基础API

## API限流

为保护系统安全，API接口实施以下限流措施：

- 普通用户：100次/小时
- 认证用户：500次/小时
- 特定高频接口：单独设置限流策略

## 错误处理

API错误响应格式：

```json
{
  "code": 错误码,
  "message": "错误描述",
  "error": "详细错误信息"
}
```

常见错误码及处理方式：

- 401: 重新登录获取新令牌
- 403: 检查用户权限是否足够
- 404: 确认请求的资源是否存在
- 500: 记录错误信息，联系系统管理员

## 第三方集成

如需将PetFosterHub API集成到第三方应用，请遵循以下步骤：

1. 注册开发者账号
2. 创建应用获取API密钥
3. 遵循OAuth 2.0授权流程
4. 按照API文档进行接口调用

## 联系我们

如有API相关问题或建议，请联系技术支持团队。