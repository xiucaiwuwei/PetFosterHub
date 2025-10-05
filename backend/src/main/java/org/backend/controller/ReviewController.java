package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.dto.request.ReviewRequest;
import org.backend.dto.response.ReviewResponse;
import org.backend.entity.Review;
import org.backend.entity.User;
import org.backend.entity.enums.ReviewType;
import org.backend.repository.ReviewRepository;
import org.backend.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@Tag(name = "评价管理", description = "评价相关接口")
public class ReviewController extends BaseController {

    private final ReviewService reviewService;

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewService reviewService, ReviewRepository reviewRepository) {
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/service/{serviceId}")
    @Operation(summary = "获取服务的评价列表")
    public ResponseEntity<BaseResponse<List<Review>>> getServiceReviews(@PathVariable Long serviceId) {
        List<Review> reviews = reviewRepository.findByTargetIdAndTargetTypeAndDeletedFalseOrderByCreatedAtDesc(
                serviceId, ReviewType.SERVICE);
        return super.success("获取成功", reviews);
    }

    @GetMapping("/service/{serviceId}/page")
    @Operation(summary = "分页获取服务的评价")
    public ResponseEntity<BaseResponse<Page<Review>>> getServiceReviewsPage(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> reviews = reviewRepository.findByTargetIdAndTargetTypeAndDeletedFalseOrderByCreatedAtDesc(
                serviceId, ReviewType.SERVICE, pageable);
        return super.success("分页获取成功", reviews);
    }

    @GetMapping("/user")
    @Operation(summary = "获取当前用户的评价")
    public ResponseEntity<BaseResponse<List<Review>>> getCurrentUserReviews(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<Review> reviews = reviewRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
        return super.success("获取成功", reviews);
    }

    @GetMapping("/user/page")
    @Operation(summary = "分页获取当前用户的评价")
    public ResponseEntity<BaseResponse<Page<Review>>> getCurrentUserReviewsPage(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getCurrentUserId(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> reviews = reviewRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable);
        return super.success("分页获取成功", reviews);
    }

    @GetMapping("/service/{serviceId}/stats")
    @Operation(summary = "获取服务评价统计")
    public ResponseEntity<BaseResponse<ReviewStats>> getServiceReviewStats(@PathVariable Long serviceId) {
        Double averageRating = reviewRepository.getAverageRating(serviceId, ReviewType.SERVICE);
        Long reviewCount = reviewRepository.countByTargetIdAndTargetType(serviceId, ReviewType.SERVICE);

        ReviewStats stats = new ReviewStats();
        stats.setAverageRating(averageRating != null ? averageRating : 0.0);
        stats.setReviewCount(reviewCount != null ? reviewCount : 0);

        return super.success("获取成功", stats);
    }

    @PostMapping
    @Operation(summary = "创建评价")
    public ResponseEntity<BaseResponse<ReviewResponse>> createReview(
            Authentication authentication,
            @RequestBody ReviewRequest reviewRequest) {
        Long userId = getCurrentUserId(authentication);
        User user = new User();
        user.setId(userId);

        ReviewResponse savedReview = reviewService.createReview(reviewRequest, user);
        return super.success("评价创建成功", savedReview);
    }

    @PutMapping("/{reviewId}")
    @Operation(summary = "更新评价")
    public ResponseEntity<BaseResponse<ReviewResponse>> updateReview(
            @PathVariable Long reviewId,
            Authentication authentication,
            @RequestBody ReviewRequest reviewRequest) {
        Long userId = getCurrentUserId(authentication);
        User user = new User();
        user.setId(userId);
        reviewRequest.setId(reviewId);

        ReviewResponse updatedReview = reviewService.updateReview(reviewId, reviewRequest, user);
        return super.success("评价更新成功", updatedReview);
    }

    @DeleteMapping("/{reviewId}")
    @Operation(summary = "删除评价")
    public ResponseEntity<BaseResponse<Void>> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        User user = new User();
        user.setId(userId);

        reviewService.deleteReview(reviewId, user);
        return super.success("评价删除成功");
    }

    private Long getCurrentUserId(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    public static class ReviewStats {
        private Double averageRating;
        private Long reviewCount;

        public Double getAverageRating() {
            return averageRating;
        }

        public void setAverageRating(Double averageRating) {
            this.averageRating = averageRating;
        }

        public Long getReviewCount() {
            return reviewCount;
        }

        public void setReviewCount(Long reviewCount) {
            this.reviewCount = reviewCount;
        }
    }
}