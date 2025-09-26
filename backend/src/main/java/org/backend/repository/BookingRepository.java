package org.backend.repository;

import org.backend.base.repository.BaseRepository;
import org.backend.entity.Booking;
import org.backend.entity.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends BaseRepository<Booking, Long> {


    Page<Booking> findByStatusAndDeletedFalse(BookingStatus status, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.ownerId = :ownerId AND b.deleted = 0")
    Page<Booking> findByOwnerIdAndDeletedFalse(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.providerId = :providerId AND b.deleted = 0")
    Page<Booking> findByProviderIdAndDeletedFalse(@Param("providerId") Long providerId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.ownerId = :ownerId AND b.status = :status AND b.deleted = 0")
    List<Booking> findByOwnerIdAndStatusAndDeletedFalse(@Param("ownerId") Long ownerId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.providerId = :providerId AND b.status = :status AND b.deleted = 0")
    List<Booking> findByProviderIdAndStatusAndDeletedFalse(@Param("providerId") Long providerId, @Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.ownerId = :userId AND b.deleted = 0")
    List<Booking> findByOwnerIdAndDeletedFalse(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b WHERE b.providerId = :userId AND b.deleted = 0")
    List<Booking> findByProviderIdAndDeletedFalse(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.startDate <= :endDate AND b.endDate >= :startDate AND b.deleted = 0")
    List<Booking> findByStatusAndDateRange(@Param("status") String status,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Booking b WHERE b.serviceId = :serviceId AND b.status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS') AND b.deleted = 0")
    List<Booking> findActiveBookingsByServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.serviceId = :serviceId AND b.status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS') AND b.deleted = 0")
    long countActiveBookingsByServiceId(@Param("serviceId") Long serviceId);

}
