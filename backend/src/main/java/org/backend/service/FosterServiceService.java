package org.backend.service;

import org.backend.base.service.BaseService;
import org.backend.entity.FosterService;
import org.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface FosterServiceService extends BaseService<FosterService, Long> {

    List<FosterService> findAll();

    Page<FosterService> findAll(Pageable pageable);

    List<FosterService> findByProvider(User provider);

    Page<FosterService> findByProvider(User provider, Pageable pageable);

    Optional<FosterService> findById(Long id);

    FosterService save(FosterService fosterService, User provider);

    FosterService update(FosterService fosterService, User provider);

    void delete(Long id, User provider);

    List<FosterService> search(String location, String petType, Double maxPrice);

    Page<FosterService> search(String location, String petType, Double maxPrice, Pageable pageable);

    List<FosterService> findByProviderId(Long providerId);

    List<FosterService> findFeatured();

    boolean existsById(Long id);

    long count();
}