# PetFosterHub 数据库设计文档

## 数据库概述

PetFosterHub使用MySQL 8.0作为主要数据库，Redis 6.0作为缓存数据库。本文档详细描述了MySQL数据库的表结构设计和关系。

## 数据库表结构

### 1. 用户表 (users)

存储系统用户的基本信息。

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(100) NOT NULL UNIQUE COMMENT '用户名/邮箱',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
  nickname VARCHAR(100) COMMENT '昵称',
  avatar VARCHAR(255) COMMENT '头像URL',
  phone VARCHAR(20) COMMENT '手机号码',
  gender TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
  birthday DATE COMMENT '出生日期',
  address VARCHAR(255) COMMENT '地址',
  bio TEXT COMMENT '个人简介',
  role VARCHAR(50) DEFAULT 'USER' COMMENT '角色：USER-普通用户，FOSTER-寄养家庭，ADMIN-管理员',
  status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 2. 用户认证信息表 (user_auths)

存储用户认证相关信息，支持多类型登录。

```sql
CREATE TABLE user_auths (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT 'ID',
  user_id BIGINT NOT NULL COMMENT '用户ID',
  auth_type VARCHAR(50) NOT NULL COMMENT '认证类型：EMAIL, PHONE, WECHAT, ALIPAY',
  identifier VARCHAR(100) NOT NULL COMMENT '认证标识（如邮箱、手机号）',
  credential VARCHAR(255) COMMENT '凭证（如密码哈希）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_auth_type_identifier (auth_type, identifier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户认证信息表';
```

### 3. 宠物表 (pets)

存储宠物的基本信息。

```sql
CREATE TABLE pets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '宠物ID',
  owner_id BIGINT NOT NULL COMMENT '主人用户ID',
  name VARCHAR(100) NOT NULL COMMENT '宠物名称',
  type VARCHAR(50) NOT NULL COMMENT '宠物类型：DOG, CAT, BIRD, OTHER',
  breed VARCHAR(100) COMMENT '品种',
  age INT COMMENT '年龄（月）',
  gender TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-公，2-母',
  weight DECIMAL(5,2) COMMENT '体重（kg）',
  description TEXT COMMENT '宠物描述',
  health_status VARCHAR(50) DEFAULT 'HEALTHY' COMMENT '健康状态：HEALTHY-健康，CHRONIC-慢性病，PREGNANT-怀孕，OTHER-其他',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物表';
```

### 4. 宠物图片表 (pet_images)

存储宠物的照片。

```sql
CREATE TABLE pet_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '图片ID',
  pet_id BIGINT NOT NULL COMMENT '宠物ID',
  image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
  is_primary TINYINT DEFAULT 0 COMMENT '是否主图：0-否，1-是',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物图片表';
```

### 5. 宠物健康记录表 (pet_health_records)

存储宠物的健康记录。

```sql
CREATE TABLE pet_health_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
  pet_id BIGINT NOT NULL COMMENT '宠物ID',
  record_type VARCHAR(50) NOT NULL COMMENT '记录类型：VACCINATION-疫苗，DEWORMING-驱虫，MEDICAL-医疗，OTHER-其他',
  title VARCHAR(255) NOT NULL COMMENT '记录标题',
  content TEXT COMMENT '记录内容',
  record_date DATE COMMENT '记录日期',
  next_date DATE COMMENT '下次处理日期',
  doctor_name VARCHAR(100) COMMENT '医生姓名',
  hospital_name VARCHAR(100) COMMENT '医院名称',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物健康记录表';
```

### 6. 寄养申请表 (foster_applications)

存储宠物寄养申请信息。

```sql
CREATE TABLE foster_applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '申请ID',
  pet_id BIGINT NOT NULL COMMENT '宠物ID',
  owner_id BIGINT NOT NULL COMMENT '宠物主人ID',
  fosterer_id BIGINT COMMENT '寄养人ID',
  start_date DATE NOT NULL COMMENT '开始日期',
  end_date DATE NOT NULL COMMENT '结束日期',
  requirements TEXT COMMENT '寄养要求',
  status VARCHAR(50) DEFAULT 'PENDING' COMMENT '状态：PENDING-待匹配，MATCHED-已匹配，CONFIRMED-已确认，ONGOING-进行中，COMPLETED-已完成，CANCELLED-已取消',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (fosterer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='寄养申请表';
```

### 7. 订单表 (orders)

存储寄养服务订单信息。

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
  application_id BIGINT NOT NULL COMMENT '寄养申请ID',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '总金额',
  payment_status VARCHAR(50) DEFAULT 'PENDING' COMMENT '支付状态：PENDING-待支付，PAID-已支付，REFUNDED-已退款，CANCELED-已取消',
  payment_method VARCHAR(50) COMMENT '支付方式：WECHAT_PAY, ALIPAY, CASH',
  payment_time TIMESTAMP COMMENT '支付时间',
  order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  start_date DATE COMMENT '服务开始日期',
  end_date DATE COMMENT '服务结束日期',
  status VARCHAR(50) DEFAULT 'ACTIVE' COMMENT '订单状态：ACTIVE-有效，COMPLETED-已完成，CANCELED-已取消',
  FOREIGN KEY (application_id) REFERENCES foster_applications(id) ON DELETE CASCADE,
  UNIQUE KEY uk_application_id (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';
```

### 8. 消息表 (messages)

存储用户之间的消息。

```sql
CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '消息ID',
  sender_id BIGINT NOT NULL COMMENT '发送者ID',
  receiver_id BIGINT NOT NULL COMMENT '接收者ID',
  content TEXT NOT NULL COMMENT '消息内容',
  is_read TINYINT DEFAULT 0 COMMENT '是否已读：0-未读，1-已读',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';
```

### 9. 评价表 (reviews)

存储寄养服务评价信息。

```sql
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '评价ID',
  order_id BIGINT NOT NULL COMMENT '订单ID',
  rating INT NOT NULL COMMENT '评分（1-5星）',
  content TEXT COMMENT '评价内容',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  UNIQUE KEY uk_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';
```

## 数据库关系图

```
users
  |
  +-- user_auths
  |
  +-- pets
  |    |
  |    +-- pet_images
  |    |
  |    +-- pet_health_records
  |
  +-- foster_applications (as owner or fosterer)
       |
       +-- orders
            |
            +-- reviews

messages
  |
  +-- users (sender and receiver)
```

## 索引设计

为提高查询性能，在以下字段上创建了索引：

1. **users表**
   - `username` (唯一索引)
   - `phone` (普通索引)
   - `status` (普通索引)
   - `role` (普通索引)

2. **pets表**
   - `owner_id` (普通索引)
   - `type` (普通索引)
   - `breed` (普通索引)

3. **foster_applications表**
   - `owner_id` (普通索引)
   - `fosterer_id` (普通索引)
   - `pet_id` (普通索引)
   - `status` (普通索引)
   - `start_date` (普通索引)
   - `end_date` (普通索引)

4. **orders表**
   - `application_id` (唯一索引)
   - `payment_status` (普通索引)
   - `order_time` (普通索引)

5. **messages表**
   - `sender_id` (普通索引)
   - `receiver_id` (普通索引)
   - `is_read` (普通索引)
   - `created_at` (普通索引)

## 数据安全

1. **密码安全**
   - 用户密码使用BCrypt算法加密存储
   - 密码长度至少8位，包含字母、数字和特殊字符

2. **数据备份**
   - 定期全量备份数据库
   - 增量备份记录变更数据
   - 备份文件异地存储

3. **访问控制**
   - 数据库用户最小权限原则
   - 禁止root用户远程登录
   - 应用使用独立数据库用户

## 性能优化

1. **查询优化**
   - 使用索引加速查询
   - 避免SELECT *查询
   - 合理使用分页

2. **连接池配置**
   - 使用HikariCP连接池
   - 根据并发量调整连接池大小

3. **缓存策略**
   - 使用Redis缓存热点数据
   - 合理设置缓存过期时间
   - 实现缓存一致性机制

## 数据库维护

1. **定期维护任务**
   - 检查并优化表结构
   - 更新统计信息
   - 清理过期数据

2. **监控与告警**
   - 监控数据库性能指标
   - 设置空间使用告警阈值
   - 记录慢查询日志

## 附录：数据库初始化脚本

项目提供了数据库初始化脚本`scripts/init-database.bat`，可用于快速创建数据库和用户。