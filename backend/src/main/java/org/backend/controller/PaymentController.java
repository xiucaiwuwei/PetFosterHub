package org.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.backend.base.controller.BaseController;
import org.backend.base.dto.BaseResponse;
import org.backend.entity.Payment;
import org.backend.entity.enums.PaymentStatus;
import org.backend.repository.PaymentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "支付管理", description = "支付订单管理接口")
public class PaymentController extends BaseController {

    private final PaymentRepository paymentRepository;

    @GetMapping
    @Operation(summary = "获取当前用户的支付记录")
    public ResponseEntity<BaseResponse<List<Payment>>> getCurrentUserPayments(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        List<Payment> payments = paymentRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId);
        return super.success("获取成功", payments);
    }

    @GetMapping("/page")
    @Operation(summary = "分页获取当前用户的支付记录")
    public ResponseEntity<BaseResponse<Page<Payment>>> getCurrentUserPaymentsPage(
            Authentication authentication,
            Pageable pageable) {
        Long userId = Long.parseLong(authentication.getName());
        Page<Payment> payments = paymentRepository.findByUserIdAndDeletedFalseOrderByCreatedAtDesc(userId, pageable);
        return super.success("分页获取成功", payments);
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取支付详情")
    public ResponseEntity<BaseResponse<Payment>> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null || payment.getDeleted()) {
            return super.notFound("支付记录不存在");
        }
        return super.success("获取成功", payment);
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "获取预约的支付记录")
    public ResponseEntity<BaseResponse<List<Payment>>> getPaymentsByBookingId(@PathVariable Long bookingId) {
        List<Payment> payments = paymentRepository.findByBookingIdAndDeletedFalseOrderByCreatedAtDesc(bookingId);
        return super.success("获取成功", payments);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "根据状态获取支付记录")
    public ResponseEntity<BaseResponse<List<Payment>>> getPaymentsByStatus(
            Authentication authentication,
            @PathVariable PaymentStatus status) {
        Long userId = Long.parseLong(authentication.getName());
        List<Payment> payments = paymentRepository.findByUserIdAndStatus(userId, status);
        return super.success("获取成功", payments);
    }

    @GetMapping("/stats")
    @Operation(summary = "获取支付统计信息")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getPaymentStats(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());

        Double totalSpent = paymentRepository.getTotalSpentByUser(userId);
        Long successfulPayments = paymentRepository.countSuccessfulPaymentsByUser(userId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSpent", totalSpent != null ? totalSpent : 0.0);
        stats.put("successfulPayments", successfulPayments);

        return super.success("获取成功", stats);
    }

    @PostMapping("/create")
    @Operation(summary = "创建支付订单")
    public ResponseEntity<BaseResponse<Map<String, Object>>> createPayment(
            Authentication authentication,
            @RequestBody Map<String, Object> paymentRequest) {
        Long userId = Long.parseLong(authentication.getName());

        Long bookingId = Long.valueOf(paymentRequest.get("bookingId").toString());
        BigDecimal amount = new BigDecimal(paymentRequest.get("amount").toString());
        String paymentMethod = (String) paymentRequest.get("paymentMethod");
        String description = (String) paymentRequest.get("description");

        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setCurrency("CNY");
        payment.setPaymentMethod(paymentMethod);
        payment.setDescription(description);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTransactionId(UUID.randomUUID().toString().replace("-", ""));

        Payment savedPayment = paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("payment", savedPayment);
        response.put("paymentUrl", "/api/payments/process/" + savedPayment.getTransactionId());

        return super.success("支付订单创建成功", response);
    }

    @PostMapping("/process/{transactionId}")
    @Operation(summary = "处理支付")
    public ResponseEntity<BaseResponse<String>> processPayment(@PathVariable String transactionId) {
        Payment payment = paymentRepository.findByTransactionIdAndDeletedFalse(transactionId).orElse(null);
        if (payment == null) {
            return super.notFound("支付订单不存在");
        }

        // 模拟支付处理
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
        return super.success("支付成功");
    }

    @PostMapping("/refund/{paymentId}")
    @Operation(summary = "申请退款")
    public ResponseEntity<BaseResponse<String>> refundPayment(
            @PathVariable Long paymentId,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());

        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null || payment.getDeleted()) {
            return super.notFound("支付记录不存在");
        }

        if (!payment.getUserId().equals(userId)) {
            return super.forbidden("无权限操作");
        }

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            return super.failure("只有成功的支付才能退款");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return super.success("退款申请已提交");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "取消支付")
    public ResponseEntity<BaseResponse<String>> cancelPayment(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());

        Payment payment = paymentRepository.findById(id).orElse(null);
        if (payment == null || payment.getDeleted()) {
            return super.notFound("支付记录不存在");
        }

        if (!payment.getUserId().equals(userId)) {
            return super.forbidden("无权限操作");
        }

        if (payment.getStatus() != PaymentStatus.PENDING) {
            return super.failure("只有待支付的订单才能取消");
        }

        payment.setStatus(PaymentStatus.CANCELLED);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        return super.success("支付已取消");
    }
}