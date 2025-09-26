package org.backend.service;

import org.backend.base.service.BaseService;
import org.backend.dto.request.BookingRequest;
import org.backend.dto.response.BookingResponse;
import org.backend.entity.Booking;
import org.backend.entity.User;
import org.backend.entity.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingService extends BaseService<Booking, Long> {

    List<Booking> findByOwner(User owner);

    List<Booking> findByProvider(User provider);

    Page<Booking> findByOwner(User owner, Pageable pageable);

    Page<Booking> findByProvider(User provider, Pageable pageable);

    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    Booking save(Booking booking);

    Booking update(Booking booking);

    void delete(Long id);

    Optional<Booking> findById(Long id);

    List<Booking> findByOwnerId(Long ownerId);

    List<Booking> findByProviderId(Long providerId);

    List<Booking> findByStatusAndDateRange(String status, LocalDateTime startDate, LocalDateTime endDate);

    List<Booking> findActiveBookingsByServiceId(Long serviceId);

    long countActiveBookingsByServiceId(Long serviceId);

    List<Booking> findByUser(User user);

    List<Booking> findByServiceProvider(User provider);

    List<Booking> findByUserAndStatus(User user, String status);

    BookingResponse create(BookingRequest bookingRequest, User user);

    Booking updateStatus(Long id, String status, User user);

    void cancel(Long id, User user);

    boolean existsById(Long id);

    long count();
}