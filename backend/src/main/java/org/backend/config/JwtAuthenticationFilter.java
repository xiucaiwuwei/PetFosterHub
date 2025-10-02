package org.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.backend.base.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    // 定义公开接口的路径列表（这些接口不需要认证）
    private static final List<String> PUBLIC_ENDPOINTS = Arrays.asList(
            "/api/auth/login",
            "/api/auth/register",
            "/api/verification-code/send",
            "/api/auth/forgot-password",
            "/api/auth/reset-password",
            "/api/auth/verify-email",
            "/api/banners/active",
            "/api/home/" // 首页接口无需认证
    );

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@Nullable HttpServletRequest request,
                                    @Nullable HttpServletResponse response,
                                    @Nullable FilterChain filterChain)
            throws ServletException, IOException {
        // 检查必要参数是否为空
        if (request == null || filterChain == null) {
            logger.debug("请求或过滤器链为空");
            return;
        }

        try {
            // 检查是否是公开接口，如果是则跳过JWT验证
            String requestUri = request.getRequestURI();
            if (isPublicEndpoint(requestUri)) {
                logger.debug("跳过公开接口的JWT验证: {}", requestUri);
                filterChain.doFilter(request, response);
                return;
            }

            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                logger.debug("检测到JWT令牌，开始验证");

                try {
                    // 从令牌获取用户ID
                    Long userId = jwtUtil.getUserIdFromToken(token);

                    if (jwtUtil.validateToken(token) && userId != null) {
                        // 使用UserDetailsService加载用户详细信息，传入用户ID的字符串形式
                        UserDetails userDetails = userDetailsService.loadUserByUsername(String.valueOf(userId));

                        // 创建认证令牌并设置到安全上下文中
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities());

                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        logger.debug("JWT令牌验证成功，用户ID: {}", userId);
                    } else {
                        logger.warn("用户令牌验证失败，用户ID: {}", userId);
                    }
                } catch (Exception e) {
                    logger.warn("JWT令牌验证错误: {}", e.getMessage());
                }
            } else {
                logger.debug("请求未包含有效的Authorization头");
            }
        } catch (Exception e) {
            logger.error("身份验证过滤器错误: {}", e.getMessage(), e);
        }

        // 继续执行过滤器链
        filterChain.doFilter(request, response);
    }

    /**
     * 检查请求是否是公开接口
     * @param requestUri 请求的URI路径
     * @return 是否是公开接口
     */
    private boolean isPublicEndpoint(String requestUri) {
        // 记录请求URI以便调试
        logger.debug("检查请求是否为公开接口: {}", requestUri);
        
        // 优先检查精确匹配或前缀匹配
        boolean isPublic = PUBLIC_ENDPOINTS.stream().anyMatch(endpoint -> 
                requestUri.equals(endpoint) || requestUri.startsWith(endpoint + "/")
        );
        
        // 特别针对首页接口做额外检查，确保所有/api/home/开头的路径都被正确识别
        if (!isPublic && requestUri.startsWith("/api/home/")) {
            logger.debug("额外匹配首页接口: {}", requestUri);
            isPublic = true;
        }
        
        logger.debug("请求[{}]是否为公开接口: {}", requestUri, isPublic);
        return isPublic;
    }
}
