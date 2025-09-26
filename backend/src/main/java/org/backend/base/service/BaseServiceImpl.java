package org.backend.base.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 基础服务实现类
 * 所有Service实现类都应该继承此类，提供统一的CRUD操作实现
 *
 * @param <T>  实体类型
 * @param <ID> 主键类型
 * @param <R>  Repository类型
 */
@Transactional
public abstract class BaseServiceImpl<T, ID, R extends JpaRepository<T, ID>> implements BaseService<T, ID> {

    private static final Logger logger = LoggerFactory.getLogger(BaseServiceImpl.class);

    protected final R repository;

    public BaseServiceImpl(R repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public T save(T entity) {
        logger.debug("保存实体: {}", entity);
        return repository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<T> findById(ID id) {
        logger.debug("根据ID查找实体: {}", id);
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<T> findAll() {
        logger.debug("查找所有实体");
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<T> findAll(Pageable pageable) {
        logger.debug("分页查找实体，页码: {}, 页面大小: {}", pageable.getPageNumber(), pageable.getPageSize());
        return repository.findAll(pageable);
    }

    @Override
    @Transactional
    public void deleteById(ID id) {
        logger.debug("根据ID删除实体: {}", id);
        repository.deleteById(id);
    }

    @Override
    @Transactional
    public void delete(T entity) {
        logger.debug("删除实体: {}", entity);
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void deleteAll(Iterable<? extends T> entities) {
        logger.debug("批量删除实体，数量: {}", ((List<?>) entities).size());
        repository.deleteAll(entities);
    }

    @Override
    @Transactional
    public void deleteAll() {
        logger.debug("删除所有实体");
        repository.deleteAll();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(ID id) {
        logger.debug("检查实体是否存在，ID: {}", id);
        return repository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        logger.debug("统计实体数量");
        return repository.count();
    }
}