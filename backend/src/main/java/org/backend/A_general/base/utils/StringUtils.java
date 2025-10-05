package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 字符串工具类
 * 提供字符串的判断、转换、处理等功能
 */
public class StringUtils {

    private static final Logger logger = LoggerFactory.getLogger(StringUtils.class);

    /**
     * 判断字符串是否为null或空字符串
     *
     * @param str 要判断的字符串
     * @return 是否为null或空字符串
     */
    public static boolean isEmpty(String str) {
        return str == null || str.isEmpty();
    }

    /**
     * 判断字符串是否为null或空字符串或仅包含空白字符
     *
     * @param str 要判断的字符串
     * @return 是否为null或空字符串或仅包含空白字符
     */
    public static boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    /**
     * 判断字符串是否不为null且不为空字符串
     *
     * @param str 要判断的字符串
     * @return 是否不为null且不为空字符串
     */
    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    /**
     * 判断字符串是否不为null且不为空字符串且不只包含空白字符
     *
     * @param str 要判断的字符串
     * @return 是否不为null且不为空字符串且不只包含空白字符
     */
    public static boolean isNotBlank(String str) {
        return !isBlank(str);
    }

    /**
     * 获取字符串长度
     *
     * @param str 字符串
     * @return 字符串长度，如果为null则返回0
     */
    public static int length(String str) {
        return str == null ? 0 : str.length();
    }

    /**
     * 比较两个字符串是否相等，支持null值比较
     *
     * @param str1 第一个字符串
     * @param str2 第二个字符串
     * @return 两个字符串是否相等
     */
    public static boolean equals(String str1, String str2) {
        return str1.equals(str2);
    }

    /**
     * 比较两个字符串是否相等（忽略大小写）
     *
     * @param str1 第一个字符串
     * @param str2 第二个字符串
     * @return 两个字符串是否相等（忽略大小写）
     */
    public static boolean equalsIgnoreCase(String str1, String str2) {
        if (str1.equals(str2)) {
            return true;
        }
        if (str2 == null) {
            return false;
        }
        return str1.equalsIgnoreCase(str2);
    }

    /**
     * 去除字符串两端的空白字符
     *
     * @param str 字符串
     * @return 去除两端空白后的字符串
     */
    public static String trim(String str) {
        return str == null ? null : str.trim();
    }

    /**
     * 将字符串转换为大写
     *
     * @param str 字符串
     * @return 大写字符串
     */
    public static String toUpperCase(String str) {
        return str == null ? null : str.toUpperCase();
    }

    /**
     * 将字符串转换为小写
     *
     * @param str 字符串
     * @return 小写字符串
     */
    public static String toLowerCase(String str) {
        return str == null ? null : str.toLowerCase();
    }

    /**
     * 截取字符串的子串
     *
     * @param str   原字符串
     * @param start 开始索引（包含）
     * @param end   结束索引（不包含）
     * @return 子串
     */
    public static String substring(String str, int start, int end) {
        if (str == null) {
            return null;
        }
        if (start < 0) {
            start = 0;
        }
        if (end > str.length()) {
            end = str.length();
        }
        if (start > end) {
            return "";
        }
        return str.substring(start, end);
    }

    /**
     * 从指定索引开始截取字符串到末尾
     *
     * @param str   原字符串
     * @param start 开始索引（包含）
     * @return 子串
     */
    public static String substring(String str, int start) {
        if (str == null) {
            return null;
        }
        if (start < 0) {
            start = 0;
        }
        if (start > str.length()) {
            return "";
        }
        return str.substring(start);
    }

    /**
     * 检查字符串是否包含指定的子串
     *
     * @param str       原字符串
     * @param substring 子串
     * @return 是否包含
     */
    public static boolean contains(String str, String substring) {
        if (str == null || substring == null) {
            return false;
        }
        return str.contains(substring);
    }

    /**
     * 检查字符串是否以指定的前缀开头
     *
     * @param str    原字符串
     * @param prefix 前缀
     * @return 是否以指定前缀开头
     */
    public static boolean startsWith(String str, String prefix) {
        if (str == null || prefix == null) {
            return false;
        }
        return str.startsWith(prefix);
    }

    /**
     * 检查字符串是否以指定的后缀结尾
     *
     * @param str    原字符串
     * @param suffix 后缀
     * @return 是否以指定后缀结尾
     */
    public static boolean endsWith(String str, String suffix) {
        if (str == null || suffix == null) {
            return false;
        }
        return str.endsWith(suffix);
    }

    /**
     * 将字符串数组用指定的分隔符连接成一个字符串
     *
     * @param array     字符串数组
     * @param separator 分隔符
     * @return 连接后的字符串
     */
    public static String join(String[] array, String separator) {
        if (array == null) {
            return null;
        }
        if (array.length == 0) {
            return "";
        }
        if (separator == null) {
            separator = "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < array.length; i++) {
            if (i > 0) {
                sb.append(separator);
            }
            sb.append(array[i]);
        }
        return sb.toString();
    }

    /**
     * 将对象数组用指定的分隔符连接成一个字符串
     *
     * @param array     对象数组
     * @param separator 分隔符
     * @return 连接后的字符串
     */
    public static String join(Object[] array, String separator) {
        if (array == null) {
            return null;
        }
        String[] strArray = new String[array.length];
        for (int i = 0; i < array.length; i++) {
            strArray[i] = array[i] == null ? "" : array[i].toString();
        }
        return join(strArray, separator);
    }

    /**
     * 使用正则表达式替换字符串中的匹配部分
     *
     * @param str         原字符串
     * @param regex       正则表达式
     * @param replacement 替换字符串
     * @return 替换后的字符串
     */
    public static String replaceAll(String str, String regex, String replacement) {
        if (str == null || regex == null || replacement == null) {
            return str;
        }
        try {
            Pattern pattern = Pattern.compile(regex);
            Matcher matcher = pattern.matcher(str);
            return matcher.replaceAll(replacement);
        } catch (Exception e) {
            logger.error("正则替换失败: {}", e.getMessage());
            return str;
        }
    }

    /**
     * 转义HTML特殊字符
     *
     * @param str 原字符串
     * @return 转义后的字符串
     */
    public static String escapeHtml(String str) {
        if (str == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            switch (c) {
                case '<':
                    sb.append("&lt;");
                    break;
                case '>':
                    sb.append("&gt;");
                    break;
                case '&':
                    sb.append("&amp;");
                    break;
                case '"':
                    sb.append("&quot;");
                    break;
                case '\'':
                    sb.append("&#39;");
                    break;
                default:
                    sb.append(c);
                    break;
            }
        }
        return sb.toString();
    }

    /**
     * 生成指定长度的随机字符串（包含字母和数字）
     *
     * @param length 字符串长度
     * @return 随机字符串
     */
    public static String randomString(int length) {
        if (length <= 0) {
            return "";
        }
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(characters.charAt(random.nextInt(characters.length())));
        }
        return sb.toString();
    }

    /**
     * 生成指定长度的随机数字字符串
     *
     * @param length 字符串长度
     * @return 随机数字字符串
     */
    public static String randomNumberString(int length) {
        if (length <= 0) {
            return "";
        }
        String characters = "0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(characters.charAt(random.nextInt(characters.length())));
        }
        return sb.toString();
    }

    /**
     * 将字符串进行Base64编码
     *
     * @param str 原字符串
     * @return Base64编码后的字符串
     */
    public static String encodeBase64(String str) {
        if (str == null) {
            return null;
        }
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        return Base64.getEncoder().encodeToString(bytes);
    }

    /**
     * 将Base64编码的字符串解码
     *
     * @param base64Str Base64编码的字符串
     * @return 解码后的原字符串
     */
    public static String decodeBase64(String base64Str) {
        if (base64Str == null) {
            return null;
        }
        try {
            byte[] bytes = Base64.getDecoder().decode(base64Str);
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            logger.error("Base64解码失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 检查字符串是否为有效的邮箱地址
     *
     * @param email 邮箱地址字符串
     * @return 是否为有效的邮箱地址
     */
    public static boolean isEmail(String email) {
        if (isBlank(email)) {
            return false;
        }
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    /**
     * 检查字符串是否为有效的手机号码（中国大陆）
     *
     * @param phone 手机号码字符串
     * @return 是否为有效的手机号码
     */
    public static boolean isPhoneNumber(String phone) {
        if (isBlank(phone)) {
            return false;
        }
        String phoneRegex = "^1[3-9]\\d{9}$";
        Pattern pattern = Pattern.compile(phoneRegex);
        Matcher matcher = pattern.matcher(phone);
        return matcher.matches();
    }

    /**
     * 隐藏字符串的中间部分，常用于敏感信息的显示
     *
     * @param str      原字符串
     * @param startLen 保留的开始字符数
     * @param endLen   保留的结束字符数
     * @param mask     掩码字符
     * @return 隐藏中间部分后的字符串
     */
    public static String maskMiddle(String str, int startLen, int endLen, char mask) {
        if (str == null) {
            return null;
        }
        if (str.length() <= startLen + endLen) {
            return str;
        }
        return str.substring(0, startLen) +
                String.valueOf(mask).repeat(Math.max(0, str.length() - startLen - endLen)) +
                str.substring(str.length() - endLen);
    }
    
    /**
     * 如果字符串为null或空白，则返回默认值，否则返回原字符串
     *
     * @param str        原字符串
     * @param defaultStr 默认字符串
     * @return 处理后的字符串
     */
    public static String defaultIfBlank(String str, String defaultStr) {
        return isBlank(str) ? defaultStr : str;
    }

    /**
     * 补齐字符串到指定长度（左侧补零）
     *
     * @param str    原字符串
     * @param length 目标长度
     * @return 补齐后的字符串
     */
    public static String padLeft(String str, int length) {
        return padLeft(str, length, '0');
    }

    /**
     * 补齐字符串到指定长度（左侧补指定字符）
     *
     * @param str     原字符串
     * @param length  目标长度
     * @param padChar 补齐字符
     * @return 补齐后的字符串
     */
    public static String padLeft(String str, int length, char padChar) {
        if (str == null) {
            str = "";
        }
        if (str.length() >= length) {
            return str;
        }
        return String.valueOf(padChar).repeat(length - str.length()) +
                str;
    }

    /**
     * 补齐字符串到指定长度（右侧补零）
     *
     * @param str    原字符串
     * @param length 目标长度
     * @return 补齐后的字符串
     */
    public static String padRight(String str, int length) {
        return padRight(str, length, '0');
    }

    /**
     * 补齐字符串到指定长度（右侧补指定字符）
     *
     * @param str     原字符串
     * @param length  目标长度
     * @param padChar 补齐字符
     * @return 补齐后的字符串
     */
    public static String padRight(String str, int length, char padChar) {
        if (str == null) {
            str = "";
        }
        if (str.length() >= length) {
            return str;
        }
        return str +
                String.valueOf(padChar).repeat(length - str.length());
    }

    /**
     * 将驼峰命名转换为下划线命名
     *
     * @param str 驼峰命名字符串
     * @return 下划线命名字符串
     */
    public static String camelToUnderline(String str) {
        if (str == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (i > 0 && Character.isUpperCase(c)) {
                sb.append('_');
            }
            sb.append(Character.toLowerCase(c));
        }
        return sb.toString();
    }

    /**
     * 将下划线命名转换为驼峰命名
     *
     * @param str 下划线命名字符串
     * @return 驼峰命名字符串
     */
    public static String underlineToCamel(String str) {
        if (str == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        boolean nextUpperCase = false;
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (c == '_') {
                nextUpperCase = true;
            } else {
                if (nextUpperCase) {
                    sb.append(Character.toUpperCase(c));
                    nextUpperCase = false;
                } else {
                    sb.append(c);
                }
            }
        }
        return sb.toString();
    }
}