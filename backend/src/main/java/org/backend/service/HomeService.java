package org.backend.service;

import org.backend.dto.response.home.FosterServiceHomeResponse;
import org.backend.dto.response.home.ReviewHomeResponse;

import java.util.List;

/**
 * 首页服务接口
 */
public interface HomeService {
    /**
     * 获取评分最高的三个寄养服务
     * @return 评分最高的三个寄养服务列表
     */
    List<FosterServiceHomeResponse> getTopThreeFosters();

    /**
     * 获取最新的三个用户评价
     * @return 最新的三个用户评价列表
     */
    List<ReviewHomeResponse> getLatestThreeTestimonials();
}