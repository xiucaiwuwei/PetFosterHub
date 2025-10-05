# PetFosterHub 安装部署指南

## 环境要求

### 基础环境
- JDK 21 或更高版本
- Maven 3.8+ （后端构建）
- Node.js 16+ （前端构建）
- MySQL 8.0+ （数据库）
- Redis 6.0+ （缓存）

### 可选环境
- Docker 20.10+ （容器化部署）
- Docker Compose 1.29+ （多容器管理）

## 快速安装（使用Docker）

使用Docker是最简单的部署方式，推荐用于开发和测试环境。

1. 确保已安装Docker和Docker Compose

2. 克隆项目代码

3. 运行Docker启动脚本：
```cmd
cd scripts
start-docker.bat
```

4. 等待所有容器启动完成，访问以下服务：
   - 后端API: http://localhost:8080/api
   - Swagger文档: http://localhost:8080/swagger-ui.html
   - 前端应用: http://localhost:3000
   - phpMyAdmin: http://localhost:8081
   - Redis Commander: http://localhost:8082

## 手动安装

### 1. 准备数据库

使用提供的脚本初始化数据库：
```cmd
cd scripts
init-database.bat
```

根据提示输入数据库配置信息。

### 2. 配置应用

编辑`config`目录下的配置文件：
- 开发环境：`application-dev.yml`
- 生产环境：`application-prod.yml`

主要配置项包括：
- 数据库连接信息
- Redis连接信息
- JWT密钥设置
- 文件存储路径

### 3. 启动后端服务

#### 开发环境
```cmd
cd scripts
start-backend-dev.bat
```

#### 生产环境
```cmd
cd scripts
start-backend-prod.bat
```

### 4. 启动前端服务

#### 开发环境
```cmd
cd scripts
start-frontend-dev.bat
```

#### 生产环境构建
```cmd
cd frontend
npm install
npm run build
```

构建后的静态文件位于`frontend/dist`目录，可以使用Nginx等Web服务器部署。

## 生产环境部署建议

1. 使用独立的数据库服务器，避免与应用部署在同一服务器
2. 配置HTTPS安全连接
3. 使用环境变量注入敏感信息（如数据库密码、JWT密钥）
4. 配置定期备份策略
5. 配置监控和告警系统

## 常见问题

### 数据库连接失败
- 检查数据库服务是否正常运行
- 确认数据库配置信息（主机、端口、用户名、密码）正确
- 确认数据库用户权限是否足够

### Redis连接失败
- 检查Redis服务是否正常运行
- 确认Redis配置信息（主机、端口、密码）正确

### 应用启动失败
- 检查日志文件了解详细错误信息
- 确认所有依赖服务都已启动
- 确认JVM内存设置是否合理

## 联系方式

如有部署相关问题，请联系项目维护团队。