package org.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.backend.dto.response.home.FosterServiceHomeResponse;
import org.backend.dto.response.home.ReviewHomeResponse;
import org.backend.entity.FosterService;
import org.backend.entity.Review;
import org.backend.entity.User;
import org.backend.entity.enums.ReviewType;
import org.backend.repository.FosterServiceRepository;
import org.backend.repository.ReviewRepository;
import org.backend.repository.UserRepository;
import org.backend.service.HomeService;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 首页服务实现类
 */
@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final FosterServiceRepository fosterServiceRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    /**
     * 获取评分最高的三个寄养服务
     * @return 评分最高的三个寄养服务列表
     */
    @Override
    public List<FosterServiceHomeResponse> getTopThreeFosters() {
        // 获取所有未删除的寄养服务
        List<FosterService> allFosterServices = fosterServiceRepository.findNotDeleted();
        
        // 为每个寄养服务计算评分和评论数量
        List<FosterServiceHomeResponse> fosterServiceDTOs = allFosterServices.stream()
                .map(this::convertToDTO)
                .sorted(Comparator.comparing(FosterServiceHomeResponse::getRating).reversed())
                .limit(3)
                .collect(Collectors.toList());
        
        return fosterServiceDTOs;
    }

    /**
     * 获取最新的三个用户评价
     * @return 最新的三个用户评价列表
     */
    @Override
    public List<ReviewHomeResponse> getLatestThreeTestimonials() {
        // 获取所有服务类型的评价，按创建时间降序排列，取前三个
        List<Review> latestReviews = reviewRepository.findByTargetTypeAndRatingGreaterThanEqual(
                ReviewType.SERVICE, 1);
        
        // 转换为ReviewDTO列表
        List<ReviewHomeResponse> reviewDTOs = latestReviews.stream()
                .limit(3)
                .map(this::convertReviewToDTO)
                .collect(Collectors.toList());
        
        return reviewDTOs;
    }

    /**
     * 将FosterService实体转换为FosterServiceDTO
     * @param fosterService 寄养服务实体
     * @return 转换后的寄养服务DTO
     */
    private FosterServiceHomeResponse convertToDTO(FosterService fosterService) {
        FosterServiceHomeResponse dto = new FosterServiceHomeResponse();
        dto.setId(String.valueOf(fosterService.getId()));
        dto.setProviderId(String.valueOf(fosterService.getProviderId()));
        
        // 获取服务提供者信息
        Optional<User> providerOptional = userRepository.findById(fosterService.getProviderId());
        providerOptional.ifPresent(provider -> {
            dto.setProviderName(provider.getNickname() != null ? provider.getNickname() : 
                              (provider.getFullName() != null ? provider.getFullName() : "服务提供者"));
            dto.setProviderAvatar(provider.getAvatar() != null ? provider.getAvatar() : "/default-avatar.png");
        });
        
        dto.setTitle(fosterService.getTitle());
        dto.setDescription(fosterService.getDescription());
        // 修复BigDecimal转Double的类型不匹配问题
        dto.setPricePerDay(fosterService.getPrice() != null ? fosterService.getPrice().doubleValue() : 0.0);
        dto.setLocation(fosterService.getLocation());
        
        // 处理图片列表
        if (fosterService.getImages() != null && !fosterService.getImages().isEmpty()) {
            // 假设images字段是以逗号分隔的字符串
            List<String> imageList = Arrays.asList(fosterService.getImages().split(","));
            dto.setImages(imageList);
        } else {
            dto.setImages(Collections.singletonList("/default-foster-image.png"));
        }
        
        // 处理便利设施（示例实现，实际根据实体结构调整）
        // 这里假设没有amenities字段，使用一些默认值
        dto.setAmenities(Arrays.asList("专业照顾", "定时喂食", "每日遛弯"));
        
        // 获取评分和评论数量
        Double averageRating = reviewRepository.getAverageRating(fosterService.getId(), ReviewType.SERVICE);
        dto.setRating(averageRating != null ? averageRating : 0.0);
        
        Long reviewsCount = reviewRepository.countByTargetIdAndTargetType(fosterService.getId(), ReviewType.SERVICE);
        dto.setReviewsCount(reviewsCount);
        
        // 修复Boolean与int比较的问题
        dto.setIsAvailable(fosterService.getAvailable() != null && fosterService.getAvailable());
        
        // 格式化日期
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        if (fosterService.getCreatedAt() != null) {
            dto.setCreatedAt(fosterService.getCreatedAt().format(formatter));
        }
        if (fosterService.getUpdatedAt() != null) {
            dto.setUpdatedAt(fosterService.getUpdatedAt().format(formatter));
        }
        
        return dto;
    }

    /**
     * 将Review实体转换为ReviewDTO
     * @param review 评价实体
     * @return 转换后的评价DTO
     */
    private ReviewHomeResponse convertReviewToDTO(Review review) {
        ReviewHomeResponse dto = new ReviewHomeResponse();
        dto.setId(String.valueOf(review.getId()));
        dto.setContent(review.getComment());
        dto.setRating(review.getRating());
        
        // 获取用户信息
        Optional<User> userOptional = userRepository.findById(review.getUserId());
        userOptional.ifPresent(user -> {
            dto.setName(user.getNickname() != null ? user.getNickname() : 
                      (user.getFullName() != null ? user.getFullName() : "用户"));
            dto.setAvatar(user.getAvatar() != null ? user.getAvatar() : "/default-avatar.png");
        });
        
        return dto;
    }
}