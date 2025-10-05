# PetFosterHub 开发环境配置指南

## 环境准备

### 基础环境安装

1. **安装JDK 21**
   - 下载地址：https://www.oracle.com/java/technologies/downloads/
   - 安装后配置环境变量 `JAVA_HOME`
   - 验证安装：`java -version`

2. **安装Maven 3.8+**
   - 下载地址：https://maven.apache.org/download.cgi
   - 安装后配置环境变量 `MAVEN_HOME`
   - 验证安装：`mvn -version`

3. **安装Node.js 16+**
   - 下载地址：https://nodejs.org/en/download/
   - 安装后自动配置环境变量
   - 验证安装：`node -v` 和 `npm -v`

4. **安装MySQL 8.0+**
   - 下载地址：https://dev.mysql.com/downloads/installer/
   - 安装时设置root密码
   - 验证安装：`mysql -u root -p`

5. **安装Redis 6.0+**
   - 下载地址：https://redis.io/download/
   - Windows用户可使用：https://github.com/tporadowski/redis
   - 验证安装：`redis-cli ping`

### 开发工具推荐

1. **后端开发**
   - IntelliJ IDEA (推荐旗舰版)
   - Eclipse STS
   - Visual Studio Code + Java插件

2. **前端开发**
   - Visual Studio Code
   - WebStorm

3. **数据库工具**
   - Navicat
   - DBeaver
   - phpMyAdmin (项目已集成)

4. **其他工具**
   - Git
   - Docker Desktop
   - Postman (API测试)

## 项目导入

### 后端项目导入

1. 使用IntelliJ IDEA打开`backend`目录
2. IDE会自动识别Maven项目并下载依赖
3. 等待依赖下载完成后，查看项目结构

### 前端项目导入

1. 使用VS Code打开`frontend`目录
2. 在终端中执行 `npm install` 安装依赖
3. 安装必要的VS Code插件（如ESLint、Prettier、TypeScript等）

## 开发配置

### 后端配置

1. **配置文件**
   - 开发环境：`config/application-dev.yml`
   - 根据本地环境修改数据库和Redis连接信息

2. **启动方式**
   - 使用IDE运行`BackendApplication.java`类
   - 或使用脚本：`scripts/start-backend-dev.bat`

3. **访问后端服务**
   - API地址：http://localhost:8080/api
   - Swagger文档：http://localhost:8080/swagger-ui.html

### 前端配置

1. **配置文件**
   - 环境配置：`frontend/.env.development`
   - 代理配置：`frontend/vite.config.ts`中的proxy配置

2. **启动方式**
   - 使用VS Code终端执行 `npm run dev`
   - 或使用脚本：`scripts/start-frontend-dev.bat`

3. **访问前端服务**
   - 应用地址：http://localhost:3000

## 开发流程

1. **创建分支**
   - 从`main`分支创建新的功能分支
   - 分支命名规范：`feature/功能名称` 或 `fix/问题编号`

2. **开发功能**
   - 遵循代码规范
   - 编写单元测试
   - 确保代码能通过现有测试

3. **提交代码**
   - 提交信息清晰明了
   - 遵循`feat: 添加新功能`、`fix: 修复问题`等格式

4. **代码审核**
   - 创建Pull Request
   - 等待团队成员审核
   - 根据反馈进行修改

5. **合并代码**
   - 审核通过后，将功能分支合并到`main`分支

## 代码规范

### Java代码规范

1. **命名规范**
   - 类名：大驼峰命名法，如`UserService`
   - 方法名：小驼峰命名法，如`findUserById`
   - 变量名：小驼峰命名法，如`userName`
   - 常量名：全大写，下划线分隔，如`MAX_SIZE`

2. **代码风格**
   - 使用4个空格缩进
   - 行尾不使用分号
   - 大括号使用K&R风格
   - 方法长度尽量控制在50行以内

3. **注释规范**
   - 为类、接口、方法添加Javadoc注释
   - 复杂逻辑添加行注释
   - 避免冗余注释

### TypeScript代码规范

1. **命名规范**
   - 类名：大驼峰命名法，如`UserProfile`
   - 函数名：小驼峰命名法，如`getUserInfo`
   - 变量名：小驼峰命名法，如`userData`
   - 常量名：全大写，下划线分隔，如`API_URL`

2. **代码风格**
   - 使用2个空格缩进
   - 行尾使用分号
   - 大括号使用ES6风格
   - 组件命名使用PascalCase

3. **注释规范**
   - 为组件、函数添加TypeDoc注释
   - 使用TypeScript类型注解
   - 避免`any`类型的过度使用

## 测试指南

### 后端测试

1. **单元测试**
   - 测试文件位于`backend/src/test/java`目录
   - 使用JUnit 5和Mockito框架
   - 执行命令：`mvn test`

2. **集成测试**
   - 使用`@SpringBootTest`注解
   - 测试API接口和服务间交互
   - 执行命令：`mvn verify`

### 前端测试

1. **单元测试**
   - 使用Jest框架
   - 测试文件位于对应组件目录下
   - 执行命令：`npm run test`

2. **E2E测试**
   - 使用Cypress或Playwright
   - 测试完整用户流程
   - 执行命令：`npm run test:e2e`

## 调试技巧

### 后端调试

1. **使用IDE调试功能**
   - 在IntelliJ IDEA中设置断点
   - 以调试模式运行应用
   - 观察变量值和执行流程

2. **日志调试**
   - 使用`@Slf4j`注解添加日志
   - 日志级别：DEBUG、INFO、WARN、ERROR
   - 开发环境日志配置：`logback-spring.xml`

### 前端调试

1. **浏览器调试**
   - 使用Chrome DevTools
   - 设置断点，观察组件状态
   - 检查Network请求

2. **React DevTools**
   - 安装React DevTools扩展
   - 实时查看组件树和状态

## 常见问题解决

1. **依赖下载失败**
   - 检查网络连接
   - 清理Maven缓存：`mvn clean install -U`
   - 清理npm缓存：`npm cache clean --force`

2. **数据库连接问题**
   - 确认MySQL服务正在运行
   - 检查连接参数是否正确
   - 确认数据库用户权限

3. **Redis连接问题**
   - 确认Redis服务正在运行
   - 检查连接参数和密码

4. **端口冲突**
   - 修改`application.yml`中的server.port配置
   - 修改前端`vite.config.ts`中的端口配置

## 开发资源

- [Spring Boot文档](https://spring.io/projects/spring-boot)
- [React文档](https://react.dev/)
- [TypeScript文档](https://www.typescriptlang.org/docs/)
- [Tailwind CSS文档](https://tailwindcss.com/docs/)
- [项目API文档](http://localhost:8080/swagger-ui.html) (启动后访问)