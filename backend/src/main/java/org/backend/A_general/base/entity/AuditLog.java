package org.backend.A_general.base.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicUpdate;

/**
 * 审计日志实体
 * 用于记录系统中的重要操作日志
 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "audit_log")
@Data
@DynamicUpdate
public class AuditLog extends BaseEntity {

    /**
     * 操作人ID
     */
    @Column(name = "operator_id", nullable = false)
    private Long operatorId;

    /**
     * 操作人名称
     */
    @Column(name = "operator_name", nullable = false)
    private String operatorName;

    /**
     * 操作类型
     */
    @Column(name = "operation_type", nullable = false, length = 50)
    private String operationType;

    /**
     * 操作内容
     */
    @Column(name = "operation_content", nullable = false)
    private String operationContent;

    /**
     * 请求IP地址
     */
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    /**
     * 用户代理（浏览器信息等）
     */
    @Column(name = "user_agent")
    private String userAgent;

    /**
     * 操作模块
     */
    @Column(name = "module", length = 100)
    private String module;

    /**
     * 操作结果
     */
    @Column(name = "result", nullable = false)
    private Boolean result;

    /**
     * 错误信息
     */
    @Column(name = "error_message")
    private String errorMessage;

    /**
     * 操作耗时（毫秒）
     */
    @Column(name = "execution_time")
    private Long executionTime;
}