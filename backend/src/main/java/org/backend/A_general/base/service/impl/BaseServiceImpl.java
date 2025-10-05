package org.backend.A_general.base.service.impl;

import org.backend.A_general.base.repository.BaseRepository;
import org.backend.A_general.base.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

/**
 * 基础服务实现类
 * 所有Service实现类都应该继承此类，提供统一的CRUD操作实现
 *
 * @param <T>  实体类型
 * @param <ID> 主键类型，必须实现Serializable接口
 * @param <R>  Repository类型
 */
@Transactional
public abstract class BaseServiceImpl<T, ID extends Serializable, R extends JpaRepository<T, ID>> implements BaseService<T, ID> {

    private static final Logger logger = LoggerFactory.getLogger(BaseServiceImpl.class);

    protected final R repository;

    /**
     * 构造函数
     *
     * @param repository 数据访问层对象
     */
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
    @Transactional
    public List<T> saveAll(Iterable<T> entities) {
        logger.debug("批量保存实体");
        return repository.saveAll(entities);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<T> findById(ID id) {
        logger.debug("根据ID查找实体: {}", id);
        return repository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<T> findByIdAndNotDeleted(ID id) {
        logger.debug("根据ID查找未删除的实体: {}", id);
        if (repository instanceof BaseRepository) {
            @SuppressWarnings("unchecked")
            BaseRepository<T, ID> baseRepository =
                    (BaseRepository<T, ID>) repository;
            return baseRepository.findByIdAndNotDeleted(id);
        }
        // 如果Repository不是BaseRepository类型，则先查找，然后检查deleted字段
        Optional<T> entityOptional = repository.findById(id);
        if (entityOptional.isPresent()) {
            T entity = entityOptional.get();
            try {
                // 检查实体是否有deleted字段且值为false
                java.lang.reflect.Field deletedField = entity.getClass().getDeclaredField("deleted");
                deletedField.setAccessible(true);
                Object deletedValue = deletedField.get(entity);
                if (deletedValue instanceof Boolean && !(Boolean) deletedValue ||
                        deletedValue instanceof Integer && (Integer) deletedValue == 0) {
                    return Optional.of(entity);
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                logger.warn("无法检查实体的deleted字段: {}", e.getMessage());
                // 如果没有deleted字段或访问失败，则默认返回实体
                return entityOptional;
            }
        }
        return Optional.empty();
    }

    @Override
    @Transactional(readOnly = true)
    public List<T> findAll() {
        logger.debug("查找所有实体");
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<T> findAllNotDeleted() {
        logger.debug("查找所有未删除的实体");
        if (repository instanceof BaseRepository) {
            @SuppressWarnings("unchecked")
            BaseRepository<T, ID> baseRepository =
                    (BaseRepository<T, ID>) repository;
            return baseRepository.findAllNotDeleted();
        }
        // 如果Repository不是BaseRepository类型，则手动过滤
        return repository.findAll().stream()
                .filter(entity -> {
                    try {
                        // 检查实体是否有deleted字段且值为false
                        Field deletedField = entity.getClass().getDeclaredField("deleted");
                        deletedField.setAccessible(true);
                        Object deletedValue = deletedField.get(entity);
                        return deletedValue instanceof Boolean && !(Boolean) deletedValue ||
                                deletedValue instanceof Integer && (Integer) deletedValue == 0;
                    } catch (NoSuchFieldException | IllegalAccessException e) {
                        //noinspection LoggingSimilarMessage
                        logger.warn("无法检查实体的deleted字段: {}", e.getMessage());
                        // 如果没有deleted字段或访问失败，则默认认为未删除
                        return true;
                    }
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<T> findAllById(Iterable<ID> ids) {
        logger.debug("根据ID列表查找实体");
        return repository.findAllById(ids);
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
    public void logicallyDeleteByIds(Iterable<ID> ids) {
        logger.debug("根据ID列表逻辑删除实体");
        if (repository instanceof BaseRepository) {
            @SuppressWarnings("unchecked")
            BaseRepository<T, ID> baseRepository =
                    (BaseRepository<T, ID>) repository;
            baseRepository.logicallyDeleteByIds(ids);
        } else {
            // 如果Repository不是BaseRepository类型，则手动更新每个实体
            for (ID id : ids) {
                repository.findById(id).ifPresent(entity -> {
                    try {
                        // 设置实体的deleted字段为true
                        Field deletedField = entity.getClass().getDeclaredField("deleted");
                        deletedField.setAccessible(true);
                        if (deletedField.getType() == Boolean.class) {
                            deletedField.set(entity, true);
                        } else if (deletedField.getType() == Integer.class) {
                            deletedField.set(entity, 1);
                        }
                        repository.save(entity);
                    } catch (NoSuchFieldException | IllegalAccessException e) {
                        logger.warn("无法更新实体的deleted字段: {}", e.getMessage());
                    }
                });
            }
        }
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