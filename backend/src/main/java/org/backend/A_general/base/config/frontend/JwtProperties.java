package org.backend.A_general.base.config.frontend;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;

import static io.jsonwebtoken.Jwts.SIG;

/**
 * JWT配置属性类
 * 用于加载和管理JWT相关的配置属性，包括密钥、访问令牌过期时间和刷新令牌过期时间
 * <p>
 * 该类从配置文件中读取以"jwt"为前缀的属性，并提供密钥的自动生成机制，
 * 以确保在未配置密钥时也能正常工作。
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private static final Logger logger = LoggerFactory.getLogger(JwtProperties.class);

    /**
     * JWT密钥，用于签名和验证JWT令牌
     */
    private String secretKey;
    
    /**
     * JWT访问令牌过期时间（毫秒）
     */
    private long expiration;
    
    /**
     * JWT刷新令牌过期时间（毫秒）
     */
    private long refreshExpiration;

    /**
     * 初始化方法，在对象创建后自动调用
     * 用于检查并生成安全的JWT密钥
     */
    @PostConstruct
    public void generateSecureSecretKey() {
        // 如果未配置密钥，则自动生成一个安全的256位密钥
        if (secretKey == null || secretKey.trim().isEmpty()) {
            SecretKey key = SIG.HS256.key().build();
            this.secretKey = Base64.getEncoder().encodeToString(key.getEncoded());
            logger.warn("自动生成JWT密钥用于开发环境");
            logger.warn("生产环境请使用环境变量配置固定密钥，此自动生成密钥仅用于开发环境");
        }
    }
}