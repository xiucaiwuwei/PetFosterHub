package org.backend.entity.enums;

public enum PaymentStatus {
    PENDING,      // 待支付
    PROCESSING,   // 处理中
    SUCCESS,      // 支付成功
    FAILED,       // 支付失败
    CANCELLED,    // 已取消
    REFUNDED      // 已退款
}
