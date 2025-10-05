package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.dto.response.home.FosterServiceHomeResponse;
import org.backend.dto.response.home.ReviewHomeResponse;
import org.backend.service.HomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 首页相关接口
 */
@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
@Tag(name = "首页相关接口")
public class HomeController extends BaseController {

    private final HomeService homeService;

    /**
     * 获取评分最高的三个寄养服务
     * @return 评分最高的三个寄养服务列表
     */
    @GetMapping("/top-three-fosters")
    @Operation(summary = "获取评分最高的三个寄养服务")
    public ResponseEntity<BaseResponse<List<FosterServiceHomeResponse>>> getTopThreeFosters() {
        List<FosterServiceHomeResponse> fosterServices = homeService.getTopThreeFosters();
        return super.success("获取成功", fosterServices);
    }

    /**
     * 获取最新的三个用户评价
     * @return 最新的三个用户评价列表
     */
    @GetMapping("/latest-three-testimonials")
    @Operation(summary = "获取最新的三个用户评价")
    public ResponseEntity<BaseResponse<List<ReviewHomeResponse>>> getLatestThreeTestimonials() {
        List<ReviewHomeResponse> testimonials = homeService.getLatestThreeTestimonials();
        return super.success("获取成功", testimonials);
    }
}