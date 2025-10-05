package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.backend.A_general.base.controller.BaseController;
import org.backend.A_general.base.dto.BaseResponse;
import org.backend.dto.request.BookingRequest;
import org.backend.dto.response.BookingResponse;
import org.backend.entity.Booking;
import org.backend.entity.User;
import org.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "预约管理", description = "预约订单管理接口")
public class BookingController extends BaseController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "获取当前用户的预约")
    public ResponseEntity<BaseResponse<List<Booking>>> getCurrentUserBookings(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<Booking> bookings = bookingService.findByOwnerId(userId);
        return super.success("获取成功", bookings);
    }

    @GetMapping("/received")
    @Operation(summary = "获取当前用户收到的预约")
    public ResponseEntity<BaseResponse<List<Booking>>> getCurrentUserReceivedBookings(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<Booking> bookings = bookingService.findByProviderId(userId);
        return super.success("获取成功", bookings);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取预约")
    public ResponseEntity<BaseResponse<Booking>> getBookingById(@PathVariable Long id) {
        Optional<Booking> bookingOptional = bookingService.findById(id);
        if (bookingOptional.isEmpty()) {
            return super.notFound("预约不存在");
        }
        return super.success("获取成功", bookingOptional.get());
    }

    @PostMapping
    @Operation(summary = "创建预约")
    public ResponseEntity<BaseResponse<Booking>> createBooking(
            Authentication authentication,
            @Valid @RequestBody BookingRequest bookingRequest) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        BookingResponse response = bookingService.create(bookingRequest, user);
        if (!response.isSuccess()) {
            return super.failure(response.getMessage());
        }
        // 创建Booking对象返回
        Booking booking = new Booking();
        booking.setId(response.getData().getId());
        booking.setOwnerId(user.getId());
        booking.setServiceId(bookingRequest.getFosterServiceId());
        booking.setStartDate(bookingRequest.getStartDate());
        booking.setEndDate(bookingRequest.getEndDate());
        booking.setStatus("PENDING");
        return super.success("创建成功", booking);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "更新预约状态")
    public ResponseEntity<BaseResponse<Booking>> updateBookingStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam String status) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        Booking booking = bookingService.updateStatus(id, status, user);
        return super.success("更新成功", booking);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "取消预约")
    public ResponseEntity<BaseResponse<String>> cancelBooking(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        bookingService.cancel(id, user);
        return super.success("预约取消成功");
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "根据状态获取预约")
    public ResponseEntity<BaseResponse<List<Booking>>> getBookingsByStatus(
            Authentication authentication,
            @PathVariable String status) {
        Long userId = Long.parseLong(authentication.getName());
        User user = new User();
        user.setId(userId);
        List<Booking> bookings = bookingService.findByUserAndStatus(user, status);
        return super.success("获取成功", bookings);
    }
}