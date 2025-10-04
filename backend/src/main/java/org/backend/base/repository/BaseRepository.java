package org.backend.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

/**
 * 基础Repository接口
 * 所有Repository接口都应该继承此接口，提供统一的查询和持久化操作规范
 *
 * @param <T>  实体类型
 * @param <ID> 主键类型，必须实现Serializable接口
 */
@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

    // 可以在这里添加通用的自定义查询方法
    
}