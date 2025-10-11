package org.backend.A_general.base.config.frontend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS 跨域配置类
 * 解决前端开发环境的跨域请求问题
 * <p>
 * 该配置类用于配置跨域资源共享（CORS）策略，允许前端应用在不同域下访问后端API。
 * 主要配置了允许的源地址、请求方法、请求头等信息。
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origin-patterns:http://localhost:*,http://127.0.0.1:*,https://192.168.0.107:*}")
    private List<String> allowedOriginPatterns;
    
    @Value("${cors.allowed-headers:Authorization,Content-Type,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers}")
    private List<String> allowedHeaders;
    
    @Value("${cors.max-age:3600}")
    private Long maxAge;

    /**
     * 创建并配置CorsConfigurationSource实例
     * 
     * @return 配置完成的CorsConfigurationSource实例
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 允许的源地址 - 开发环境
        configuration.setAllowedOriginPatterns(allowedOriginPatterns);

        // 允许的请求方法
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // 允许的请求头
        configuration.setAllowedHeaders(allowedHeaders);

        // 允许暴露的响应头
        configuration.setExposedHeaders(allowedHeaders);

        // 允许携带认证信息（如cookies）
        configuration.setAllowCredentials(true);

        // 预检请求缓存时间（秒）
        configuration.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}