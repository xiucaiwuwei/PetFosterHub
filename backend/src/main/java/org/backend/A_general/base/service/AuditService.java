package org.backend.A_general.base.service;

import org.backend.A_general.base.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 审计日志服务接口
 * 提供审计日志的记录和查询功能
 */
public interface AuditService extends BaseService<AuditLog, Long> {

    /**
     * 记录审计日志
     *
     * @param operatorId 操作人ID
     * @param operatorName 操作人名称
     * @param operationType 操作类型
     * @param operationContent 操作内容
     * @param ipAddress IP地址
     * @param userAgent 用户代理
     * @param module 模块名称
     * @param result 操作结果
     * @param errorMessage 错误信息
     * @param executionTime 执行时间（毫秒）
     * @return 保存的审计日志
     */
    AuditLog logAudit(
            Long operatorId,
            String operatorName,
            String operationType,
            String operationContent,
            String ipAddress,
            String userAgent,
            String module,
            Boolean result,
            String errorMessage,
            Long executionTime);

    /**
     * 根据操作人ID查询审计日志
     *
     * @param operatorId 操作人ID
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    Page<AuditLog> findByOperatorId(Long operatorId, Pageable pageable);

    /**
     * 根据操作类型查询审计日志
     *
     * @param operationType 操作类型
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    Page<AuditLog> findByOperationType(String operationType, Pageable pageable);

    /**
     * 根据模块查询审计日志
     *
     * @param module 模块名称
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    Page<AuditLog> findByModule(String module, Pageable pageable);

    /**
     * 根据时间范围查询审计日志
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    Page<AuditLog> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 复合条件查询审计日志
     *
     * @param conditions 查询条件
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    Page<AuditLog> findByConditions(Map<String, Object> conditions, Pageable pageable);

    /**
     * 查询最近N条审计日志
     *
     * @param limit 查询数量
     * @return 审计日志列表
     */
    List<AuditLog> findRecentLogs(int limit);

    /**
     * 统计指定时间范围内的操作次数
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作次数统计
     */
    Map<String, Long> countByOperationType(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 统计指定时间范围内的操作成功率
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作成功率（0-1之间的小数）
     */
    Double calculateSuccessRate(LocalDateTime startTime, LocalDateTime endTime);
}