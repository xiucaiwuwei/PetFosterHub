package org.backend.A_general.base.security;

import org.backend.A_general.base.utils.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

/**
 * JWT令牌提供者
 * 提供JWT令牌验证和用户认证功能
 */
@Component
public class JwtTokenProvider {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * 验证JWT令牌的有效性
     *
     * @param token JWT令牌
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    /**
     * 从JWT令牌中提取用户ID
     *
     * @param token JWT令牌
     * @return 用户ID
     */
    public String getUserIdFromToken(String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        return userId != null ? userId.toString() : null;
    }

    /**
     * 获取用户认证信息
     *
     * @param token JWT令牌
     * @return 认证信息
     */
    public Authentication getAuthentication(String token) {
        String userId = getUserIdFromToken(token);
        if (userId != null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
            if (userDetails != null) {
                return new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
            }
        }
        return null;
    }
}