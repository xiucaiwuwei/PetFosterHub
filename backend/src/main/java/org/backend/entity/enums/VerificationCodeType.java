package org.backend.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 验证码类型枚举
 */
public enum VerificationCodeType {
    LOGIN("login", "登录验证码"),
    REGISTER("register", "注册验证码"),
    FORGET_PASSWORD("forgetPassword", "找回密码验证码");

    private final String value;
    @Getter
    private final String description;

    VerificationCodeType(String value, String description) {
        this.value = value;
        this.description = description;
    }

    /**
     * 根据字符串值获取枚举
     */
    public static VerificationCodeType fromValue(String value) {
        for (VerificationCodeType type : values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("无效的验证码类型: " + value);
    }

    @JsonValue
    public String getValue() {
        return value;
    }

}