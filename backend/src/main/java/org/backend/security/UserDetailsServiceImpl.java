package org.backend.security;

import org.backend.entity.User;
import org.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * 用户详情服务实现类
 * 用于加载用户详细信息，供Spring Security进行身份验证和授权
 * <p>
 * 该类实现了UserDetailsService接口，支持通过用户ID或手机号加载用户信息。
 * 主要用于JWT认证过程中验证用户身份并获取用户权限信息。
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 根据用户名加载用户详细信息
     * <p>
     * 该方法支持两种方式查找用户：
     * 1. 通过用户ID查找（优先）
     * 2. 通过手机号查找（兼容处理）
     *
     * @param userId 用户ID或手机号
     * @return UserDetails对象，包含用户认证和授权信息
     * @throws UsernameNotFoundException 当用户未找到时抛出此异常
     */
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        try {
            // 尝试将传入的参数解析为用户ID
            Long id = Long.parseLong(userId);
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("用户未找到: " + userId));

            return new org.springframework.security.core.userdetails.User(
                    String.valueOf(user.getId()), // 使用userId作为用户名
                    user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        } catch (NumberFormatException e) {
            // 如果解析失败，说明可能是传入的是phone，进行兼容处理
            User user = userRepository.findByPhone(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("用户未找到: " + userId));

            return new org.springframework.security.core.userdetails.User(
                    String.valueOf(user.getId()), // 使用userId作为用户名
                    user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
        }
    }
}