package org.backend.A_general.base.config;

import org.backend.A_general.base.interceptor.RequestInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * Web MVC配置类
 * 用于配置静态资源映射和拦截器
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebMvcConfig.class);

    private static final String UPLOADS_PATH_PATTERN = "/uploads/**";
    private static final String API_PATH_PATTERN = "/api/**";
    /**
     * 请求拦截器实例
     * 用于拦截和处理请求
     */
    private final RequestInterceptor requestInterceptor;
    /**
     * 上传文件存储路径
     * 从application.yml配置文件中读取file.upload.path属性值
     */
    @Value("${file.upload.path}")
    private String uploadPath;

    /**
     * 构造函数注入RequestInterceptor实例
     *
     * @param requestInterceptor 请求拦截器
     */
    public WebMvcConfig(RequestInterceptor requestInterceptor) {
        this.requestInterceptor = requestInterceptor;
    }

    /**
     * 添加静态资源处理器
     * 将本地文件系统中的上传目录映射为Web可访问的静态资源
     *
     * @param registry 资源处理器注册器
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        try {
            // 验证上传路径的安全性
            validateUploadPath(uploadPath);

            // 确保路径以file:开头并以/结尾，构建文件系统绝对路径
            String location = "file:" + new File(uploadPath).getAbsolutePath() + "/";
            logger.debug("静态资源位置: {}", location);
            // 将/uploads/**路径映射到配置的上传目录
            registry.addResourceHandler(UPLOADS_PATH_PATTERN)
                    .addResourceLocations(location);
        } catch (Exception e) {
            logger.error("配置静态资源处理器失败: {}", e.getMessage(), e);
        }
    }

    /**
     * 添加拦截器
     * 配置需要被拦截的请求路径
     *
     * @param registry 拦截器注册器
     */
    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        // 添加请求拦截器，拦截所有/api/**路径的请求
        registry.addInterceptor(requestInterceptor).addPathPatterns(API_PATH_PATTERN);
        logger.debug("已添加请求拦截器，拦截路径: {}", API_PATH_PATTERN);
    }

    /**
     * 验证上传路径的安全性
     *
     * @param path 上传路径
     * @throws IllegalArgumentException 当路径不合法时抛出异常
     */
    private void validateUploadPath(String path) throws IllegalArgumentException {
        if (path == null || path.trim().isEmpty()) {
            throw new IllegalArgumentException("上传路径不能为空");
        }
    }
}