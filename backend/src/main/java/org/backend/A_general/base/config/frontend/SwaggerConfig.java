package org.backend.A_general.base.config.frontend;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.backend.A_general.base.config.backend.SystemProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Swagger/OpenAPI配置类
 * 用于配置API文档生成
 */
@Configuration
public class SwaggerConfig {

    private final SystemProperties systemProperties;

    public SwaggerConfig(SystemProperties systemProperties) {
        this.systemProperties = systemProperties;
    }

    /**
     * 配置OpenAPI实例
     *
     * @return OpenAPI实例
     */
    @Bean
    public OpenAPI customOpenAPI() {
        // 创建安全方案（JWT认证）
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .name("Authorization")
                .in(SecurityScheme.In.HEADER);

        // 创建安全要求
        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        // 创建OpenAPI实例
        return new OpenAPI()
                .info(getApiInfo())
                .servers(getServers())
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth", securityScheme))
                .security(Collections.singletonList(securityRequirement));
    }

    /**
     * 配置API信息
     *
     * @return API信息
     */
    private Info getApiInfo() {
        return new Info()
                .title(systemProperties.getAppName() + " API文档")
                .description("宠物寄养平台API接口文档，提供宠物寄养相关的所有API接口说明")
                .version(systemProperties.getAppVersion())
                .contact(getContact())
                .license(getLicense())
                .termsOfService("https://example.com/terms");
    }

    /**
     * 配置联系人信息
     *
     * @return 联系人信息
     */
    private Contact getContact() {
        return new Contact()
                .name("PetFosterHub Team")
                .email("support@petfosterhub.com")
                .url("https://www.petfosterhub.com");
    }

    /**
     * 配置许可证信息
     *
     * @return 许可证信息
     */
    private License getLicense() {
        return new License()
                .name("Apache 2.0")
                .url("https://www.apache.org/licenses/LICENSE-2.0");
    }

    /**
     * 配置服务器信息
     * 根据当前环境配置不同的服务器URL
     *
     * @return 服务器列表
     */
    private List<Server> getServers() {
        List<Server> servers = new ArrayList<>();

        // 根据环境添加不同的服务器URL
        if (systemProperties.isDevEnvironment()) {
            servers.add(new Server()
                    .url("http://localhost:8080")
                    .description("开发环境"));
        } else if (systemProperties.isTestEnvironment()) {
            servers.add(new Server()
                    .url("https://test.petfosterhub.com")
                    .description("测试环境"));
        } else if (systemProperties.isProdEnvironment()) {
            servers.add(new Server()
                    .url("https://api.petfosterhub.com")
                    .description("生产环境"));
        } else {
            // 默认服务器配置
            servers.add(new Server()
                    .url("http://localhost:8080")
                    .description("默认服务器"));
        }

        return servers;
    }
}