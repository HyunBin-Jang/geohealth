package com.dongguk.geohealth.geohelath.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "region")
public class Region {

    // CSV 파일의 '코드' 컬럼을 기본 키(Primary Key)로 사용
    @Id
    @Column(name = "region_code") // DB 컬럼명: region_code
    private Long regionCode; // 지역 코드 (PK)

    @Column(name = "province", nullable = false, length = 50)
    private String province; // 시도

    @Column(name = "sigungu", nullable = false, length = 100)
    private String sigungu; // 시군구

    @Column(name = "population")
    private Long population;

    // 지도 시각화를 위한 WKT (Well-Known Text) 공간 정보
    @Column(name = "wkt_geometry", columnDefinition = "TEXT")
    private String wktGeometry;

    // ----- 관계 설정 (Region: 1, GwrResult: N) -----
    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<GwrResult> gwrResults;
}