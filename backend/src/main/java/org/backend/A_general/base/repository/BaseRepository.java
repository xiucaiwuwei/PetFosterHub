package org.backend.A_general.base.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * 基础Repository接口
 * 所有Repository接口都应该继承此接口，提供统一的查询和持久化操作规范
 *
 * @param <T>  实体类型
 * @param <ID> 主键类型，必须实现Serializable接口
 */
@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {
    
    /**
     * 批量保存实体
     * @param entities 实体集合
     * @param <S> 实体类型
     * @return 保存后的实体列表
     */
    @Override
    <S extends T> List<S> saveAll(Iterable<S> entities);
    
    /**
     * 根据ID查找实体
     * @param id 实体ID
     * @return 实体Optional
     */
    Optional<T> findById(ID id);
    
    /**
     * 检查ID是否存在
     * @param id 实体ID
     * @return 是否存在
     */
    boolean existsById(ID id);
    
    /**
     * 查找所有实体
     * @return 实体列表
     */
    List<T> findAll();
    
    /**
     * 根据ID列表查找实体
     * @param ids ID列表
     * @return 实体列表
     */
    List<T> findAllById(Iterable<ID> ids);
    
    /**
     * 计算实体总数
     * @return 实体总数
     */
    long count();
    
    /**
     * 根据ID删除实体
     * @param id 实体ID
     */
    void deleteById(ID id);
    
    /**
     * 删除实体
     * @param entity 实体
     */
    void delete(T entity);
    
    /**
     * 批量删除实体
     * @param entities 实体集合
     */
    void deleteAll(Iterable<? extends T> entities);
    
    /**
     * 删除所有实体
     */
    void deleteAll();
    
    /**
     * 根据ID列表逻辑删除实体（将deleted字段设为true）
     * @param ids ID列表
     */
    void logicallyDeleteByIds(Iterable<ID> ids);
    
    /**
     * 获取所有未删除的实体
     * @return 未删除的实体列表
     */
    List<T> findAllNotDeleted();
    
    /**
     * 根据ID获取未删除的实体
     * @param id 实体ID
     * @return 未删除的实体Optional
     */
    Optional<T> findByIdAndNotDeleted(ID id);
}