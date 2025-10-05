package org.backend.service;

import org.backend.A_general.base.service.BaseService;
import org.backend.dto.request.UserRequest;
import org.backend.entity.User;
import org.backend.entity.enums.UserRole;
import org.backend.entity.enums.VerificationCodeType;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface UserService extends BaseService<User, Long> {

    /**
     * 根据关键词搜索用户
     */
    Page<User> searchUsers(String keyword, int pageNum, int pageSize);

    /**
     * 根据角色和最低评分分页查找用户
     */
    Page<User> findUsersByRoleAndMinRating(UserRole role, Double minRating, int pageNum, int pageSize);

    /**
     * 根据ID获取用户信息
     */
    UserRequest getUserDTOById(Long id);

    /**
     * 保存用户
     */
    User saveUser(User user);

    /**
     * 根据ID获取用户
     */
    Optional<User> getUserById(Long id);

    /**
     * 根据手机号查找用户
     */
    User findByPhone(String phone);

    /**
     * 根据手机号和角色查找用户
     */
    User findByPhoneAndRole(String phone, UserRole role);

    /**
     * 检查手机号是否存在
     */
    boolean existsByPhone(String phone);

    /**
     * 检查手机号和角色的组合是否存在
     */
    boolean existsByPhoneAndRole(String phone, UserRole role);

    /**
     * 验证验证码
     */
    boolean verifyCode(String phone, String verificationCode, VerificationCodeType verificationCodeType);
}