package org.backend.repository;

import org.backend.A_general.base.repository.BaseRepository;
import org.backend.entity.Pet;
import org.backend.entity.enums.PetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends BaseRepository<Pet, Long> {


    Page<Pet> findByUserIdAndDeletedFalse(Long userId, Pageable pageable);

    Page<Pet> findByTypeAndDeletedFalse(PetType type, Pageable pageable);

    @Query("SELECT p FROM Pet p WHERE p.userId = :userId AND p.name LIKE %:keyword% AND p.deleted = 0")
    List<Pet> findByUserAndNameContaining(@Param("userId") Long userId, @Param("keyword") String keyword);

    @Query("SELECT p FROM Pet p WHERE p.userId = :userId AND p.deleted = 0")
    List<Pet> findByUserIdAndDeletedFalse(@Param("userId") Long userId);
    
    // 查找所有未删除的宠物，支持分页
    Page<Pet> findAllByDeletedFalse(Pageable pageable);
    
    // 支持关键词搜索的方法
    @Query("SELECT p FROM Pet p WHERE p.deleted = 0 AND p.name LIKE %:keyword%")
    List<Pet> findAllNotDeletedByNameContaining(@Param("keyword") String keyword);
}
