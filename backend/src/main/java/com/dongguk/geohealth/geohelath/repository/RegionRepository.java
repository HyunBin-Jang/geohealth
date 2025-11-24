package com.dongguk.geohealth.geohelath.repository;

import com.dongguk.geohealth.geohelath.domain.Region;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends JpaRepository<Region, Long> {
    // regionCode(PK)를 사용하여 지역을 조회하는 기본 메서드가 제공됨
}
