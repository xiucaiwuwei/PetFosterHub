package org.backend.service.impl;

import org.backend.A_general.base.service.impl.BaseServiceImpl;
import org.backend.dto.request.ReviewRequest;
import org.backend.dto.response.ReviewResponse;
import org.backend.entity.Review;
import org.backend.entity.User;
import org.backend.entity.enums.ReviewType;
import org.backend.repository.ReviewRepository;
import org.backend.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl extends BaseServiceImpl<Review, Long, ReviewRepository> implements ReviewService {

    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        super(reviewRepository);
    }

    @Override
    public ReviewResponse createReview(ReviewRequest reviewRequest, User user) {
        try {
            // 检查用户是否已经评价过
            boolean hasReviewed = hasUserReviewedTarget(user, reviewRequest.getServiceId(), ReviewType.SERVICE);
            if (hasReviewed) {
                return ReviewResponse.error("您已经评价过了");
            }

            // 验证评分范围
            if (reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
                return ReviewResponse.error("评分必须在1-5之间");
            }

            // 创建Review实体
            Review review = new Review();
            review.setUserId(reviewRequest.getUserId());
            review.setTargetId(reviewRequest.getServiceId());
            review.setTargetType(ReviewType.SERVICE);
            review.setRating(reviewRequest.getRating());
            review.setComment(reviewRequest.getComment());
            review.setCreatedAt(LocalDateTime.now());
            review.setUpdatedAt(LocalDateTime.now());

            // 保存评价
            Review savedReview = save(review);

            // 设置ID到请求对象中，以便返回
            reviewRequest.setId(savedReview.getId());
            return ReviewResponse.success("评价创建成功", reviewRequest);
        } catch (Exception e) {
            return ReviewResponse.error("评价创建失败: " + e.getMessage());
        }
    }

    @Override
    public ReviewResponse updateReview(Long id, ReviewRequest reviewRequest, User user) {
        try {
            // 查找评价
            Optional<Review> optionalReview = findById(id);
            if (!optionalReview.isPresent()) {
                return ReviewResponse.error("评价不存在");
            }

            // 检查用户是否有权限修改
            Review review = optionalReview.get();
            if (!review.getUserId().equals(user.getId())) {
                return ReviewResponse.error("您无权修改此评价");
            }

            // 验证评分范围
            if (reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
                return ReviewResponse.error("评分必须在1-5之间");
            }

            // 更新评价
            review.setRating(reviewRequest.getRating());
            review.setComment(reviewRequest.getComment());
            review.setUpdatedAt(LocalDateTime.now());

            // 保存更新
            Review updatedReview = save(review);

            // 设置ID到请求对象中，以便返回
            reviewRequest.setId(updatedReview.getId());
            return ReviewResponse.success("评价更新成功", reviewRequest);
        } catch (Exception e) {
            return ReviewResponse.error("评价更新失败: " + e.getMessage());
        }
    }

    @Override
    public void deleteReview(Long id, User user) {
        Optional<Review> optionalReview = findById(id);
        if (optionalReview.isPresent()) {
            Review review = optionalReview.get();
            // 检查用户是否有权限删除
            if (review.getUserId().equals(user.getId())) {
                review.setDeleted(true);
                save(review);
            } else {
                throw new RuntimeException("您无权删除此评价");
            }
        }
    }

    @Override
    public List<Review> findByServiceId(Long serviceId) {
        return repository.findByTargetIdAndTargetTypeAndDeletedFalseOrderByCreatedAtDesc(
                serviceId, ReviewType.SERVICE);
    }

    @Override
    public Page<Review> findByServiceId(Long serviceId, Pageable pageable) {
        return repository.findByTargetIdAndTargetTypeAndDeletedFalseOrderByCreatedAtDesc(
                serviceId, ReviewType.SERVICE, pageable);
    }

    @Override
    public List<Review> findByUser(User user) {
        return repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(user.getId());
    }

    @Override
    public List<Review> findByUserId(Long userId) {
        return repository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Review> findByTargetIdAndType(Long targetId, ReviewType type) {
        return repository.findByTargetIdAndTargetTypeAndDeletedFalseOrderByCreatedAtDesc(
                targetId, type);
    }

    @Override
    public List<Review> findByTargetIdAndType(Long targetId, ReviewType type, int minRating) {
        return repository.findByTargetTypeAndRatingGreaterThanEqual(type, minRating);
    }

    @Override
    public Double getAverageRating(Long targetId, ReviewType type) {
        return repository.getAverageRating(targetId, type);
    }

    @Override
    public long countByTargetIdAndType(Long targetId, ReviewType type) {
        return repository.countByTargetIdAndTargetType(targetId, type);
    }

    @Override
    public boolean hasUserReviewedTarget(User user, Long targetId, ReviewType type) {
        Review review = repository.findByUserIdAndTargetIdAndTargetType(
                user.getId(), targetId, type);
        return review != null;
    }

    @Override
    public List<Review> findAll() {
        return repository.findAll();
    }

    @Override
    public Page<Review> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    @Override
    public long count() {
        return repository.count();
    }
}