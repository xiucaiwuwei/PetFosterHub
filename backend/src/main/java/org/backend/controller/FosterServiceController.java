package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.entity.FosterService;
import org.backend.entity.User;
import org.backend.service.FosterServiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foster-services")
@RequiredArgsConstructor
@Tag(name = "寄养服务管理", description = "寄养服务信息管理接口")
public class FosterServiceController extends BaseController {

    private final FosterServiceService fosterServiceService;

    @GetMapping
    @Operation(summary = "获取所有寄养服务")
    public ResponseEntity<BaseResponse<List<FosterService>>> getAllFosterServices() {
        List<FosterService> services = fosterServiceService.findAll();
        return super.success("获取成功", services);
    }

    @GetMapping("/page")
    @Operation(summary = "分页获取寄养服务")
    public ResponseEntity<BaseResponse<Page<FosterService>>> getFosterServicesPage(Pageable pageable) {
        Page<FosterService> services = fosterServiceService.findAll(pageable);
        return super.success("获取成功", services);
    }

    @GetMapping("/featured")
    @Operation(summary = "获取推荐寄养服务")
    public ResponseEntity<BaseResponse<List<FosterService>>> getFeaturedFosterServices() {
        List<FosterService> services = fosterServiceService.findFeatured();
        return super.success("获取成功", services);
    }

    @GetMapping("/provider")
    @Operation(summary = "获取当前用户的寄养服务")
    public ResponseEntity<BaseResponse<List<FosterService>>> getCurrentUserFosterServices(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<FosterService> services = fosterServiceService.findByProvider(user);
        return super.success("获取成功", services);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取寄养服务")
    public ResponseEntity<BaseResponse<FosterService>> getFosterServiceById(@PathVariable Long id) {
        Optional<FosterService> serviceOptional = fosterServiceService.findById(id);
        if (serviceOptional.isEmpty()) {
            return super.notFound("寄养服务不存在");
        }
        return super.success("获取成功", serviceOptional.get());
    }

    @PostMapping
    @Operation(summary = "创建寄养服务")
    public ResponseEntity<BaseResponse<FosterService>> createFosterService(
            Authentication authentication,
            @Valid @RequestBody FosterService fosterService) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        FosterService savedService = fosterServiceService.save(fosterService, user);
        return super.success("创建成功", savedService);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新寄养服务")
    public ResponseEntity<BaseResponse<FosterService>> updateFosterService(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody FosterService fosterService) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        fosterService.setId(id);
        FosterService updatedService = fosterServiceService.update(fosterService, user);
        return super.success("更新成功", updatedService);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除寄养服务")
    public ResponseEntity<BaseResponse<String>> deleteFosterService(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        fosterServiceService.delete(id, user);
        return super.success("寄养服务删除成功");
    }

    @GetMapping("/search")
    @Operation(summary = "搜索寄养服务")
    public ResponseEntity<BaseResponse<List<FosterService>>> searchFosterServices(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) Double maxPrice) {
        List<FosterService> services = fosterServiceService.search(location, petType, maxPrice);
        return super.success("获取成功", services);
    }

    @GetMapping("/search/page")
    @Operation(summary = "分页搜索寄养服务")
    public ResponseEntity<BaseResponse<Page<FosterService>>> searchFosterServicesPage(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) Double maxPrice,
            Pageable pageable) {
        Page<FosterService> services = fosterServiceService.search(location, petType, maxPrice, pageable);
        return super.success("获取成功", services);
    }

    @GetMapping("/by-provider/{providerId}")
    @Operation(summary = "根据提供者ID获取寄养服务")
    public ResponseEntity<BaseResponse<List<FosterService>>> getFosterServicesByProvider(@PathVariable Long providerId) {
        List<FosterService> services = fosterServiceService.findByProviderId(providerId);
        return super.success("获取成功", services);
    }
}