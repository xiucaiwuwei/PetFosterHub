package org.backend.utils;

import org.apache.commons.lang3.StringUtils;

import java.util.regex.Pattern;

/**
 * 验证工具类
 * 提供常见数据格式的验证功能
 */
public class ValidationUtil {

    // 手机号正则表达式
    private static final Pattern PHONE_PATTERN = Pattern.compile("^1[3-9]\\d{9}$");

    // 身份证号正则表达式（18位）
    private static final Pattern ID_CARD_PATTERN = Pattern.compile("^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$");

    // 邮箱正则表达式
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+");

    /**
     * 验证手机号格式是否正确
     *
     * @param phone 手机号
     * @return 是否为有效手机号
     */
    public static boolean isValidPhone(String phone) {
        if (StringUtils.isEmpty(phone)) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone).matches();
    }

    /**
     * 验证身份证号格式是否正确
     *
     * @param idCard 身份证号
     * @return 是否为有效身份证号
     */
    public static boolean isValidIdCard(String idCard) {
        if (StringUtils.isEmpty(idCard)) {
            return false;
        }
        return ID_CARD_PATTERN.matcher(idCard).matches();
    }

    /**
     * 验证邮箱格式是否正确
     *
     * @param email 邮箱
     * @return 是否为有效邮箱
     */
    public static boolean isValidEmail(String email) {
        if (StringUtils.isEmpty(email)) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * 验证密码是否符合安全要求
     * 要求：8-20位，包含字母和数字
     *
     * @param password 密码
     * @return 是否为有效密码
     */
    public static boolean isValidPassword(String password) {
        if (StringUtils.isEmpty(password)) {
            return false;
        }
        if (password.length() < 8 || password.length() > 20) {
            return false;
        }
        // 包含至少一个字母和一个数字
        boolean hasLetter = false;
        boolean hasDigit = false;
        for (char c : password.toCharArray()) {
            if (Character.isLetter(c)) {
                hasLetter = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            }
        }
        return hasLetter && hasDigit;
    }

    /**
     * 验证字符串长度是否在指定范围内
     *
     * @param str     字符串
     * @param minLen  最小长度
     * @param maxLen  最大长度
     * @return 是否在范围内
     */
    public static boolean isValidLength(String str, int minLen, int maxLen) {
        if (str == null) {
            return false;
        }
        return str.length() >= minLen && str.length() <= maxLen;
    }

    /**
     * 验证字符串是否只包含字母和数字
     *
     * @param str 字符串
     * @return 是否只包含字母和数字
     */
    public static boolean isAlphaNumeric(String str) {
        if (StringUtils.isEmpty(str)) {
            return false;
        }
        return str.matches("^[a-zA-Z0-9]+$");
    }
}