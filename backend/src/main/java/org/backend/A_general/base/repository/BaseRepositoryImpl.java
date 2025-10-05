package org.backend.A_general.base.repository;

import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;

/**
 * BaseRepository接口的实现类
 * 提供通用的查询和持久化操作实现
 *
 * @param <T>  实体类型
 * @param <ID> 主键类型，必须实现Serializable接口
 */
public class BaseRepositoryImpl<T, ID extends Serializable> extends SimpleJpaRepository<T, ID> implements BaseRepository<T, ID> {

    private final EntityManager entityManager;
    private final JpaEntityInformation<T, ID> entityInformation;

    /**
     * 构造函数
     *
     * @param entityInformation 实体信息
     * @param entityManager     实体管理器
     */
    public BaseRepositoryImpl(JpaEntityInformation<T, ID> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
        this.entityInformation = entityInformation;
    }

    /**
     * 根据ID列表逻辑删除实体（将deleted字段设为true）
     *
     * @param ids ID列表
     */
    @Transactional
    @Override
    public void logicallyDeleteByIds(Iterable<ID> ids) {
        if (ids == null) {
            return;
        }

        String entityName = entityInformation.getEntityName();

        entityManager.createQuery("UPDATE " + entityName + " e SET e.deleted = true WHERE e.id IN :ids")
                .setParameter("ids", ids)
                .executeUpdate();
    }

    /**
     * 获取所有未删除的实体
     *
     * @return 未删除的实体列表
     */
    @Override
    public List<T> findAllNotDeleted() {
        String entityName = entityInformation.getEntityName();
        String query = "SELECT e FROM " + entityName + " e WHERE e.deleted = false";
        return entityManager.createQuery(query, entityInformation.getJavaType()).getResultList();
    }

    /**
     * 根据ID获取未删除的实体
     *
     * @param id 实体ID
     * @return 未删除的实体Optional
     */
    @Override
    public Optional<T> findByIdAndNotDeleted(ID id) {
        if (id == null) {
            return Optional.empty();
        }

        String entityName = entityInformation.getEntityName();
        String query = "SELECT e FROM " + entityName + " e WHERE e.id = :id AND e.deleted = false";

        try {
            T entity = entityManager.createQuery(query, entityInformation.getJavaType())
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.ofNullable(entity);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}