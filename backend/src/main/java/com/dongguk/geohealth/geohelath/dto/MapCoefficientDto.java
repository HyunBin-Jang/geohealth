package com.dongguk.geohealth.geohelath.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MapCoefficientDto {
    private String regionCode;
    private Double coefficient; // 선택된 변수의 계수
    private Double tValue;      // 선택된 변수의 T-Value
    private Double localR2;     // 해당 지역 모델의 R²
}