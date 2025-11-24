package com.dongguk.geohealth.geohelath.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "gwr_analysis_result", indexes = {
        // 데이터 정합성 핵심: 한 지역은 한 지표(indicator)에 대해 하나의 결과만 가질 수 있습니다.
        @Index(name = "idx_region_indicator", columnList = "region_code, indicator", unique = true)
})
public class GwrResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analysis_id")
    private Long id; // GWR 분석 결과 테이블의 고유 ID (PK)

    @Column(name = "indicator", nullable = false, length = 50)
    private String indicator; // 분석 지표 (DEPRESSION 또는 OBESITY)

    @Column(name = "raw_value")
    private Double rawValue; // 종속변수 값

    @Column(name = "local_r2")
    private Double localR2; // 국지적 R2 값

    // ----- 회귀 계수 (Coefficient) -----

    @Column(name = "intercept_coef")
    private Double interceptCoef;

    @Column(name = "jujum_coef")
    private Double jujumCoef;

    @Column(name = "pappu_coef")
    private Double pappuCoef;

    @Column(name = "gongwon_su_coef")
    private Double gongwonSuCoef;

    @Column(name = "gongwon_myeonjeok_coef")
    private Double gongwonMyeonjeokCoef;

    @Column(name = "traffic_coef")
    private Double trafficCoef;

    // ----- 신뢰성 지표 (Local T-Value) -----
    // 💡 Local T-Value (Local P-value 대체)

    @Column(name = "intercept_t_value")
    private Double interceptTValue;

    @Column(name = "jujum_t_value")
    private Double jujumTValue;

    @Column(name = "pappu_t_value")
    private Double pappuTValue;

    @Column(name = "gongwon_su_t_value")
    private Double gongwonSuTValue;

    @Column(name = "gongwon_myeonjeok_t_value")
    private Double gongwonMyeonjeokTValue;

    @Column(name = "traffic_t_value")
    private Double trafficTValue;

    // ----- 관계 설정 (GwrResult: N, Region: 1) -----

    // Region 엔터티의 region_code를 참조하는 외래 키
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_code", nullable = false) // FK 컬럼명 지정
    private Region region;
}