# PetFosterHub API设计文档

## 1. 概述

本文档详细描述了PetFosterHub系统的API设计，包括接口URL、请求参数、响应格式、错误处理等内容，为前后端开发人员提供统一的接口规范，也为毕业设计论文提供API实现的详细说明。

## 2. API设计原则

系统API设计遵循以下原则：

1. **RESTful设计**：使用HTTP方法表示操作类型，使用URI表示资源
2. **版本化**：通过URL路径进行API版本管理
3. **统一响应格式**：所有API返回统一的JSON格式响应
4. **安全性**：实现认证、授权和数据加密
5. **可读性**：清晰的接口命名和文档说明

## 3. 基础API信息

### 3.1 基础URL

所有API的基础URL为：`http://api.petfosterhub.com/api/v1`

### 3.2 认证方式

- JWT认证：通过HTTP请求头中的`Authorization: Bearer {token}`进行认证
- 部分公开API无需认证

### 3.3 响应格式

所有API响应均采用统一的JSON格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

其中：
- `code`：HTTP状态码
- `message`：操作结果描述
- `data`：返回的数据内容

### 3.4 错误处理

错误响应格式：

```json
{
  "code": 400,
  "message": "错误描述",
  "error": "错误详情"
}
```

常见错误码：
- 400：请求参数错误
- 401：未授权，需要登录
- 403：拒绝访问，权限不足
- 404：资源不存在
- 500：服务器内部错误

## 4. 核心API详细设计

### 4.1 用户管理API

#### 4.1.1 用户注册

- **URL**：`/users/register`
- **方法**：`POST`
- **认证**：无需认证
- **请求参数**：
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "phone": "string",
    "role": "OWNER|FOSTER|ADMIN"
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "userId": 1,
      "username": "user1",
      "email": "user1@example.com",
      "phone": "13800138000",
      "role": "OWNER",
      "createTime": "2024-01-01T10:00:00"
    }
  }
  ```

#### 4.1.2 用户登录

- **URL**：`/users/login`
- **方法**：`POST`
- **认证**：无需认证
- **请求参数**：
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expireTime": "2024-01-01T22:00:00",
      "userInfo": {
        "userId": 1,
        "username": "user1",
        "role": "OWNER"
      }
    }
  }
  ```

#### 4.1.3 获取当前用户信息

- **URL**：`/users/me`
- **方法**：`GET`
- **认证**：需要JWT
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "userId": 1,
      "username": "user1",
      "email": "user1@example.com",
      "phone": "13800138000",
      "role": "OWNER",
      "avatar": "https://example.com/avatar.jpg",
      "createTime": "2024-01-01T10:00:00"
    }
  }
  ```

#### 4.1.4 更新用户信息

- **URL**：`/users/me`
- **方法**：`PUT`
- **认证**：需要JWT
- **请求参数**：
  ```json
  {
    "username": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string"
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {
      "userId": 1,
      "username": "newuser1",
      "email": "newuser1@example.com",
      "phone": "13800138000",
      "avatar": "https://example.com/newavatar.jpg",
      "updateTime": "2024-01-02T10:00:00"
    }
  }
  ```

### 4.2 宠物管理API

#### 4.2.1 添加宠物信息

- **URL**：`/pets`
- **方法**：`POST`
- **认证**：需要JWT（宠物主人角色）
- **请求参数**：
  ```json
  {
    "name": "string",
    "type": "string",
    "breed": "string",
    "age": 0,
    "gender": "MALE|FEMALE",
    "weight": 0.0,
    "description": "string",
    "healthStatus": "string",
    "specialNeeds": "string"
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "添加成功",
    "data": {
      "petId": 1,
      "ownerId": 1,
      "name": "小白",
      "type": "狗",
      "breed": "金毛",
      "age": 2,
      "gender": "MALE",
      "weight": 25.5,
      "description": "活泼可爱的金毛犬",
      "healthStatus": "健康",
      "specialNeeds": "无",
      "images": [],
      "createTime": "2024-01-01T10:00:00"
    }
  }
  ```

#### 4.2.2 获取宠物列表

- **URL**：`/pets`
- **方法**：`GET`
- **认证**：需要JWT
- **查询参数**：
  - `page`：页码（默认1）
  - `size`：每页数量（默认10）
  - `type`：宠物类型（可选）
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "content": [
        {
          "petId": 1,
          "ownerId": 1,
          "name": "小白",
          "type": "狗",
          "breed": "金毛",
          "age": 2,
          "gender": "MALE",
          "description": "活泼可爱的金毛犬"
        },
        {
          "petId": 2,
          "ownerId": 1,
          "name": "咪咪",
          "type": "猫",
          "breed": "英短",
          "age": 3,
          "gender": "FEMALE",
          "description": "温顺乖巧的英短猫"
        }
      ],
      "pageable": {
        "pageNumber": 1,
        "pageSize": 10
      },
      "totalElements": 2,
      "totalPages": 1
    }
  }
  ```

### 4.3 寄养服务API

#### 4.3.1 创建寄养服务

- **URL**：`/foster-services`
- **方法**：`POST`
- **认证**：需要JWT（寄养家庭角色）
- **请求参数**：
  ```json
  {
    "title": "string",
    "description": "string",
    "price": 0.0,
    "location": "string",
    "availableStartTime": "2024-01-01T10:00:00",
    "availableEndTime": "2024-01-10T10:00:00",
    "capacity": 0,
    "petTypes": ["string"]
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "创建成功",
    "data": {
      "serviceId": 1,
      "fosterId": 2,
      "title": "专业宠物寄养服务",
      "description": "提供优质的宠物寄养服务，全天候照顾",
      "price": 50.0,
      "location": "北京市朝阳区",
      "availableStartTime": "2024-01-01T10:00:00",
      "availableEndTime": "2024-01-10T10:00:00",
      "capacity": 5,
      "petTypes": ["狗", "猫"],
      "status": "AVAILABLE",
      "rating": 0.0,
      "createTime": "2024-01-01T10:00:00"
    }
  }
  ```

#### 4.3.2 搜索寄养服务

- **URL**：`/foster-services/search`
- **方法**：`GET`
- **认证**：需要JWT
- **查询参数**：
  - `location`：位置（可选）
  - `petType`：宠物类型（可选）
  - `startTime`：开始时间（可选）
  - `endTime`：结束时间（可选）
  - `minPrice`：最低价格（可选）
  - `maxPrice`：最高价格（可选）
  - `page`：页码（默认1）
  - `size`：每页数量（默认10）
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "content": [
        {
          "serviceId": 1,
          "fosterId": 2,
          "title": "专业宠物寄养服务",
          "description": "提供优质的宠物寄养服务，全天候照顾",
          "price": 50.0,
          "location": "北京市朝阳区",
          "status": "AVAILABLE",
          "rating": 4.8
        },
        {
          "serviceId": 2,
          "fosterId": 3,
          "title": "家庭式宠物寄养",
          "description": "温馨家庭环境，给予宠物如家般的照顾",
          "price": 40.0,
          "location": "北京市海淀区",
          "status": "AVAILABLE",
          "rating": 4.6
        }
      ],
      "pageable": {
        "pageNumber": 1,
        "pageSize": 10
      },
      "totalElements": 2,
      "totalPages": 1
    }
  }
  ```

### 4.4 订单管理API

#### 4.4.1 创建订单

- **URL**：`/bookings`
- **方法**：`POST`
- **认证**：需要JWT（宠物主人角色）
- **请求参数**：
  ```json
  {
    "serviceId": 1,
    "petId": 1,
    "startTime": "2024-01-05T10:00:00",
    "endTime": "2024-01-08T10:00:00"
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "创建成功",
    "data": {
      "bookingId": 1,
      "serviceId": 1,
      "ownerId": 1,
      "petId": 1,
      "startTime": "2024-01-05T10:00:00",
      "endTime": "2024-01-08T10:00:00",
      "totalPrice": 150.0,
      "status": "PENDING",
      "createTime": "2024-01-01T10:00:00"
    }
  }
  ```

#### 4.4.2 获取订单列表

- **URL**：`/bookings`
- **方法**：`GET`
- **认证**：需要JWT
- **查询参数**：
  - `status`：订单状态（可选）
  - `role`：用户角色（OWNER/FOSTER，可选）
  - `page`：页码（默认1）
  - `size`：每页数量（默认10）
- **响应示例**：
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "content": [
        {
          "bookingId": 1,
          "serviceId": 1,
          "ownerId": 1,
          "petId": 1,
          "startTime": "2024-01-05T10:00:00",
          "endTime": "2024-01-08T10:00:00",
          "totalPrice": 150.0,
          "status": "PAID"
        },
        {
          "bookingId": 2,
          "serviceId": 2,
          "ownerId": 1,
          "petId": 2,
          "startTime": "2024-01-10T10:00:00",
          "endTime": "2024-01-15T10:00:00",
          "totalPrice": 200.0,
          "status": "PENDING"
        }
      ],
      "pageable": {
        "pageNumber": 1,
        "pageSize": 10
      },
      "totalElements": 2,
      "totalPages": 1
    }
  }
  ```

## 5. API文档与测试

系统使用SpringDoc OpenAPI（基于Swagger）生成API文档，文档访问地址为：`http://api.petfosterhub.com/swagger-ui.html`

开发人员可以通过该文档查看API的详细信息，并进行在线测试。