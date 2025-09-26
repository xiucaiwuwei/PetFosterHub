package org.backend.service.impl;

import org.backend.base.service.BaseServiceImpl;
import org.backend.dto.request.UserRequest;
import org.backend.dto.request.auth.VerificationCodeVerifyRequest;
import org.backend.entity.User;
import org.backend.entity.enums.UserRole;
import org.backend.entity.enums.VerificationCodeType;
import org.backend.repository.UserRepository;
import org.backend.service.UserService;
import org.backend.service.VerificationCodeService;
import org.backend.utils.ValidationUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl extends BaseServiceImpl<User, Long, UserRepository> implements UserService {

    private final VerificationCodeService verificationCodeService;

    public UserServiceImpl(UserRepository repository,
                           VerificationCodeService verificationCodeService) {
        super(repository);
        this.verificationCodeService = verificationCodeService;
    }

    @Override
    public Page<User> searchUsers(String keyword, int pageNum, int pageSize) {
        PageRequest pageable = PageRequest.of(pageNum, pageSize);
        return repository.searchByKeyword(keyword, pageable);
    }

    @Override
    public Page<User> findUsersByRoleAndMinRating(UserRole role, Double minRating, int pageNum, int pageSize) {
        PageRequest pageable = PageRequest.of(pageNum, pageSize);
        return repository.findByRoleAndMinRating(role, minRating, pageable);
    }

    @Override
    public User saveUser(User user) {
        return repository.save(user);
    }

    @Override
    public UserRequest getUserDTOById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        UserRequest request = new UserRequest();
        request.setFullName(user.getFullName());
        request.setPhone(user.getPhone());
        request.setAddress(user.getAddress());
        request.setBio(user.getBio());
        return request;
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return repository.findById(id);
    }

    @Override
    public User findByPhone(String phone) {
        if (!ValidationUtil.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        return repository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    @Override
    public User findByPhoneAndRole(String phone, UserRole role) {
        if (!ValidationUtil.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        return repository.findByPhoneAndRole(phone, role)
                .orElseThrow(() -> new RuntimeException("该角色用户不存在"));
    }

    @Override
    public boolean existsByPhone(String phone) {
        if (!ValidationUtil.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        return repository.existsByPhone(phone);
    }

    @Override
    public boolean existsByPhoneAndRole(String phone, UserRole role) {
        if (!ValidationUtil.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        return repository.existsByPhoneAndRole(phone, role);
    }



    @Override
    public boolean verifyCode(String phone, String verificationCode, VerificationCodeType verificationCodeType) {
        // 创建验证码验证请求对象
        VerificationCodeVerifyRequest verifyRequest = new VerificationCodeVerifyRequest();
        verifyRequest.setPhone(phone);
        verifyRequest.setCode(verificationCode);
        verifyRequest.setType(verificationCodeType);
        
        // 调用验证码服务进行验证
        return verificationCodeService.verifyCode(verifyRequest);
    }
}
