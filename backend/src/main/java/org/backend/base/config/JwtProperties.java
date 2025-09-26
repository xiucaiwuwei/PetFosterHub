package org.backend.base.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;

import javax.crypto.SecretKey;
import java.util.Base64;

import static io.jsonwebtoken.Jwts.SIG;

@Data
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private static final Logger logger = LoggerFactory.getLogger(JwtProperties.class);

    private String secretKey;
    private long expiration;
    private long refreshExpiration;

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