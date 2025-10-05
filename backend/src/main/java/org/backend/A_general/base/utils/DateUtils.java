package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.Date;

/**
 * 日期时间工具类
 * 提供日期时间的格式化、解析、计算等功能
 */
public class DateUtils {

    private static final Logger logger = LoggerFactory.getLogger(DateUtils.class);

    // 常用日期时间格式
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String TIME_FORMAT = "HH:mm:ss";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DATETIME_WITH_MILLIS_FORMAT = "yyyy-MM-dd HH:mm:ss.SSS";
    public static final String ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

    /**
     * 将Date对象转换为指定格式的字符串
     *
     * @param date    日期对象
     * @param pattern 日期格式
     * @return 格式化后的日期字符串
     */
    public static String format(Date date, String pattern) {
        if (date == null || pattern == null || pattern.isEmpty()) {
            return null;
        }
        try {
            Instant instant = date.toInstant();
            ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());
            LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
            return format(localDateTime, pattern);
        } catch (Exception e) {
            logger.error("格式化日期失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将LocalDateTime对象转换为指定格式的字符串
     *
     * @param dateTime 日期时间对象
     * @param pattern  日期格式
     * @return 格式化后的日期字符串
     */
    public static String format(LocalDateTime dateTime, String pattern) {
        if (dateTime == null || pattern == null || pattern.isEmpty()) {
            return null;
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return dateTime.format(formatter);
        } catch (Exception e) {
            logger.error("格式化日期时间失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将LocalDate对象转换为指定格式的字符串
     *
     * @param date    日期对象
     * @param pattern 日期格式
     * @return 格式化后的日期字符串
     */
    public static String format(LocalDate date, String pattern) {
        if (date == null || pattern == null || pattern.isEmpty()) {
            return null;
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return date.format(formatter);
        } catch (Exception e) {
            logger.error("格式化日期失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 解析日期字符串为Date对象
     *
     * @param dateStr 日期字符串
     * @param pattern 日期格式
     * @return Date对象
     */
    public static Date parseToDate(String dateStr, String pattern) {
        if (dateStr == null || dateStr.isEmpty() || pattern == null || pattern.isEmpty()) {
            return null;
        }
        try {
            LocalDateTime localDateTime = parseToLocalDateTime(dateStr, pattern);
            if (localDateTime != null) {
                ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
                return Date.from(zonedDateTime.toInstant());
            }
            return null;
        } catch (Exception e) {
            logger.error("解析日期字符串为Date对象失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 解析日期字符串为LocalDateTime对象
     *
     * @param dateStr 日期字符串
     * @param pattern 日期格式
     * @return LocalDateTime对象
     */
    public static LocalDateTime parseToLocalDateTime(String dateStr, String pattern) {
        if (dateStr == null || dateStr.isEmpty() || pattern == null || pattern.isEmpty()) {
            return null;
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return LocalDateTime.parse(dateStr, formatter);
        } catch (Exception e) {
            logger.error("解析日期字符串为LocalDateTime对象失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 解析日期字符串为LocalDate对象
     *
     * @param dateStr 日期字符串
     * @param pattern 日期格式
     * @return LocalDate对象
     */
    public static LocalDate parseToLocalDate(String dateStr, String pattern) {
        if (dateStr == null || dateStr.isEmpty() || pattern == null || pattern.isEmpty()) {
            return null;
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
            return LocalDate.parse(dateStr, formatter);
        } catch (Exception e) {
            logger.error("解析日期字符串为LocalDate对象失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 获取当前日期时间
     *
     * @return 当前日期时间
     */
    public static LocalDateTime now() {
        return LocalDateTime.now();
    }

    /**
     * 获取当前日期
     *
     * @return 当前日期
     */
    public static LocalDate today() {
        return LocalDate.now();
    }

    /**
     * 获取当前时间
     *
     * @return 当前时间
     */
    public static LocalTime currentTime() {
        return LocalTime.now();
    }

    /**
     * 计算两个日期之间的天数差
     *
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 天数差
     */
    public static long daysBetween(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(startDate, endDate);
    }

    /**
     * 计算两个日期时间之间的小时差
     *
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return 小时差
     */
    public static long hoursBetween(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            return 0;
        }
        return ChronoUnit.HOURS.between(startTime, endTime);
    }

    /**
     * 计算两个日期时间之间的分钟差
     *
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return 分钟差
     */
    public static long minutesBetween(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            return 0;
        }
        return ChronoUnit.MINUTES.between(startTime, endTime);
    }

    /**
     * 计算两个日期时间之间的秒差
     *
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return 秒差
     */
    public static long secondsBetween(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            return 0;
        }
        return ChronoUnit.SECONDS.between(startTime, endTime);
    }

    /**
     * 日期加减天数
     *
     * @param date   原始日期
     * @param days   天数（正数加，负数减）
     * @return 计算后的日期
     */
    public static LocalDate plusDays(LocalDate date, long days) {
        if (date == null) {
            return null;
        }
        return date.plusDays(days);
    }

    /**
     * 日期时间加减天数
     *
     * @param dateTime 原始日期时间
     * @param days     天数（正数加，负数减）
     * @return 计算后的日期时间
     */
    public static LocalDateTime plusDays(LocalDateTime dateTime, long days) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.plusDays(days);
    }

    /**
     * 日期时间加减小时
     *
     * @param dateTime 原始日期时间
     * @param hours    小时数（正数加，负数减）
     * @return 计算后的日期时间
     */
    public static LocalDateTime plusHours(LocalDateTime dateTime, long hours) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.plusHours(hours);
    }

    /**
     * 日期时间加减分钟
     *
     * @param dateTime 原始日期时间
     * @param minutes  分钟数（正数加，负数减）
     * @return 计算后的日期时间
     */
    public static LocalDateTime plusMinutes(LocalDateTime dateTime, long minutes) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.plusMinutes(minutes);
    }

    /**
     * 日期时间加减秒
     *
     * @param dateTime 原始日期时间
     * @param seconds  秒数（正数加，负数减）
     * @return 计算后的日期时间
     */
    public static LocalDateTime plusSeconds(LocalDateTime dateTime, long seconds) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.plusSeconds(seconds);
    }

    /**
     * 获取本月第一天
     *
     * @return 本月第一天
     */
    public static LocalDate firstDayOfMonth() {
        return firstDayOfMonth(LocalDate.now());
    }

    /**
     * 获取指定日期所在月的第一天
     *
     * @param date 指定日期
     * @return 指定日期所在月的第一天
     */
    public static LocalDate firstDayOfMonth(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.with(TemporalAdjusters.firstDayOfMonth());
    }

    /**
     * 获取本月最后一天
     *
     * @return 本月最后一天
     */
    public static LocalDate lastDayOfMonth() {
        return lastDayOfMonth(LocalDate.now());
    }

    /**
     * 获取指定日期所在月的最后一天
     *
     * @param date 指定日期
     * @return 指定日期所在月的最后一天
     */
    public static LocalDate lastDayOfMonth(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.with(TemporalAdjusters.lastDayOfMonth());
    }

    /**
     * 判断两个日期是否是同一天
     *
     * @param date1 第一个日期
     * @param date2 第二个日期
     * @return 是否是同一天
     */
    public static boolean isSameDay(LocalDateTime date1, LocalDateTime date2) {
        if (date1 == null || date2 == null) {
            return false;
        }
        return date1.toLocalDate().equals(date2.toLocalDate());
    }

    /**
     * 判断一个日期是否在另一个日期之前
     *
     * @param date1 第一个日期
     * @param date2 第二个日期
     * @return 第一个日期是否在第二个日期之前
     */
    public static boolean isBefore(LocalDateTime date1, LocalDateTime date2) {
        if (date1 == null || date2 == null) {
            return false;
        }
        return date1.isBefore(date2);
    }

    /**
     * 判断一个日期是否在另一个日期之后
     *
     * @param date1 第一个日期
     * @param date2 第二个日期
     * @return 第一个日期是否在第二个日期之后
     */
    public static boolean isAfter(LocalDateTime date1, LocalDateTime date2) {
        if (date1 == null || date2 == null) {
            return false;
        }
        return date1.isAfter(date2);
    }

    /**
     * 判断一个日期是否在两个日期之间
     *
     * @param date     要判断的日期
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 日期是否在范围内
     */
    public static boolean isBetween(LocalDateTime date, LocalDateTime startDate, LocalDateTime endDate) {
        if (date == null || startDate == null || endDate == null) {
            return false;
        }
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }

    /**
     * 将LocalDateTime转换为时间戳（毫秒）
     *
     * @param dateTime 日期时间
     * @return 时间戳（毫秒）
     */
    public static long toTimestamp(LocalDateTime dateTime) {
        if (dateTime == null) {
            return 0;
        }
        ZonedDateTime zonedDateTime = dateTime.atZone(ZoneId.systemDefault());
        return zonedDateTime.toInstant().toEpochMilli();
    }

    /**
     * 将时间戳（毫秒）转换为LocalDateTime
     *
     * @param timestamp 时间戳（毫秒）
     * @return LocalDateTime对象
     */
    public static LocalDateTime fromTimestamp(long timestamp) {
        Instant instant = Instant.ofEpochMilli(timestamp);
        ZonedDateTime zonedDateTime = instant.atZone(ZoneId.systemDefault());
        return zonedDateTime.toLocalDateTime();
    }
}