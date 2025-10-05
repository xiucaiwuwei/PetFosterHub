package org.backend.A_general.base.repository;

import org.backend.A_general.base.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 审计日志Repository接口
 * 提供审计日志的查询和持久化操作
 */
public interface AuditLogRepository extends BaseRepository<AuditLog, Long> {

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
     * 根据操作结果查询审计日志
     *
     * @param result 操作结果
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    Page<AuditLog> findByResult(Boolean result, Pageable pageable);

    /**
     * 根据时间范围查询审计日志
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    Page<AuditLog> findByCreatedAtBetween(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

    /**
     * 复合条件查询审计日志
     *
     * @param operatorId 操作人ID
     * @param operationType 操作类型
     * @param module 模块名称
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param result 操作结果
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    @Query("SELECT al FROM AuditLog al WHERE " +
           "(:operatorId IS NULL OR al.operatorId = :operatorId) AND " +
           "(:operationType IS NULL OR al.operationType = :operationType) AND " +
           "(:module IS NULL OR al.module = :module) AND " +
           "(:startTime IS NULL OR al.createdAt >= :startTime) AND " +
           "(:endTime IS NULL OR al.createdAt <= :endTime) AND " +
           "(:result IS NULL OR al.result = :result)")
    Page<AuditLog> findByConditions(
            @Param("operatorId") Long operatorId,
            @Param("operationType") String operationType,
            @Param("module") String module,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("result") Boolean result,
            Pageable pageable);

    /**
     * 查询最近N条审计日志
     *
     * @param limit 查询数量
     * @return 审计日志列表
     */
    List<AuditLog> findTopNByOrderByCreatedAtDesc(int limit);
}