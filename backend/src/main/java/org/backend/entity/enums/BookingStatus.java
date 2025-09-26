package org.backend.entity.enums;

public enum BookingStatus {
    PENDING,      // 待确认
    CONFIRMED,    // 已确认
    IN_PROGRESS,  // 进行中
    COMPLETED,    // 已完成
    CANCELLED,    // 已取消
    REJECTED      // 已拒绝
}
