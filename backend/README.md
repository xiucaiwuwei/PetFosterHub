# PetFosterHub 后端服务

基于Spring Boot 3.2的宠物寄养平台后端API服务，提供完整的宠物寄养生态系统支持。

## ✅ 已完成的核心功能

### 🔐 用户认证与权限管理
- JWT token认证机制
- 用户注册、登录、密码加密（BCrypt）
- 基于角色的权限控制（宠物主人、服务提供商、管理员）
- Token刷新机制

### 👤 用户管理
- 用户信息管理（查看、更新、删除）
- 用户头像上传
- 用户认证状态管理
- 用户统计信息

### 🐕 宠物管理
- 宠物信息的完整CRUD操作
- 宠物图片上传和管理
- 按用户查询宠物列表
- 宠物搜索和筛选功能
- 宠物健康档案管理

### 🏠 寄养服务管理
- 寄养服务的完整CRUD操作
- 服务图片上传和展示
- 按位置、价格、评分等多维度搜索
- 推荐服务算法
- 服务评价统计和展示
- 服务商管理后台

### 📅 预约系统
- 完整的预约流程（创建、更新、取消）
- 预约状态管理（待确认、已确认、已完成、已取消）
- 按用户查询预约记录
- 服务提供商查看收到的预约
- 预约冲突检测
- 预约日历管理

### 💳 支付系统
- 完整的支付订单管理
- 支付状态实时跟踪
- 退款处理流程
- 用户支付历史记录
- 支付统计和报表
- 支付失败处理

### ⭐ 评价系统
- 服务评价创建、更新、删除
- 按服务查看评价列表
- 按用户查看评价历史
- 评价统计（平均评分、评价数量）
- 防止重复评价机制
- 评价图片上传

### 💬 消息系统
- 实时消息发送与接收
- 会话管理和分组
- 消息已读/未读状态
- 按会话查询消息历史
- 消息通知推送
- 客服消息系统

### 📁 文件上传系统
- 多类型文件上传支持（头像、宠物图片、服务图片等）
- 文件管理和权限控制
- 支持公开和私有文件
- 文件压缩和优化
- 文件访问统计
- 安全文件存储

## 🛠️ 技术栈

### 后端技术
- **框架**: Spring Boot 3.2.5
- **数据库**: MySQL 8.0 + JPA/Hibernate
- **缓存**: Redis 7.0+
- **安全**: Spring Security + JWT
- **文档**: SpringDoc OpenAPI 3
- **文件存储**: 本地文件系统 + CDN支持
- **构建工具**: Maven 3.6+
- **部署**: Docker + Docker Compose

### 开发工具
- **语言**: Java 21
- **测试**: JUnit 5 + Mockito
- **代码生成**: Lombok
- **API测试**: Swagger UI
- **数据库迁移**: Flyway（预留）

## 🚀 快速开始

### 环境要求
- Java 21+
- MySQL 8.0+
- Redis 6.0+
- Maven 3.6+

### 本地开发步骤

1. **克隆项目**
```bash
git clone [repository-url]
cd pet-foster-hub/backend
```

2. **创建数据库**
```bash
# 创建数据库
mysql -u root -p
create database pet_foster_hub character set utf8mb4;
```

3. **配置环境**
修改 `src/main/resources/application.yml` 中的配置：
- 数据库连接信息
- Redis连接信息
- 文件上传路径
- JWT密钥

4. **启动服务**
```bash
# 启动Redis
redis-server

# 启动后端服务
mvn spring-boot:run
```

### Docker一键部署

```bash
# 使用Docker Compose启动所有服务
docker-compose up -d

# 单独构建和运行
mvn clean package
docker build -t petfosterhub-backend .
docker run -p 8080:8080 petfosterhub-backend
```

## 📊 API文档与测试

### 在线文档
启动项目后访问：
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI文档**: http://localhost:8080/api/api-docs

### 主要API端点

#### 🔐 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - Token刷新

#### 👤 用户管理
- `GET /api/users/me` - 获取当前用户信息
- `GET /api/users/{id}` - 获取指定用户信息
- `PUT /api/users/me` - 更新当前用户信息
- `DELETE /api/users/me` - 删除当前用户账户

#### 🐕 宠物管理
- `GET /api/pets/my-pets` - 获取当前用户宠物
- `GET /api/pets` - 分页获取宠物
- `GET /api/pets/{id}` - 获取指定宠物
- `POST /api/pets` - 创建宠物
- `PUT /api/pets/{id}` - 更新宠物信息
- `DELETE /api/pets/{id}` - 删除宠物
- `GET /api/pets/search` - 搜索宠物

#### 🏠 寄养服务管理
- `GET /api/foster-services` - 获取所有寄养服务
- `GET /api/foster-services/featured` - 获取推荐服务
- `GET /api/foster-services/search` - 搜索寄养服务
- `GET /api/foster-services/provider/{providerId}` - 获取服务商的服务
- `GET /api/foster-services/{id}` - 获取指定服务详情
- `POST /api/foster-services` - 创建寄养服务
- `PUT /api/foster-services/{id}` - 更新服务信息
- `DELETE /api/foster-services/{id}` - 删除服务

#### 📅 预约管理
- `GET /api/bookings/my-bookings` - 获取当前用户预约
- `GET /api/bookings/received` - 获取收到的预约（服务商）
- `GET /api/bookings/{id}` - 获取指定预约详情
- `GET /api/bookings/status/{status}` - 按状态获取预约
- `POST /api/bookings` - 创建预约
- `PUT /api/bookings/{id}/status` - 更新预约状态
- `DELETE /api/bookings/{id}` - 取消预约

#### 💳 支付管理
- `GET /api/payments/user/{userId}` - 获取用户支付记录
- `GET /api/payments/booking/{bookingId}` - 获取预约支付信息
- `GET /api/payments/{id}` - 获取指定支付详情
- `POST /api/payments` - 创建支付订单
- `POST /api/payments/{id}/process` - 处理支付
- `POST /api/payments/{id}/refund` - 申请退款

#### ⭐ 评价管理
- `GET /api/reviews/service/{serviceId}` - 获取服务评价列表
- `GET /api/reviews/service/{serviceId}/page` - 分页获取服务评价
- `GET /api/reviews/user` - 获取当前用户评价
- `POST /api/reviews` - 创建评价
- `PUT /api/reviews/{id}` - 更新评价
- `DELETE /api/reviews/{id}` - 删除评价

#### 💬 消息管理
- `GET /api/messages/conversation/{conversationId}` - 获取会话消息
- `POST /api/messages` - 发送消息
- `PUT /api/messages/{id}/read` - 标记消息已读

#### 📁 文件上传
- `POST /api/files/upload` - 上传文件
- `GET /api/files/user` - 获取用户文件
- `GET /api/files/entity/{entityType}/{entityId}` - 获取实体文件
- `GET /api/files/{id}` - 获取文件信息
- `GET /api/files/{id}/download` - 下载文件
- `DELETE /api/files/{id}` - 删除文件

## 🗂️ 项目结构
```
src/main/java/org/backend/
├── controller/     # REST控制器层
│   ├── AuthController.java
│   ├── UserController.java
│   ├── PetController.java
│   ├── FosterServiceController.java
│   ├── BookingController.java
│   ├── PaymentController.java
│   ├── ReviewController.java
│   ├── MessageController.java
│   └── FileUploadController.java
├── entity/         # JPA实体类
├── repository/     # 数据访问层（JPA Repository）
├── service/        # 业务逻辑层
├── config/         # 配置类（Security、JPA等）
├── security/       # 安全配置（JWT、权限控制）
└── utils/          # 工具类

src/main/resources/
├── application.yml         # 主配置文件
├── application-docker.yml  # Docker配置
└── data.sql               # 初始化数据
```

## 🔒 安全特性
- **JWT Token认证** - 无状态认证机制
- **密码加密** - BCrypt强加密
- **权限控制** - 基于角色的访问控制（RBAC）
- **API限流** - 防止暴力攻击
- **文件安全** - 文件访问权限控制
- **SQL注入防护** - 使用JPA预编译查询

## ⚡ 性能优化
- **Redis缓存** - 缓存热点数据
- **数据库索引** - 关键字段索引优化
- **分页查询** - 大数据量分页处理
- **文件压缩** - 图片自动压缩优化
- **CDN支持** - 预留CDN集成接口

## 🧪 测试覆盖
- **单元测试** - Service层单元测试
- **集成测试** - API接口测试
- **数据库测试** - 使用H2内存数据库
- **安全测试** - 权限控制测试

## 📈 监控与运维
- **健康检查** - Spring Boot Actuator
- **日志监控** - 结构化日志输出
- **性能监控** - 预留Micrometer集成
- **异常追踪** - 统一异常处理

## 🚀 后续开发计划

### 即将实现
- [ ] 实时通知系统（WebSocket）
- [ ] 支付集成（支付宝、微信支付API）
- [ ] 地图服务集成（高德地图API）
- [ ] 高级搜索功能（Elasticsearch）
- [ ] 数据统计分析（用户行为分析）

### 长期规划
- [ ] 微服务架构拆分
- [ ] 容器化部署优化（Kubernetes）
- [ ] 国际化支持（i18n）
- [ ] 移动端API优化
- [ ] AI推荐算法

## 🤝 贡献指南

### 开发流程
1. **Fork项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

### 代码规范
- 遵循Java 21最佳实践
- 使用Spring Boot约定优于配置
- 代码注释完整（JavaDoc）
- 单元测试覆盖率>80%

## 📄 许可证
MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 支持与联系
- **技术支持**: support@petfosterhub.com
- **文档更新**: 请查看Swagger UI获取最新API文档
- **问题反馈**: 请通过GitHub Issues提交