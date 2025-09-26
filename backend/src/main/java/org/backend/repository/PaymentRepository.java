package org.backend.repository;

import org.backend.base.repository.BaseRepository;
import org.backend.entity.Payment;
import org.backend.entity.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends BaseRepository<Payment, Long> {

    List<Payment> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

    Page<Payment> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Payment> findByBookingIdAndDeletedFalseOrderByCreatedAtDesc(Long bookingId);

    Optional<Payment> findByTransactionIdAndDeletedFalse(String transactionId);

    List<Payment> findByStatusAndDeletedFalse(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.userId = :userId AND p.status = :status AND p.deleted = false ORDER BY p.createdAt DESC")
    List<Payment> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") PaymentStatus status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.userId = :userId AND p.status = 'SUCCESS' AND p.deleted = false")
    Double getTotalSpentByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.userId = :userId AND p.status = 'SUCCESS' AND p.deleted = false")
    Long countSuccessfulPaymentsByUser(@Param("userId") Long userId);
}