-- PetFosterHub 基础数据库初始数据
-- 创建时间: " + java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "

-- 初始化审计日志数据
INSERT INTO audit_log (operator_id, operator_name, operation_type, operation_content, ip_address, user_agent, module, result, error_message, execution_time, created_at, updated_at)
VALUES 
  (1, '系统管理员', 'SYSTEM_INIT', '系统初始化完成', '127.0.0.1', 'System', 'SYSTEM', true, null, 1000, NOW(), NOW()),
  (1, '系统管理员', 'USER_CREATE', '创建管理员账户', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 'USER', true, null, 500, NOW(), NOW()),
  (1, '系统管理员', 'CONFIG_UPDATE', '更新系统配置', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36', 'SYSTEM', true, null, 300, NOW(), NOW());

-- 初始化文件上传示例数据
INSERT INTO file_uploads (user_id, file_name, original_name, file_path, file_type, file_size, content_type, entity_type, entity_id, is_public, deleted, created_at, updated_at)
VALUES 
  (1, 'admin_avatar.png', 'profile.png', '/uploads/avatars/admin_avatar.png', 'AVATAR', 204800, 'image/png', 'USER', 1, false, false, NOW(), NOW()),
  (1, 'system_logo.png', 'logo.png', '/uploads/system/system_logo.png', 'OTHER', 153600, 'image/png', 'SYSTEM', 1, true, false, NOW(), NOW());