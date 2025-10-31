package com.dongguk.geohealth.geohelath.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class DevelopmentSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 모든 요청에 대해 인증 없이 접근 허용
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                // 개발 중 편리성을 위해 CSRF 보호 비활성화 (선택 사항)
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
