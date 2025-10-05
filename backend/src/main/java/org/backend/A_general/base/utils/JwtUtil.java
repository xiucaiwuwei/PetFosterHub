package org.backend.A_general.base.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.backend.A_general.base.config.JwtProperties;
import org.backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * JWT工具类
 * 提供JWT令牌的生成、验证、刷新等功能
 */
@Component
public class JwtUtil {

    // 创建日志记录器
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    // 刷新令牌在Redis中的前缀
    private static final String REFRESH_TOKEN_PREFIX = "refresh_token:";

    // 黑名单令牌在Redis中的前缀
    private static final String BLACKLIST_TOKEN_PREFIX = "blacklist_token:";

    // JWT属性配置类实例
    private final JwtProperties jwtProperties;

    // Redis模板，用于存储刷新令牌和黑名单令牌
    private final RedisTemplate<String, String> redisTemplate;

    // 缓存签名密钥，避免重复生成
    private Key cachedSigningKey;

    /**
     * 构造函数
     *
     * @param jwtProperties JWT属性配置类实例
     */
    public JwtUtil(JwtProperties jwtProperties, RedisTemplate<String, String> redisTemplate) {
        this.jwtProperties = jwtProperties;
        this.redisTemplate = redisTemplate;
    }

    /**
     * 获取签名密钥
     *
     * @return 签名密钥
     */
    private Key getSigningKey() {
        // 使用缓存的签名密钥，避免重复生成
        if (cachedSigningKey == null) {
            cachedSigningKey = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes());
        }
        return cachedSigningKey;
    }

    /**
     * 为用户生成访问令牌
     *
     * @param user 用户实体
     * @return 生成的JWT令牌
     */
    public String generateToken(User user) {
        // 检查用户参数是否为空，防止空指针异常
        if (user == null) {
            // 当用户信息为空时抛出非法参数异常
            throw new IllegalArgumentException("用户信息不能为空");
        }

        // 创建JWT声明映射表
        Map<String, Object> claims = new HashMap<>();
        // 将用户ID添加到声明中，以便在验证时识别用户
        claims.put("id", user.getId());
        // 添加用户角色信息到声明中，支持手机号加角色的认证机制
        claims.put("role", user.getRole().name());
        claims.put("phone", user.getPhone());
        // 调用createToken方法生成JWT令牌，使用用户ID作为主题，设置过期时间
        return createToken(claims, String.valueOf(user.getId()), jwtProperties.getExpiration());
    }

    /**
     * 为用户生成刷新令牌
     *
     * @param user 用户实体
     * @return 生成的刷新令牌
     */
    public String generateRefreshToken(User user) {
        // 检查用户参数是否为空，防止空指针异常
        if (user == null) {
            // 当用户信息为空时抛出非法参数异常
            throw new IllegalArgumentException("用户信息不能为空");
        }

        // 创建JWT声明映射表
        Map<String, Object> claims = new HashMap<>();
        // 将用户ID添加到声明中
        claims.put("id", user.getId());
        // 添加用户角色信息到声明中，支持手机号加角色的认证机制
        claims.put("role", user.getRole().name());
        claims.put("phone", user.getPhone());
        // 调用createToken方法生成刷新令牌，使用用户ID作为主题，设置较长的过期时间
        return createToken(claims, String.valueOf(user.getId()), jwtProperties.getRefreshExpiration());
    }

    /**
     * 从JWT令牌中提取用户角色
     *
     * @param token JWT令牌
     * @return 用户角色
     */
    public String getRoleFromToken(String token) {
        try {
            // 解析JWT令牌并获取声明部分
            Claims claims = Jwts.parser().verifyWith((SecretKey) getSigningKey())  // 设置签名密钥用于验证
                    .build().parseSignedClaims(token)           // 解析JWT令牌
                    .getPayload();                      // 获取声明部分

            // 从声明中获取角色信息
            return claims.get("role", String.class);
        } catch (Exception e) {
            // 记录从令牌获取角色失败的日志
            logger.debug("从令牌获取角色失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从JWT令牌中提取用户手机号
     *
     * @param token JWT令牌
     * @return 用户手机号
     */
    public String getPhoneFromToken(String token) {
        try {
            // 解析JWT令牌并获取声明部分
            Claims claims = Jwts.parser().verifyWith((SecretKey) getSigningKey())  // 设置签名密钥用于验证
                    .build().parseSignedClaims(token)           // 解析JWT令牌
                    .getPayload();                      // 获取声明部分

            // 从声明中获取手机号信息
            return claims.get("phone", String.class);
        } catch (Exception e) {
            // 记录从令牌获取手机号失败的日志
            logger.debug("从令牌获取手机号失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 从JWT令牌中提取用户ID
     *
     * @param token JWT令牌
     * @return 用户ID
     */
    public Long getUserIdFromToken(String token) {
        try {
            // 解析JWT令牌并获取声明部分
            Claims claims = Jwts.parser().verifyWith((SecretKey) getSigningKey())  // 设置签名密钥用于验证
                    .build().parseSignedClaims(token)           // 解析JWT令牌
                    .getPayload();                      // 获取声明部分

            // 从声明中获取用户ID
            Object idClaim = claims.get("id");
            if (idClaim instanceof Number) {
                return ((Number) idClaim).longValue();
            }
            return null;
        } catch (Exception e) {
            // 记录从令牌获取用户ID失败的日志
            logger.debug("从令牌获取用户ID失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 创建JWT令牌的私有方法
     *
     * @param claims         JWT声明映射表
     * @param subject        JWT主题（通常是用户名）
     * @param expirationTime 过期时间（毫秒）
     * @return 生成的JWT令牌字符串
     */
    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        // 使用JJWT库的构建器模式创建JWT令牌
        return Jwts.builder()
                // 设置声明信息（如用户ID等自定义数据）
                .claims(claims)
                // 设置JWT主题（通常是用户名）
                .subject(subject)
                // 设置JWT签发时间（当前时间）
                .issuedAt(new Date(System.currentTimeMillis()))
                // 设置JWT过期时间（当前时间加上过期时长）
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                // 使用指定的签名密钥和HS256算法进行签名
                .signWith((SecretKey) getSigningKey(), io.jsonwebtoken.Jwts.SIG.HS256)
                // 生成紧凑的JWT字符串格式
                .compact();
    }

    /**
     * 保存刷新令牌到Redis中
     *
     * @param userId       用户ID
     * @param refreshToken 刷新令牌
     */
    public void saveRefreshToken(String userId, String refreshToken) {
        try {
            // 将刷新令牌存储到Redis中，设置过期时间
            redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + userId, // Redis键名
                    refreshToken, // Redis值
                    jwtProperties.getRefreshExpiration(), // 过期时间
                    TimeUnit.MILLISECONDS // 时间单位
            );

            // 同时存储刷新令牌到用户ID的反向映射，用于快速查找
            redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + "reverse:" + refreshToken, // 反向映射键名
                    userId, // 用户ID作为值
                    jwtProperties.getRefreshExpiration(), // 相同的过期时间
                    TimeUnit.MILLISECONDS // 时间单位
            );
        } catch (Exception e) {
            // 记录保存刷新令牌失败的日志
            logger.error("保存刷新令牌失败: {}", e.getMessage());
            // 不应该让Redis错误影响主要流程
        }
    }

    /**
     * 验证刷新令牌的有效性
     *
     * @param refreshToken 刷新令牌
     * @param userId       用户ID
     * @return 刷新令牌是否有效
     */
    public boolean validateRefreshToken(String refreshToken, String userId) {
        try {
            // 检查令牌是否在黑名单中
            if (redisTemplate.hasKey(BLACKLIST_TOKEN_PREFIX + refreshToken)) {
                logger.debug("刷新令牌在黑名单中: {}", refreshToken);
                return false;
            }

            // 直接比较Redis中存储的刷新令牌与提供的令牌是否一致
            String storedToken = redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + userId);
            if (storedToken != null) {
                return refreshToken.equals(storedToken);
            }
            return false;
        } catch (Exception e) {
            // 记录验证刷新令牌失败的日志
            logger.debug("验证刷新令牌失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 通过刷新令牌获取对应的用户ID
     *
     * @param refreshToken 刷新令牌
     * @return 用户ID，如果令牌不存在或已过期则返回null
     */
    public String getUserIdFromRefreshToken(String refreshToken) {
        try {
            // 直接通过反向映射获取用户ID
            return redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + "reverse:" + refreshToken);
        } catch (Exception e) {
            logger.debug("从刷新令牌获取用户ID失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 将令牌添加到黑名单中（存储在Redis中）
     *
     * @param token JWT令牌
     */
    public void addToBlacklist(String token) {
        try {
            // 计算令牌剩余有效时间
            Date expiration = Jwts.parser().verifyWith((SecretKey) getSigningKey()).build().parseSignedClaims(token).getPayload().getExpiration();

            long expirationTime = expiration.getTime() - System.currentTimeMillis();

            // 将令牌添加到Redis黑名单中，设置与令牌相同的过期时间
            if (expirationTime > 0) {
                redisTemplate.opsForValue().set(BLACKLIST_TOKEN_PREFIX + token, // Redis键名
                        "blacklisted", // Redis值
                        expirationTime, // 过期时间
                        TimeUnit.MILLISECONDS // 时间单位
                );
            }
        } catch (Exception e) {
            // 记录添加令牌到黑名单失败的日志
            logger.error("添加令牌到黑名单失败: {}", e.getMessage());
        }
    }

    /**
     * 验证JWT令牌的有效性
     *
     * @param token JWT令牌
     * @return 令牌是否有效
     */
    public Boolean validateToken(String token) {
        try {
            // 检查令牌是否在黑名单中
            if (redisTemplate.hasKey(BLACKLIST_TOKEN_PREFIX + token)) {
                // 记录令牌在黑名单中的警告日志
                logger.debug("令牌在黑名单中: {}", token);
                return false;
            }

            // 验证令牌签名和过期时间
            Jwts.parser().verifyWith((SecretKey) getSigningKey()).build().parseSignedClaims(token);

            return true;
        } catch (Exception e) {
            // 记录验证令牌失败的日志
            logger.debug("验证令牌失败: {}", e.getMessage());
            return false;
        }
    }
}
