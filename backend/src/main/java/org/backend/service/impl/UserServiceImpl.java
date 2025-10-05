package org.backend.service.impl;

import org.backend.A_general.base.service.impl.BaseServiceImpl;
import org.backend.A_general.base.utils.ValidationUtils;
import org.backend.dto.request.UserRequest;
import org.backend.dto.request.auth.VerificationCodeVerifyRequest;
import org.backend.entity.User;
import org.backend.entity.enums.UserRole;
import org.backend.entity.enums.VerificationCodeType;
import org.backend.repository.UserRepository;
import org.backend.service.UserService;
import org.backend.service.VerificationCodeService;
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
        // 使用BaseServiceImpl中的save方法
        return save(user);
    }

    @Override
    public UserRequest getUserDTOById(Long id) {
        // 使用findByIdAndNotDeleted确保只获取未删除的用户
        User user = findByIdAndNotDeleted(id)
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
        // 使用findByIdAndNotDeleted确保只获取未删除的用户
        return findByIdAndNotDeleted(id);
    }

    @Override
    public User findByPhone(String phone) {
        // 使用通用工具类ValidationUtils进行手机号验证
        if (!ValidationUtils.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        // 先通过手机号查找用户，然后确保用户未被删除
        return repository.findByPhone(phone)
                .filter(user -> user.getDeleted() == null || user.getDeleted() == 0)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    @Override
    public User findByPhoneAndRole(String phone, UserRole role) {
        // 使用通用工具类ValidationUtils进行手机号验证
        if (!ValidationUtils.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        // 先通过手机号和角色查找用户，然后确保用户未被删除
        return repository.findByPhoneAndRole(phone, role)
                .filter(user -> user.getDeleted() == null || user.getDeleted() == 0)
                .orElseThrow(() -> new RuntimeException("该角色用户不存在"));
    }

    @Override
    public boolean existsByPhone(String phone) {
        // 使用通用工具类ValidationUtils进行手机号验证
        if (!ValidationUtils.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        // 检查手机号是否存在且用户未被删除
        Optional<User> userOptional = repository.findByPhone(phone);
        return userOptional.isPresent() && (userOptional.get().getDeleted() == null || userOptional.get().getDeleted() == 0);
    }

    @Override
    public boolean existsByPhoneAndRole(String phone, UserRole role) {
        // 使用通用工具类ValidationUtils进行手机号验证
        if (!ValidationUtils.isValidPhone(phone)) {
            throw new RuntimeException("手机号格式不正确");
        }
        // 检查手机号和角色是否存在且用户未被删除
        Optional<User> userOptional = repository.findByPhoneAndRole(phone, role);
        return userOptional.isPresent() && (userOptional.get().getDeleted() == null || userOptional.get().getDeleted() == 0);
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
