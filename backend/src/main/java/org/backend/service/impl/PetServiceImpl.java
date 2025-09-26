package org.backend.service.impl;

import org.backend.base.service.BaseServiceImpl;
import org.backend.entity.Pet;
import org.backend.entity.User;
import org.backend.entity.enums.PetType;
import org.backend.repository.PetRepository;
import org.backend.service.PetService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetServiceImpl extends BaseServiceImpl<Pet, Long, PetRepository> implements PetService {

    public PetServiceImpl(PetRepository petRepository) {
        super(petRepository);
    }

    @Override
    public List<Pet> findByUser(User user) {
        return repository.findByUserIdAndDeletedFalse(user.getId());
    }

    @Override
    public Page<Pet> findByUser(User user, Pageable pageable) {
        return repository.findByUserIdAndDeletedFalse(user.getId(), pageable);
    }

    @Override
    public Page<Pet> findByType(PetType type, Pageable pageable) {
        return repository.findByTypeAndDeletedFalse(type, pageable);
    }

    @Override
    public Pet save(Pet pet, User user) {
        pet.setUserId(user.getId());
        return repository.save(pet);
    }

    @Override
    public Pet update(Pet pet, User user) {
        Pet existingPet = repository.findById(pet.getId()).orElse(null);
        if (existingPet == null || !existingPet.getUserId().equals(user.getId())) {
            throw new RuntimeException("宠物不存在或无权限修改");
        }
        pet.setUserId(user.getId());
        return repository.save(pet);
    }

    @Override
    public void delete(Long id, User user) {
        Pet pet = findById(id).orElse(null);
        if (pet != null && pet.getUserId().equals(user.getId())) {
            pet.setDeleted(1);
            save(pet);
        }
    }


    @Override
    public List<Pet> findByUserAndNameContaining(User user, String keyword) {
        return repository.findByUserAndNameContaining(user.getId(), keyword);
    }

    // 根据BaseRepository，PetRepository应该提供findAll方法，但我们需要过滤已删除的宠物
    private List<Pet> findAllNotDeleted() {
        // 获取所有宠物并过滤掉已删除的（deleted不为0）
        return repository.findAll().stream()
                .filter(pet -> pet.getDeleted() == null || pet.getDeleted() == 0)
                .toList();
    }

    @Override
    public List<Pet> findByUserId(Long userId) {
        return repository.findByUserIdAndDeletedFalse(userId);
    }


    @Override
    public Optional<Pet> findById(Long id) {
        return super.findById(id);
    }

    @Override
    public List<Pet> findAll() {
        return super.findAll();
    }

    @Override
    public Page<Pet> findAll(Pageable pageable) {
        return super.findAll(pageable);
    }

    @Override
    public List<Pet> searchPets(String keyword) {
        // 先获取所有未删除的宠物，然后在内存中根据关键词过滤
        List<Pet> allPets = findAllNotDeleted();
        return allPets.stream()
                .filter(pet -> pet.getName().toLowerCase().contains(keyword.toLowerCase()))
                .toList();
    }

    @Override
    public boolean existsById(Long id) {
        return super.existsById(id);
    }


}
