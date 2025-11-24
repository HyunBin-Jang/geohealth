package com.dongguk.geohealth.geohelath.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GwrCoefficientDto {
    private String regionCode;
    private String variable;      // 예: "주점업 수"
    private String dependentVar;  // 예: "obesity" 또는 "depression"
    private Double coefficient;   // 계수 (β)
    private Double tValue;        // Local T-Value (프론트엔드 호환성을 위해 pValue로 명명)
    private Double localR2;
}