package org.backend.service;

import org.backend.base.service.BaseService;
import org.backend.entity.Pet;
import org.backend.entity.User;
import org.backend.entity.enums.PetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface PetService extends BaseService<Pet, Long> {

    List<Pet> findByUser(User user);

    Page<Pet> findByUser(User user, Pageable pageable);

    Page<Pet> findByType(PetType type, Pageable pageable);

    Pet save(Pet pet, User user);

    Pet update(Pet pet, User user);

    void delete(Long id, User user);

    Optional<Pet> findById(Long id);

    List<Pet> findByUserAndNameContaining(User user, String keyword);

    List<Pet> findByUserId(Long userId);

    List<Pet> findAll();

    Page<Pet> findAll(Pageable pageable);

    List<Pet> searchPets(String keyword);

    boolean existsById(Long id);
}