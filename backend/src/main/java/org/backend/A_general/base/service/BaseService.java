package org.backend.A_general.base.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * 基础服务接口
 * 所有Service接口都应该继承此接口，提供统一的CRUD操作规范
 *
 * @param <T>  实体类型
 * @param <ID> 主键类型，必须实现Serializable接口
 */
public interface BaseService<T, ID extends Serializable> {

    /**
     * 保存实体
     *
     * @param entity 要保存的实体
     * @return 保存后的实体
     */
    T save(T entity);

    /**
     * 批量保存实体
     *
     * @param entities 要保存的实体列表
     * @return 保存后的实体列表
     */
    List<T> saveAll(Iterable<T> entities);

    /**
     * 根据ID查找实体
     *
     * @param id 实体ID
     * @return 包含实体的Optional对象
     */
    Optional<T> findById(ID id);

    /**
     * 根据ID查找未删除的实体
     *
     * @param id 实体ID
     * @return 包含未删除实体的Optional对象
     */
    Optional<T> findByIdAndNotDeleted(ID id);

    /**
     * 查找所有实体
     *
     * @return 实体列表
     */
    List<T> findAll();

    /**
     * 查找所有未删除的实体
     *
     * @return 未删除的实体列表
     */
    List<T> findAllNotDeleted();

    /**
     * 根据ID列表查找实体
     *
     * @param ids 实体ID列表
     * @return 实体列表
     */
    List<T> findAllById(Iterable<ID> ids);

    /**
     * 分页查找所有实体
     *
     * @param pageable 分页参数
     * @return 分页结果
     */
    Page<T> findAll(Pageable pageable);

    /**
     * 根据ID删除实体
     *
     * @param id 实体ID
     */
    void deleteById(ID id);

    /**
     * 根据ID列表逻辑删除实体（将deleted字段设为true）
     *
     * @param ids 实体ID列表
     */
    void logicallyDeleteByIds(Iterable<ID> ids);

    /**
     * 删除实体
     *
     * @param entity 要删除的实体
     */
    void delete(T entity);

    /**
     * 批量删除实体
     *
     * @param entities 要删除的实体列表
     */
    void deleteAll(Iterable<? extends T> entities);

    /**
     * 删除所有实体
     */
    void deleteAll();

    /**
     * 检查实体是否存在
     *
     * @param id 实体ID
     * @return 是否存在
     */
    boolean existsById(ID id);

    /**
     * 统计实体数量
     *
     * @return 实体数量
     */
    long count();
}