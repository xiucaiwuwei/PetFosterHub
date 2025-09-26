# PetFosterHub 项目文档

## 项目简介

PetFosterHub 是一个宠物寄养和护理平台，旨在连接宠物主人与有爱心的寄养家庭，提供便捷的宠物寄养服务。

## 项目结构

```
PetFosterHub/
├── backend/             # 后端Java Spring Boot项目
├── frontend/            # 前端React/Vite项目
├── config/              # 配置文件目录
├── scripts/             # 脚本工具目录
├── docs/                # 项目文档目录
└── pom.xml              # Maven父项目配置
```

## 主要功能

1. **用户管理**：注册、登录、个人信息管理
2. **宠物管理**：宠物资料、健康记录管理
3. **寄养服务**：寄养申请发布、接单、评价系统
4. **交流系统**：即时消息、评论互动
5. **支付系统**：订单支付、财务管理
6. **搜索匹配**：基于条件筛选和推荐

## 技术栈

### 后端
- Java 21
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- MySQL 8
- Redis 6
- SpringDoc OpenAPI (Swagger)

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS

### 部署
- Docker + Docker Compose
- Maven
- NPM

## 快速开始

请参考以下文档获取详细信息：
- [安装部署指南](INSTALL.md)
- [开发环境配置](DEVELOPMENT.md)
- [API文档](API.md)
- [数据库设计](DATABASE.md)
- [安全规范](SECURITY.md)

## 贡献指南

欢迎对项目进行贡献！请先阅读[贡献指南](CONTRIBUTING.md)了解贡献流程和规范。

## 版权信息

© 2024 PetFosterHub Team. 保留所有权利。