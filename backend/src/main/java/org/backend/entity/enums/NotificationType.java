package org.backend.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import java.util.Arrays;

/**
 * 通知类型枚举
 * 定义不同类型的通知
 * 与前端TypeScript的NotificationType枚举保持一致
 */
@Getter
public enum NotificationType {
    INFO("info", "信息通知"),
    SUCCESS("success", "成功通知"),
    WARNING("warning", "警告通知"),
    ERROR("error", "错误通知"),
    DEFAULT("default", "默认通知");

    private final String value;
    private final String description;

    NotificationType(String value, String description) {
        this.value = value;
        this.description = description;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    /**
     * 根据值获取枚举
     * @param value 枚举值
     * @return 枚举实例
     */
    public static NotificationType fromValue(String value) {
        return Arrays.stream(values())
                .filter(type -> type.getValue().equals(value))
                .findFirst()
                .orElse(DEFAULT);
    }
}