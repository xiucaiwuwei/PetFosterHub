package org.backend.A_general.base.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * 系统配置属性类
 * 用于封装从application.properties或application.yml中读取的系统配置
 */
@Data
@Component
@ConfigurationProperties(prefix = "system")
public class SystemProperties {

    /**
     * 应用名称
     */
    private String appName = "PetFosterHub";

    /**
     * 应用版本
     */
    private String appVersion = "1.0.0";

    /**
     * 环境标识：dev、test、prod等
     */
    private String environment = "dev";

    /**
     * 是否开启调试模式
     */
    private boolean debug = true;

    /**
     * API前缀
     */
    private String apiPrefix = "/api";

    /**
     * 分页配置
     */
    private final Page page = new Page();

    /**
     * 上传配置
     */
    private final Upload upload = new Upload();

    /**
     * 缓存配置
     */
    private final Cache cache = new Cache();

    /**
     * JWT配置
     */
    private final Jwt jwt = new Jwt();

    /**
     * 分页配置内部类
     */
    @Data
    public static class Page {
        /**
         * 默认页码
         */
        private int defaultPageNum = 1;

        /**
         * 默认每页记录数
         */
        private int defaultPageSize = 10;

        /**
         * 最大每页记录数
         */
        private int maxPageSize = 100;
    }

    /**
     * 上传配置内部类
     */
    @Data
    public static class Upload {
        /**
         * 上传文件保存路径
         */
        private String basePath = "/uploads";

        /**
         * 最大文件大小（MB）
         */
        private long maxFileSize = 10;

        /**
         * 支持的文件类型
         */
        private String[] allowedTypes = {".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"};

        /**
         * 是否启用临时文件存储
         */
        private boolean useTempStorage = true;

        /**
         * 临时文件过期时间（分钟）
         */
        private long tempFileExpiryMinutes = 30;
    }

    /**
     * 缓存配置内部类
     */
    @Data
    public static class Cache {
        /**
         * 是否启用缓存
         */
        private boolean enabled = true;

        /**
         * 缓存过期时间
         */
        private Duration expiry = Duration.ofHours(1);

        /**
         * 缓存最大条目数
         */
        private int maxEntries = 1000;
    }

    /**
     * JWT配置内部类
     */
    @Data
    public static class Jwt {
        /**
         * JWT密钥
         */
        private String secret = "default-secret-key-change-it-in-production";

        /**
         * 令牌有效期
         */
        private Duration expiry = Duration.ofHours(24);

        /**
         * 刷新令牌有效期
         */
        private Duration refreshExpiry = Duration.ofDays(7);

        /**
         * 令牌前缀
         */
        private String tokenPrefix = "Bearer ";

        /**
         * 令牌头名称
         */
        private String header = "Authorization";
    }

    /**
     * 获取完整的API路径
     *
     * @param path API路径
     * @return 完整的API路径
     */
    public String getFullApiPath(String path) {
        if (path == null) {
            return apiPrefix;
        }
        if (path.startsWith("/")) {
            return apiPrefix + path;
        }
        return apiPrefix + "/" + path;
    }

    /**
     * 检查当前环境是否为开发环境
     *
     * @return 是否为开发环境
     */
    public boolean isDevEnvironment() {
        return "dev".equalsIgnoreCase(environment);
    }

    /**
     * 检查当前环境是否为生产环境
     *
     * @return 是否为生产环境
     */
    public boolean isProdEnvironment() {
        return "prod".equalsIgnoreCase(environment);
    }

    /**
     * 检查当前环境是否为测试环境
     *
     * @return 是否为测试环境
     */
    public boolean isTestEnvironment() {
        return "test".equalsIgnoreCase(environment);
    }
}