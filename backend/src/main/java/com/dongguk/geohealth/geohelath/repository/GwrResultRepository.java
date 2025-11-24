package com.dongguk.geohealth.geohelath.repository;

import com.dongguk.geohealth.geohelath.domain.GwrResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GwrResultRepository extends JpaRepository<GwrResult, Long> {
    List<GwrResult> findByRegionRegionCode(Long regionCode);

    // 특정 지표(OBESITY/DEPRESSION)의 모든 결과 조회
    List<GwrResult> findAllByIndicator(String indicator);
}
