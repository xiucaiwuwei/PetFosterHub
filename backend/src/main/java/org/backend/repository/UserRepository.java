package org.backend.repository;

import org.backend.base.repository.BaseRepository;
import org.backend.entity.User;
import org.backend.entity.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends BaseRepository<User, Long> {

    Optional<User> findByPhone(String phone);

    Optional<User> findByPhoneAndRole(String phone, UserRole role);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndRole(String phone, UserRole role);

    Page<User> findByRole(UserRole role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.rating >= :minRating")
    Page<User> findByRoleAndMinRating(@Param("role") UserRole role, @Param("minRating") Double minRating, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:keyword% OR u.nickname LIKE %:keyword%")
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
