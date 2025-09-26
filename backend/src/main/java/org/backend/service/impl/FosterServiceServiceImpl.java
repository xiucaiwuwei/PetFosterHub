package org.backend.service.impl;

import org.backend.base.service.BaseServiceImpl;
import org.backend.entity.FosterService;
import org.backend.entity.User;
import org.backend.repository.FosterServiceRepository;
import org.backend.service.FosterServiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FosterServiceServiceImpl extends BaseServiceImpl<FosterService, Long, FosterServiceRepository> implements FosterServiceService {

    public FosterServiceServiceImpl(FosterServiceRepository fosterServiceRepository) {
        super(fosterServiceRepository);
    }


    @Override
    public List<FosterService> findByProvider(User provider) {
        return repository.findByProviderIdAndDeletedFalse(provider.getId());
    }

    @Override
    public Page<FosterService> findByProvider(User provider, Pageable pageable) {
        // 使用现有的findNotDeleted方法获取所有未删除的服务，然后通过stream过滤和分页
        List<FosterService> allNotDeleted = repository.findNotDeleted();
        List<FosterService> providerServices = allNotDeleted.stream()
                .filter(fs -> fs.getProviderId().equals(provider.getId()))
                .collect(Collectors.toList());

        int start = Math.min((int) pageable.getOffset(), providerServices.size());
        int end = Math.min((start + pageable.getPageSize()), providerServices.size());

        List<FosterService> pageContent = start < end ? providerServices.subList(start, end) : new ArrayList<>();

        return new PageImpl<>(pageContent, pageable, providerServices.size());
    }


    @Override
    public FosterService save(FosterService fosterService, User provider) {
        fosterService.setProviderId(provider.getId());
        return save(fosterService);
    }

    @Override
    public FosterService update(FosterService fosterService, User provider) {
        FosterService existing = findById(fosterService.getId()).orElse(null);
        if (existing == null) {
            return null;
        }

        if (!existing.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("无权限修改此寄养服务");
        }

        fosterService.setProviderId(provider.getId());
        return save(fosterService);
    }

    @Override
    public void delete(Long id, User provider) {
        FosterService existing = findById(id).orElse(null);
        if (existing == null) {
            throw new RuntimeException("寄养服务不存在");
        }

        if (!existing.getProviderId().equals(provider.getId())) {
            throw new RuntimeException("无权限删除此寄养服务");
        }

        existing.setDeleted(1);
        save(existing);
    }

    @Override
    public List<FosterService> search(String location, String petType, Double maxPrice) {
        return repository.search(location, petType, maxPrice);
    }

    @Override
    public Page<FosterService> search(String location, String petType, Double maxPrice, Pageable pageable) {
        return repository.search(location, petType, maxPrice, pageable);
    }

    // 添加searchByKeyword方法支持关键词搜索
    public List<FosterService> searchByKeyword(String keyword) {
        return repository.searchByKeyword(keyword);
    }

    public Page<FosterService> searchByKeyword(String keyword, Pageable pageable) {
        return repository.searchByKeyword(keyword, pageable);
    }

    @Override
    public List<FosterService> findByProviderId(Long providerId) {
        return repository.findByProviderIdAndDeletedFalse(providerId);
    }

    @Override
    public Optional<FosterService> findById(Long id) {
        return super.findById(id);
    }

    @Override
    public List<FosterService> findFeatured() {
        // 由于FosterService实体中没有rating字段，使用创建时间降序排列作为替代方案
        return repository.findNotDeletedOrderByCreatedAtDesc();
    }

    @Override
    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    @Override
    public long count() {
        return repository.count();
    }
}
