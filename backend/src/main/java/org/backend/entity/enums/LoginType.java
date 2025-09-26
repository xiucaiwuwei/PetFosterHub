package org.backend.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * 登录类型枚举
 */
public enum LoginType {
    PASSWORD("password", "密码登录"),
    VERIFICATION_CODE("verificationCode", "验证码登录");

    private final String value;
    private final String description;

    LoginType(String value, String description) {
        this.value = value;
        this.description = description;
    }

    /**
     * 根据字符串值获取枚举
     */
    public static LoginType fromValue(String value) {
        for (LoginType type : values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("无效的登录类型: " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }
}