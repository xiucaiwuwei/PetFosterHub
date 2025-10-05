package org.backend.A_general.base.service.impl;

import org.backend.A_general.base.entity.AuditLog;
import org.backend.A_general.base.repository.AuditLogRepository;
import org.backend.A_general.base.service.AuditService;
import org.backend.A_general.base.utils.StringUtils;
import org.backend.A_general.base.utils.CollectionUtils;
import org.backend.A_general.base.utils.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 审计日志服务实现类
 * 实现审计日志的记录和查询功能
 */
@Service
public class AuditServiceImpl extends BaseServiceImpl<AuditLog, Long, AuditLogRepository> implements AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditServiceImpl.class);

    public AuditServiceImpl(AuditLogRepository repository) {
        super(repository);
    }

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
    @Override
    @Transactional
    public AuditLog logAudit(
            Long operatorId,
            String operatorName,
            String operationType,
            String operationContent,
            String ipAddress,
            String userAgent,
            String module,
            Boolean result,
            String errorMessage,
            Long executionTime) {
        
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setOperatorId(operatorId);
            auditLog.setOperatorName(StringUtils.defaultIfBlank(operatorName, "未知用户"));
            auditLog.setOperationType(StringUtils.defaultIfBlank(operationType, "UNKNOWN"));
            auditLog.setOperationContent(StringUtils.defaultIfBlank(operationContent, ""));
            auditLog.setIpAddress(StringUtils.defaultIfBlank(ipAddress, ""));
            auditLog.setUserAgent(StringUtils.defaultIfBlank(userAgent, ""));
            auditLog.setModule(StringUtils.defaultIfBlank(module, ""));
            auditLog.setResult(result != null ? result : true);
            auditLog.setErrorMessage(errorMessage);
            auditLog.setExecutionTime(executionTime);
            
            return repository.save(auditLog);
        } catch (Exception e) {
            logger.error("记录审计日志失败: {}", ExceptionUtils.getSimpleMessage(e));
            logger.debug("审计日志记录失败详细堆栈: {}", ExceptionUtils.getStackTrace(e));
            // 审计日志记录失败不应影响主业务流程
            return null;
        }
    }

    /**
     * 根据操作人ID查询审计日志
     *
     * @param operatorId 操作人ID
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    @Override
    public Page<AuditLog> findByOperatorId(Long operatorId, Pageable pageable) {
        return repository.findByOperatorId(operatorId, pageable);
    }

    /**
     * 根据操作类型查询审计日志
     *
     * @param operationType 操作类型
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    @Override
    public Page<AuditLog> findByOperationType(String operationType, Pageable pageable) {
        return repository.findByOperationType(operationType, pageable);
    }

    /**
     * 根据模块查询审计日志
     *
     * @param module 模块名称
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    @Override
    public Page<AuditLog> findByModule(String module, Pageable pageable) {
        return repository.findByModule(module, pageable);
    }

    /**
     * 根据时间范围查询审计日志
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    @Override
    public Page<AuditLog> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable) {
        return repository.findByCreatedAtBetween(startTime, endTime, pageable);
    }

    /**
     * 复合条件查询审计日志
     *
     * @param conditions 查询条件
     * @param pageable 分页参数
     * @return 审计日志分页结果
     */
    @Override
    public Page<AuditLog> findByConditions(Map<String, Object> conditions, Pageable pageable) {
        if (CollectionUtils.isEmpty(conditions)) {
            return repository.findAll(pageable);
        }
        
        Long operatorId = conditions.get("operatorId") instanceof Long ? (Long) conditions.get("operatorId") : null;
        String operationType = conditions.get("operationType") instanceof String ? (String) conditions.get("operationType") : null;
        String module = conditions.get("module") instanceof String ? (String) conditions.get("module") : null;
        LocalDateTime startTime = conditions.get("startTime") instanceof LocalDateTime ? (LocalDateTime) conditions.get("startTime") : null;
        LocalDateTime endTime = conditions.get("endTime") instanceof LocalDateTime ? (LocalDateTime) conditions.get("endTime") : null;
        Boolean result = conditions.get("result") instanceof Boolean ? (Boolean) conditions.get("result") : null;
        
        return repository.findByConditions(operatorId, operationType, module, startTime, endTime, result, pageable);
    }

    /**
     * 查询最近N条审计日志
     *
     * @param limit 查询数量
     * @return 审计日志列表
     */
    @Override
    public List<AuditLog> findRecentLogs(int limit) {
        return repository.findTopNByOrderByCreatedAtDesc(limit);
    }

    /**
     * 统计指定时间范围内的操作次数
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作次数统计
     */
    @Override
    public Map<String, Long> countByOperationType(LocalDateTime startTime, LocalDateTime endTime) {
        // 在实际项目中，可以通过自定义查询或JPA的查询方法来实现更高效的统计
        Page<AuditLog> logs = repository.findByCreatedAtBetween(startTime, endTime, Pageable.unpaged());
        Map<String, Long> countMap = new HashMap<>();
        
        if (CollectionUtils.isEmpty(logs.getContent())) {
            return countMap;
        }
        
        for (AuditLog log : logs) {
            String operationType = StringUtils.defaultIfBlank(log.getOperationType(), "UNKNOWN");
            countMap.put(operationType, countMap.getOrDefault(operationType, 0L) + 1);
        }
        
        return countMap;
    }

    /**
     * 统计指定时间范围内的操作成功率
     *
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作成功率（0-1之间的小数）
     */
    @Override
    public Double calculateSuccessRate(LocalDateTime startTime, LocalDateTime endTime) {
        // 在实际项目中，可以通过自定义查询或JPA的查询方法来实现更高效的统计
        Page<AuditLog> logs = repository.findByCreatedAtBetween(startTime, endTime, Pageable.unpaged());
        
        if (logs.isEmpty()) {
            return 1.0;
        }
        
        long successCount = logs.stream().filter(AuditLog::getResult).count();
        return (double) successCount / logs.getTotalElements();
    }
}