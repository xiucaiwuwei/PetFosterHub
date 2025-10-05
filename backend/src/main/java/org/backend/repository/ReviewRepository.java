package org.backend.repository;

import org.backend.A_general.base.repository.BaseRepository;
import org.backend.entity.Review;
import org.backend.entity.enums.ReviewType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends BaseRepository<Review, Long> {

    List<Review> findByTargetIdAndTargetTypeAndDeletedFalseOrderByCreatedAtDesc(Long targetId, ReviewType targetType);

    Page<Review> findByTargetIdAndTargetTypeAndDeletedFalseOrderByCreatedAtDesc(Long targetId, ReviewType targetType, Pageable pageable);

    List<Review> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

    Page<Review> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Review> findByBookingIdAndDeletedFalse(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.targetId = :targetId AND r.targetType = :targetType AND r.deleted = false")
    Double getAverageRating(@Param("targetId") Long targetId, @Param("targetType") ReviewType targetType);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.targetId = :targetId AND r.targetType = :targetType AND r.deleted = false")
    Long countByTargetIdAndTargetType(@Param("targetId") Long targetId, @Param("targetType") ReviewType targetType);

    @Query("SELECT r FROM Review r WHERE r.targetId = :targetId AND r.targetType = :targetType AND r.userId = :userId AND r.deleted = false")
    Review findByUserIdAndTargetIdAndTargetType(@Param("userId") Long userId,
                                                @Param("targetId") Long targetId,
                                                @Param("targetType") ReviewType targetType);

    @Query("SELECT r FROM Review r WHERE r.targetType = :targetType AND r.rating >= :minRating AND r.deleted = false ORDER BY r.createdAt DESC")
    List<Review> findByTargetTypeAndRatingGreaterThanEqual(@Param("targetType") ReviewType targetType,
                                                           @Param("minRating") Integer minRating);
}