package org.backend.A_general.base.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis配置类
 * 配置RedisTemplate以用于Redis数据操作
 * 该配置类主要配置RedisTemplate，设置合适的序列化器以确保数据能正确地存储和读取。
 */
@Configuration
@EnableRedisRepositories
public class RedisConfig {

    private static final Logger logger = LoggerFactory.getLogger(RedisConfig.class);

    /**
     * 配置RedisTemplate实例
     *
     * @param factory Redis连接工厂，用于创建Redis连接
     * @return 配置完成的RedisTemplate实例
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // 使用StringRedisSerializer来序列化和反序列化redis的key值
        configureSerializers(template);

        template.afterPropertiesSet();
        logger.debug("RedisTemplate配置完成");
        return template;
    }

    /**
     * 配置RedisTemplate的序列化器
     *
     * @param template RedisTemplate实例
     */
    private void configureSerializers(RedisTemplate<String, String> template) {
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringRedisSerializer);
        template.setValueSerializer(stringRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);
        template.setHashValueSerializer(stringRedisSerializer);
    }
}