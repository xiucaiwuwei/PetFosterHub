-- 用户表
-- 先删除所有依赖于users表的表，按照依赖关系顺序删除
SET FOREIGN_KEY_CHECKS = 0;

-- 删除直接依赖users表的表
DROP TABLE IF EXISTS file_uploads;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reviews;

-- 删除间接依赖users表的表
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS foster_services;
DROP TABLE IF EXISTS pets;

-- 最后删除users表
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户唯一标识符',
    phone VARCHAR(20) NOT NULL COMMENT '手机号码',
    avatar VARCHAR(500) COMMENT '头像',
    nickname VARCHAR(100) COMMENT '昵称',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    role VARCHAR(20) COMMENT '角色',
    id_card VARCHAR(18) NULL COMMENT '身份证号', -- 明确设置为可以为NULL
    full_name VARCHAR(100) COMMENT '姓名',
    address VARCHAR(200) COMMENT '地址',
    bio TEXT COMMENT '个人简介',
    rating DECIMAL(3,2) COMMENT '评分',
    review_count INT DEFAULT 0 COMMENT '评价数量',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_phone_role (phone, role) COMMENT '手机号和角色的组合唯一约束',
    INDEX idx_phone (phone) COMMENT '手机号索引',
    INDEX idx_role (role) COMMENT '角色索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

-- 宠物表
CREATE TABLE IF NOT EXISTS pets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '宠物唯一标识符',
    user_id BIGINT NOT NULL COMMENT '所属用户ID',
    name VARCHAR(100) NOT NULL COMMENT '宠物名称',
    species VARCHAR(50) NOT NULL COMMENT '宠物种类',
    breed VARCHAR(100) COMMENT '宠物品种',
    age INT COMMENT '宠物年龄',
    weight DECIMAL(5,2) COMMENT '宠物重量',
    gender ENUM('MALE', 'FEMALE', 'OTHER') DEFAULT 'OTHER' COMMENT '宠物性别',
    description TEXT COMMENT '宠物描述',
    special_needs TEXT COMMENT '特殊需求',
    vaccination_status VARCHAR(50) COMMENT '疫苗接种状态',
    image_url VARCHAR(500) COMMENT '宠物图片URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否已删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id) COMMENT '用户ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='宠物信息表';

-- 寄养服务表
CREATE TABLE IF NOT EXISTS foster_services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '服务唯一标识符',
    provider_id BIGINT NOT NULL COMMENT '服务提供者ID',
    title VARCHAR(200) NOT NULL COMMENT '服务标题',
    description TEXT COMMENT '服务描述',
    location VARCHAR(200) COMMENT '服务地点',
    price DECIMAL(10,2) NOT NULL COMMENT '服务价格',
    service_type VARCHAR(50) COMMENT '服务类型',
    max_pets INT DEFAULT 1 COMMENT '最大接待宠物数',
    availability_status VARCHAR(20) DEFAULT 'AVAILABLE' COMMENT '可用状态',
    rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
    review_count INT DEFAULT 0 COMMENT '评价数量',
    images TEXT COMMENT '服务图片URL列表',
    features TEXT COMMENT '服务特色',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否已删除',
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_provider_id (provider_id) COMMENT '服务提供者ID索引',
    INDEX idx_location (location) COMMENT '地点索引',
    INDEX idx_price (price) COMMENT '价格索引',
    INDEX idx_rating (rating) COMMENT '评分索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='寄养服务信息表';

-- 预约表
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '预约唯一标识符',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    foster_service_id BIGINT NOT NULL COMMENT '寄养服务ID',
    pet_id BIGINT COMMENT '宠物ID',
    start_date DATE NOT NULL COMMENT '开始日期',
    end_date DATE NOT NULL COMMENT '结束日期',
    total_price DECIMAL(10,2) NOT NULL COMMENT '总价',
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING' COMMENT '预约状态：待处理、已确认、已完成、已取消',
    special_requests TEXT COMMENT '特殊要求',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否已删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (foster_service_id) REFERENCES foster_services(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_service_id (foster_service_id) COMMENT '服务ID索引',
    INDEX idx_status (status) COMMENT '状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约信息表';

-- 支付表
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '支付唯一标识符',
    booking_id BIGINT NOT NULL COMMENT '预约ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
    currency VARCHAR(3) DEFAULT 'CNY' COMMENT '货币类型',
    payment_method VARCHAR(50) COMMENT '支付方式',
    payment_intent_id VARCHAR(100) COMMENT '支付意图ID',
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED') DEFAULT 'PENDING' COMMENT '支付状态：待处理、已完成、失败、已退款、已取消',
    transaction_id VARCHAR(100) COMMENT '交易ID',
    failure_reason VARCHAR(500) COMMENT '失败原因',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否已删除',
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_booking_id (booking_id) COMMENT '预约ID索引',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_status (status) COMMENT '状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付信息表';

-- 评价表
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '评价唯一标识符',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_id BIGINT NOT NULL COMMENT '评价目标ID',
    target_type VARCHAR(20) NOT NULL COMMENT '评价目标类型',
    rating INT NOT NULL COMMENT '评分（1-5）',
    comment TEXT COMMENT '评价内容',
    booking_id BIGINT COMMENT '预约ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否已删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_target (target_id, target_type) COMMENT '评价目标索引',
    INDEX idx_booking_id (booking_id) COMMENT '预约ID索引',
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价信息表';

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '消息唯一标识符',
    conversation_id VARCHAR(100) NOT NULL COMMENT '会话ID',
    sender_id BIGINT NOT NULL COMMENT '发送者ID',
    receiver_id BIGINT NOT NULL COMMENT '接收者ID',
    content TEXT NOT NULL COMMENT '消息内容',
    is_read BOOLEAN DEFAULT FALSE COMMENT '是否已读',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否已删除',
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id) COMMENT '会话ID索引',
    INDEX idx_sender_id (sender_id) COMMENT '发送者ID索引',
    INDEX idx_receiver_id (receiver_id) COMMENT '接收者ID索引',
    INDEX idx_created_at (created_at) COMMENT '创建时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息信息表';

-- 文件上传表
CREATE TABLE IF NOT EXISTS file_uploads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '文件上传唯一标识符',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_type VARCHAR(50) COMMENT '文件类型',
    file_size BIGINT COMMENT '文件大小',
    content_type VARCHAR(100) COMMENT '内容类型',
    entity_type VARCHAR(50) COMMENT '关联实体类型',
    entity_id BIGINT COMMENT '关联实体ID',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted BOOLEAN DEFAULT FALSE COMMENT '是否已删除',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id) COMMENT '用户ID索引',
    INDEX idx_entity (entity_type, entity_id) COMMENT '实体索引',
    INDEX idx_file_type (file_type) COMMENT '文件类型索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件上传信息表';
