package com.dongguk.geohealth.geohelath.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 💡 "/api/**" 경로에 대해서만
                .allowedOrigins("http://localhost:3000",
                        "http://geohealth-demo.s3-website.ap-northeast-2.amazonaws.com") // 💡 React 서버 주소 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}