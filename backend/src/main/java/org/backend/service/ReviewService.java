package org.backend.service;

import org.backend.base.service.BaseService;
import org.backend.dto.request.ReviewRequest;
import org.backend.dto.response.ReviewResponse;
import org.backend.entity.Review;
import org.backend.entity.User;
import org.backend.entity.enums.ReviewType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ReviewService extends BaseService<Review, Long> {

    ReviewResponse createReview(ReviewRequest reviewRequest, User user);

    ReviewResponse updateReview(Long id, ReviewRequest reviewRequest, User user);

    void deleteReview(Long id, User user);

    Optional findById(Long id);

    List<Review> findByServiceId(Long serviceId);

    Page<Review> findByServiceId(Long serviceId, Pageable pageable);

    List<Review> findByUser(User user);

    List<Review> findByUserId(Long userId);

    List<Review> findByTargetIdAndType(Long targetId, ReviewType type);

    List<Review> findByTargetIdAndType(Long targetId, ReviewType type, int minRating);

    Double getAverageRating(Long targetId, ReviewType type);

    long countByTargetIdAndType(Long targetId, ReviewType type);

    boolean hasUserReviewedTarget(User user, Long targetId, ReviewType type);

    List<Review> findAll();

    Page<Review> findAll(Pageable pageable);

    boolean existsById(Long id);

    long count();
}