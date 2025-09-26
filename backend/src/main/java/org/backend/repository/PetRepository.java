package org.backend.repository;

import org.backend.base.repository.BaseRepository;
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
}
