package org.backend.service.impl;

import org.backend.A_general.base.service.impl.BaseServiceImpl;
import org.backend.dto.request.BookingRequest;
import org.backend.dto.response.BookingResponse;
import org.backend.entity.Booking;
import org.backend.entity.User;
import org.backend.entity.enums.BookingStatus;
import org.backend.repository.BookingRepository;
import org.backend.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl extends BaseServiceImpl<Booking, Long, BookingRepository> implements BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    public BookingServiceImpl(BookingRepository bookingRepository) {
        super(bookingRepository);
    }

    @Override
    public Optional<Booking> findById(Long id) {
        return repository.findById(id).filter(booking -> booking.getDeleted() == null || booking.getDeleted() == 0);
    }

    @Override
    public boolean existsById(Long id) {
        return findById(id).isPresent();
    }

    @Override
    public long count() {
        return repository.count();
    }

    @Override
    public List<Booking> findByOwner(User owner) {
        return repository.findByOwnerIdAndDeletedFalse(owner.getId());
    }

    @Override
    public List<Booking> findByProvider(User provider) {
        return repository.findByProviderIdAndDeletedFalse(provider.getId());
    }

    @Override
    public Page<Booking> findByOwner(User owner, Pageable pageable) {
        return repository.findByOwnerIdAndDeletedFalse(owner.getId(), pageable);
    }

    @Override
    public Page<Booking> findByProvider(User provider, Pageable pageable) {
        return repository.findByProviderIdAndDeletedFalse(provider.getId(), pageable);
    }

    @Override
    public Page<Booking> findByStatus(BookingStatus status, Pageable pageable) {
        return repository.findByStatusAndDeletedFalse(status, pageable);
    }


    @Override
    public void delete(Long id) {
        findById(id).ifPresent(booking -> {
            booking.setDeleted(1);
            save(booking);
        });
    }


    @Override
    public List<Booking> findByOwnerId(Long ownerId) {
        return repository.findByOwnerIdAndDeletedFalse(ownerId);
    }

    @Override
    public List<Booking> findByProviderId(Long providerId) {
        return repository.findByProviderIdAndDeletedFalse(providerId);
    }

    @Override
    public List<Booking> findByStatusAndDateRange(String status, LocalDateTime startDate, LocalDateTime endDate) {
        return repository.findByStatusAndDateRange(status, startDate, endDate);
    }

    @Override
    public List<Booking> findActiveBookingsByServiceId(Long serviceId) {
        return repository.findActiveBookingsByServiceId(serviceId);
    }

    @Override
    public long countActiveBookingsByServiceId(Long serviceId) {
        return repository.countActiveBookingsByServiceId(serviceId);
    }

    @Override
    public List<Booking> findByUser(User user) {
        return repository.findByOwnerIdAndDeletedFalse(user.getId());
    }

    @Override
    public List<Booking> findByServiceProvider(User provider) {
        return repository.findByProviderIdAndDeletedFalse(provider.getId());
    }

    @Override
    public List<Booking> findByUserAndStatus(User user, String status) {
        // Convert string status to BookingStatus enum
        BookingStatus bookingStatus;
        try {
            bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid booking status: {}", status, e);
            return List.of();
        }

        // First try to find as owner
        List<Booking> bookings = repository.findByOwnerIdAndStatusAndDeletedFalse(user.getId(), bookingStatus);

        // If no bookings found as owner, try as provider
        if (bookings.isEmpty()) {
            bookings = repository.findByProviderIdAndStatusAndDeletedFalse(user.getId(), bookingStatus);
        }

        return bookings;
    }

    public BookingResponse create(BookingRequest bookingRequest, User user) {
        try {
            Booking booking = new Booking();
            booking.setOwnerId(user.getId());
            booking.setStartDate(bookingRequest.getStartDate());
            booking.setEndDate(bookingRequest.getEndDate());
            booking.setSpecialRequirements(bookingRequest.getSpecialRequirements());
            booking.setStatus(BookingStatus.PENDING.name());
            booking.setCreatedAt(LocalDateTime.now());
            booking.setUpdatedAt(LocalDateTime.now());

            // 设置服务ID
            if (bookingRequest.getFosterServiceId() != null) {
                booking.setServiceId(bookingRequest.getFosterServiceId());
            }

            Booking savedBooking = repository.save(booking);

            // 设置ID到请求对象中，以便返回
            bookingRequest.setId(savedBooking.getId());
            return BookingResponse.success("预约创建成功", bookingRequest);
        } catch (Exception e) {
            return BookingResponse.error("预约创建失败: " + e.getMessage());
        }
    }

    @Override
    public Booking update(Booking booking) {
        logger.debug("更新预约: {}", booking);
        return save(booking);
    }

    @Override
    public Booking updateStatus(Long id, String status, User user) {
        Booking booking = findById(id).orElseThrow(() -> new RuntimeException("预约不存在"));

        if (!booking.getOwnerId().equals(user.getId()) &&
                !booking.getProviderId().equals(user.getId())) {
            throw new RuntimeException("无权限修改此预约");
        }

        booking.setStatus(status.toUpperCase());
        booking.setUpdatedAt(LocalDateTime.now());
        return repository.save(booking);
    }

    @Override
    public void cancel(Long id, User user) {
        Booking booking = findById(id).orElseThrow(() -> new RuntimeException("预约不存在"));

        if (!booking.getOwnerId().equals(user.getId())) {
            throw new RuntimeException("无权限取消此预约");
        }

        if (!"PENDING".equals(booking.getStatus())) {
            throw new RuntimeException("只能取消待确认的预约");
        }

        booking.setStatus("CANCELLED");
        booking.setUpdatedAt(LocalDateTime.now());
        repository.save(booking);
    }
}
