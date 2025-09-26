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

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

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
