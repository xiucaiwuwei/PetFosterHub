package org.backend.service.impl;

import org.backend.A_general.base.service.impl.BaseServiceImpl;
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
import java.util.Collections;

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
        return save(pet);  // 使用BaseServiceImpl中的save方法
    }

    @Override
    public Pet update(Pet pet, User user) {
        // 使用findByIdAndNotDeleted确保只更新未删除的宠物
        Pet existingPet = findByIdAndNotDeleted(pet.getId()).orElse(null);
        if (existingPet == null || !existingPet.getUserId().equals(user.getId())) {
            throw new RuntimeException("宠物不存在或无权限修改");
        }
        pet.setUserId(user.getId());
        pet.setDeleted(existingPet.getDeleted());  // 保留删除状态
        return save(pet);  // 使用BaseServiceImpl中的save方法
    }

    @Override
    public void delete(Long id, User user) {
        Pet pet = findByIdAndNotDeleted(id).orElse(null);
        if (pet != null && pet.getUserId().equals(user.getId())) {
            // 使用logicallyDeleteByIds方法进行逻辑删除
            logicallyDeleteByIds(Collections.singletonList(id));
        }
    }

    @Override
    public List<Pet> findByUserAndNameContaining(User user, String keyword) {
        return repository.findByUserAndNameContaining(user.getId(), keyword);
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
        // 使用findAllNotDeleted获取所有未删除的宠物
        return (List<Pet>) findAllNotDeleted();
    }

    @Override
    public Page<Pet> findAll(Pageable pageable) {
        // 重写findAll方法，确保只返回未删除的宠物
        return repository.findAllByDeletedFalse(pageable);
    }

    @Override
    public List<Pet> searchPets(String keyword) {
        // 使用PetRepository中新增的关键词搜索方法，避免在内存中过滤
        return repository.findAllNotDeletedByNameContaining(keyword);
    }

    @Override
    public boolean existsById(Long id) {
        return super.existsById(id);
    }


}
