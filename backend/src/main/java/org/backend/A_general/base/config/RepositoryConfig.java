package org.backend.A_general.base.config;

import org.backend.A_general.base.repository.BaseRepositoryImpl;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Repository配置类
 * 配置Spring Data JPA使用自定义的BaseRepository实现
 */
@Configuration
@EnableJpaRepositories(
        basePackages = {"org.backend.repository", "org.backend.A_general.base.repository", "org.backend.A_general.file.repository"},
        repositoryBaseClass = BaseRepositoryImpl.class
)
public class RepositoryConfig {
    
    // 这里可以添加其他Repository相关的配置
    
}