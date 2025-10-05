-- 审计日志表 (audit_log)
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    operator_id BIGINT NOT NULL COMMENT '操作人ID',
    operator_name VARCHAR(100) NOT NULL COMMENT '操作人名称',
    operation_type VARCHAR(50) NOT NULL COMMENT '操作类型',
    operation_content TEXT NOT NULL COMMENT '操作内容',
    ip_address VARCHAR(50) COMMENT '请求IP地址',
    user_agent TEXT COMMENT '用户代理（浏览器信息等）',
    module VARCHAR(100) COMMENT '操作模块',
    result BOOLEAN NOT NULL COMMENT '操作结果',
    error_message TEXT COMMENT '错误信息',
    execution_time BIGINT COMMENT '操作耗时（毫秒）',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_operator_id (operator_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_module (module),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审计日志表，用于记录系统中的重要操作日志';

-- 文件上传表 (file_uploads)
CREATE TABLE IF NOT EXISTS file_uploads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '上传用户ID',
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
    file_path VARCHAR(1000) NOT NULL COMMENT '文件路径',
    file_type VARCHAR(50) NOT NULL COMMENT '文件类型（AVATAR:头像, PET:宠物图片, SERVICE:服务图片, IDENTITY:身份认证, OTHER:其他）',
    file_size BIGINT COMMENT '文件大小 (字节)',
    content_type VARCHAR(100) COMMENT '内容类型',
    entity_type VARCHAR(100) COMMENT '关联实体类型',
    entity_id BIGINT COMMENT '关联实体ID',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开访问',
    deleted BOOLEAN DEFAULT FALSE COMMENT '逻辑删除',
    created_at DATETIME NOT NULL COMMENT '创建时间',
    updated_at DATETIME NOT NULL COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_file_type (file_type),
    INDEX idx_entity_type (entity_type),
    INDEX idx_entity_id (entity_id),
    INDEX idx_is_public (is_public),
    INDEX idx_deleted (deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件上传表，用于存储上传文件的元数据信息';