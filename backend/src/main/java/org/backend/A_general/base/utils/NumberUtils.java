package org.backend.A_general.base.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Random;

/**
 * 数字工具类
 * 提供数字的转换、格式化、计算等功能
 */
public class NumberUtils {

    private static final Logger logger = LoggerFactory.getLogger(NumberUtils.class);

    /**
     * 将对象转换为int值
     *
     * @param obj 要转换的对象
     * @return 转换后的int值，转换失败返回0
     */
    public static int toInt(Object obj) {
        if (obj == null) {
            return 0;
        }
        if (obj instanceof Integer) {
            return (Integer) obj;
        }
        try {
            if (obj instanceof String) {
                return Integer.parseInt((String) obj);
            }
            if (obj instanceof Number) {
                return ((Number) obj).intValue();
            }
            return Integer.parseInt(obj.toString());
        } catch (Exception e) {
            logger.error("转换为int失败: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * 将对象转换为long值
     *
     * @param obj 要转换的对象
     * @return 转换后的long值，转换失败返回0L
     */
    public static long toLong(Object obj) {
        if (obj == null) {
            return 0L;
        }
        if (obj instanceof Long) {
            return (Long) obj;
        }
        try {
            if (obj instanceof String) {
                return Long.parseLong((String) obj);
            }
            if (obj instanceof Number) {
                return ((Number) obj).longValue();
            }
            return Long.parseLong(obj.toString());
        } catch (Exception e) {
            logger.error("转换为long失败: {}", e.getMessage());
            return 0L;
        }
    }

    /**
     * 将对象转换为double值
     *
     * @param obj 要转换的对象
     * @return 转换后的double值，转换失败返回0.0
     */
    public static double toDouble(Object obj) {
        if (obj == null) {
            return 0.0;
        }
        if (obj instanceof Double) {
            return (Double) obj;
        }
        try {
            if (obj instanceof String) {
                return Double.parseDouble((String) obj);
            }
            if (obj instanceof Number) {
                return ((Number) obj).doubleValue();
            }
            return Double.parseDouble(obj.toString());
        } catch (Exception e) {
            logger.error("转换为double失败: {}", e.getMessage());
            return 0.0;
        }
    }

    /**
     * 将对象转换为float值
     *
     * @param obj 要转换的对象
     * @return 转换后的float值，转换失败返回0.0f
     */
    public static float toFloat(Object obj) {
        if (obj == null) {
            return 0.0f;
        }
        if (obj instanceof Float) {
            return (Float) obj;
        }
        try {
            if (obj instanceof String) {
                return Float.parseFloat((String) obj);
            }
            if (obj instanceof Number) {
                return ((Number) obj).floatValue();
            }
            return Float.parseFloat(obj.toString());
        } catch (Exception e) {
            logger.error("转换为float失败: {}", e.getMessage());
            return 0.0f;
        }
    }

    /**
     * 将对象转换为BigDecimal
     *
     * @param obj 要转换的对象
     * @return 转换后的BigDecimal，转换失败返回BigDecimal.ZERO
     */
    public static BigDecimal toBigDecimal(Object obj) {
        if (obj == null) {
            return BigDecimal.ZERO;
        }
        if (obj instanceof BigDecimal) {
            return (BigDecimal) obj;
        }
        try {
            if (obj instanceof String) {
                return new BigDecimal((String) obj);
            }
            if (obj instanceof Number) {
                return new BigDecimal(obj.toString());
            }
            return new BigDecimal(obj.toString());
        } catch (Exception e) {
            logger.error("转换为BigDecimal失败: {}", e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    /**
     * 判断一个字符串是否可以转换为数字
     *
     * @param str 要判断的字符串
     * @return 是否可以转换为数字
     */
    public static boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    /**
     * 格式化数字，保留指定的小数位数
     *
     * @param num       要格式化的数字
     * @param scale     小数位数
     * @return 格式化后的字符串
     */
    public static String format(double num, int scale) {
        return format(num, scale, RoundingMode.HALF_UP);
    }

    /**
     * 格式化数字，保留指定的小数位数，并指定舍入模式
     *
     * @param num       要格式化的数字
     * @param scale     小数位数
     * @param roundingMode 舍入模式
     * @return 格式化后的字符串
     */
    public static String format(double num, int scale, RoundingMode roundingMode) {
        try {
            BigDecimal bd = new BigDecimal(num);
            bd = bd.setScale(scale, roundingMode);
            return bd.toString();
        } catch (Exception e) {
            logger.error("格式化数字失败: {}", e.getMessage());
            return String.valueOf(num);
        }
    }

    /**
     * 格式化数字，使用指定的格式
     *
     * @param num   要格式化的数字
     * @param pattern 格式模式
     * @return 格式化后的字符串
     */
    public static String format(double num, String pattern) {
        try {
            DecimalFormat df = new DecimalFormat(pattern);
            return df.format(num);
        } catch (Exception e) {
            logger.error("格式化数字失败: {}", e.getMessage());
            return String.valueOf(num);
        }
    }

    /**
     * 计算百分比
     *
     * @param part      部分数值
     * @param total     总数值
     * @param scale     小数位数
     * @return 百分比值
     */
    public static double calculatePercentage(double part, double total, int scale) {
        if (total == 0) {
            return 0;
        }
        BigDecimal partBd = new BigDecimal(part);
        BigDecimal totalBd = new BigDecimal(total);
        return partBd.divide(totalBd, scale + 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal(100))
                .setScale(scale, RoundingMode.HALF_UP)
                .doubleValue();
    }

    /**
     * 计算百分比并格式化
     *
     * @param part      部分数值
     * @param total     总数值
     * @param scale     小数位数
     * @return 格式化后的百分比字符串
     */
    public static String formatPercentage(double part, double total, int scale) {
        double percentage = calculatePercentage(part, total, scale);
        NumberFormat nf = NumberFormat.getPercentInstance();
        nf.setMinimumFractionDigits(scale);
        nf.setMaximumFractionDigits(scale);
        return nf.format(percentage / 100);
    }

    /**
     * 生成指定范围内的随机整数
     *
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @return 随机整数
     */
    public static int randomInt(int min, int max) {
        if (min > max) {
            int temp = min;
            min = max;
            max = temp;
        }
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }

    /**
     * 生成指定范围内的随机浮点数
     *
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @return 随机浮点数
     */
    public static double randomDouble(double min, double max) {
        if (min > max) {
            double temp = min;
            min = max;
            max = temp;
        }
        Random random = new Random();
        return min + (max - min) * random.nextDouble();
    }

    /**
     * 保留指定小数位数，使用四舍五入
     *
     * @param num   原始数值
     * @param scale 小数位数
     * @return 保留小数位数后的数值
     */
    public static double round(double num, int scale) {
        return round(num, scale, RoundingMode.HALF_UP);
    }

    /**
     * 保留指定小数位数，使用指定的舍入模式
     *
     * @param num       原始数值
     * @param scale     小数位数
     * @param roundingMode 舍入模式
     * @return 保留小数位数后的数值
     */
    public static double round(double num, int scale, RoundingMode roundingMode) {
        BigDecimal bd = new BigDecimal(num);
        bd = bd.setScale(scale, roundingMode);
        return bd.doubleValue();
    }

    /**
     * 比较两个double值是否相等（考虑精度问题）
     *
     * @param d1 第一个double值
     * @param d2 第二个double值
     * @return 是否相等
     */
    public static boolean equals(double d1, double d2) {
        return Math.abs(d1 - d2) < 1e-10;
    }

    /**
     * 比较两个double值是否相等，使用指定的精度
     *
     * @param d1    第一个double值
     * @param d2    第二个double值
     * @param epsilon 精度值
     * @return 是否相等
     */
    public static boolean equals(double d1, double d2, double epsilon) {
        return Math.abs(d1 - d2) < epsilon;
    }

    /**
     * 检查数值是否在指定范围内
     *
     * @param num   要检查的数值
     * @param min   最小值（包含）
     * @param max   最大值（包含）
     * @return 是否在范围内
     */
    public static boolean isBetween(long num, long min, long max) {
        return num >= min && num <= max;
    }

    /**
     * 检查数值是否在指定范围内
     *
     * @param num   要检查的数值
     * @param min   最小值（包含）
     * @param max   最大值（包含）
     * @return 是否在范围内
     */
    public static boolean isBetween(double num, double min, double max) {
        return num >= min && num <= max;
    }

    /**
     * 限制数值在指定范围内
     *
     * @param num   要限制的数值
     * @param min   最小值
     * @param max   最大值
     * @return 限制后的数值
     */
    public static int clamp(int num, int min, int max) {
        if (num < min) {
            return min;
        }
        return Math.min(num, max);
    }

    /**
     * 限制数值在指定范围内
     *
     * @param num   要限制的数值
     * @param min   最小值
     * @param max   最大值
     * @return 限制后的数值
     */
    public static long clamp(long num, long min, long max) {
        if (num < min) {
            return min;
        }
        return Math.min(num, max);
    }

    /**
     * 限制数值在指定范围内
     *
     * @param num   要限制的数值
     * @param min   最小值
     * @param max   最大值
     * @return 限制后的数值
     */
    public static double clamp(double num, double min, double max) {
        if (num < min) {
            return min;
        }
        return Math.min(num, max);
    }

    /**
     * 计算数组的平均值
     *
     * @param array 数值数组
     * @return 平均值
     */
    public static double average(double[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }
        double sum = 0;
        for (double v : array) {
            sum += v;
        }
        return sum / array.length;
    }

    /**
     * 计算数组的平均值
     *
     * @param array 数值数组
     * @return 平均值
     */
    public static double average(int[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }
        double sum = 0;
        for (int v : array) {
            sum += v;
        }
        return sum / array.length;
    }

    /**
     * 计算数组的总和
     *
     * @param array 数值数组
     * @return 总和
     */
    public static double sum(double[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }
        double sum = 0;
        for (double v : array) {
            sum += v;
        }
        return sum;
    }

    /**
     * 计算数组的总和
     *
     * @param array 数值数组
     * @return 总和
     */
    public static long sum(long[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }
        long sum = 0;
        for (long v : array) {
            sum += v;
        }
        return sum;
    }

    /**
     * 计算数组的总和
     *
     * @param array 数值数组
     * @return 总和
     */
    public static int sum(int[] array) {
        if (array == null || array.length == 0) {
            return 0;
        }
        int sum = 0;
        for (int v : array) {
            sum += v;
        }
        return sum;
    }

    /**
     * 获取数组中的最大值
     *
     * @param array 数值数组
     * @return 最大值
     */
    public static double max(double[] array) {
        if (array == null || array.length == 0) {
            return Double.MIN_VALUE;
        }
        double max = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }
        return max;
    }

    /**
     * 获取数组中的最大值
     *
     * @param array 数值数组
     * @return 最大值
     */
    public static long max(long[] array) {
        if (array == null || array.length == 0) {
            return Long.MIN_VALUE;
        }
        long max = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }
        return max;
    }

    /**
     * 获取数组中的最大值
     *
     * @param array 数值数组
     * @return 最大值
     */
    public static int max(int[] array) {
        if (array == null || array.length == 0) {
            return Integer.MIN_VALUE;
        }
        int max = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }
        return max;
    }

    /**
     * 获取数组中的最小值
     *
     * @param array 数值数组
     * @return 最小值
     */
    public static double min(double[] array) {
        if (array == null || array.length == 0) {
            return Double.MAX_VALUE;
        }
        double min = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
            }
        }
        return min;
    }

    /**
     * 获取数组中的最小值
     *
     * @param array 数值数组
     * @return 最小值
     */
    public static long min(long[] array) {
        if (array == null || array.length == 0) {
            return Long.MAX_VALUE;
        }
        long min = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
            }
        }
        return min;
    }

    /**
     * 获取数组中的最小值
     *
     * @param array 数值数组
     * @return 最小值
     */
    public static int min(int[] array) {
        if (array == null || array.length == 0) {
            return Integer.MAX_VALUE;
        }
        int min = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
            }
        }
        return min;
    }

    /**
     * 将数字转换为中文数字表示
     *
     * @param num 数字
     * @return 中文数字字符串
     */
    public static String toChineseNumber(long num) {
        if (num == 0) {
            return "零";
        }
        String[] digits = {"零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"};
        String[] units = {"", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿"};
        StringBuilder sb = new StringBuilder();
        boolean needZero = false;
        int unitIndex = 0;
        while (num > 0) {
            long digit = num % 10;
            if (digit == 0) {
                needZero = true;
            } else {
                if (needZero) {
                    sb.append(digits[0]);
                    needZero = false;
                }
                sb.append(digits[(int) digit]).append(units[unitIndex]);
            }
            num = num / 10;
            unitIndex++;
        }
        return sb.reverse().toString();
    }
}