package org.backend.repository;

import org.backend.A_general.base.repository.BaseRepository;
import org.backend.entity.FosterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FosterServiceRepository extends BaseRepository<FosterService, Long> {

    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0")
    List<FosterService> findNotDeleted();

    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0")
    Page<FosterService> findNotDeleted(Pageable pageable);

    // 根据创建时间降序查找所有未删除的寄养服务
    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0 ORDER BY fs.createdAt DESC")
    List<FosterService> findNotDeletedOrderByCreatedAtDesc();

    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0 AND " +
            "(:location IS NULL OR fs.location LIKE %:location%) AND " +
            "(:serviceType IS NULL OR fs.serviceType LIKE %:serviceType%) AND " +
            "(:maxPrice IS NULL OR fs.price <= :maxPrice)")
    List<FosterService> search(@Param("location") String location,
                               @Param("serviceType") String serviceType,
                               @Param("maxPrice") Double maxPrice);

    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0 AND " +
            "(:location IS NULL OR fs.location LIKE %:location%) AND " +
            "(:serviceType IS NULL OR fs.serviceType LIKE %:serviceType%) AND " +
            "(:maxPrice IS NULL OR fs.price <= :maxPrice)")
    Page<FosterService> search(@Param("location") String location,
                               @Param("serviceType") String serviceType,
                               @Param("maxPrice") Double maxPrice,
                               Pageable pageable);

    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0 AND " +
            "(LOWER(fs.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(fs.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(fs.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<FosterService> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0 AND " +
            "(LOWER(fs.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(fs.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(fs.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<FosterService> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT fs FROM FosterService fs WHERE fs.deleted = 0 AND " +
            "fs.providerId = :providerId")
    List<FosterService> findByProviderIdAndDeletedFalse(@Param("providerId") Long providerId);
}
