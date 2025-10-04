package org.backend.config;

import lombok.RequiredArgsConstructor;
import org.backend.base.config.JwtProperties;
import org.backend.base.utils.JwtUtil;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


/**
 * Spring Security配置类
 * 配置应用程序的安全策略，包括认证、授权、密码加密等
 * <p>
 * 该配置类负责：
 * 1. 配置密码加密器
 * 2. 配置认证提供者
 * 3. 配置认证管理器
 * 4. 配置JWT认证过滤器
 * 5. 配置HTTP安全策略和访问控制规则
 */
@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(JwtProperties.class)
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String AUTH_API_PATH = "/api/auth/**";

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    /**
     * 配置密码编码器
     * 
     * @return BCryptPasswordEncoder实例
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 配置认证提供者
     * 
     * @return DaoAuthenticationProvider实例
     */
    @SuppressWarnings("deprecation")
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * 配置认证管理器
     * 
     * @param authConfig 认证配置
     * @return AuthenticationManager实例
     * @throws Exception 配置异常
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * 配置JWT认证过滤器
     * 
     * @return JwtAuthenticationFilter实例
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userDetailsService);
    }

    /**
     * 配置安全过滤器链
     * 
     * @param http HttpSecurity对象，用于配置HTTP安全策略
     * @return SecurityFilterChain实例
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {
                }) // CORS配置由CorsConfig类提供
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(AUTH_API_PATH).permitAll()
                        .requestMatchers("/api/verification-code/**").permitAll() // 允许验证码接口无需认证
                        .requestMatchers("/api/home/**").permitAll() // 允许首页接口无需认证
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // 允许所有OPTIONS预检请求
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}