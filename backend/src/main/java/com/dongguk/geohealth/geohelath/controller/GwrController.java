package com.dongguk.geohealth.geohelath.controller;

import com.dongguk.geohealth.geohelath.dto.GwrCoefficientDto;
import com.dongguk.geohealth.geohelath.dto.MapCoefficientDto;
import com.dongguk.geohealth.geohelath.service.GwrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gwr")
public class GwrController {

    private final GwrService gwrService;

    /**
     * 특정 지역의 모든 GWR 계수 결과를 반환 (대시보드, 시뮬레이터용)
     */
    @GetMapping("/coefficients/{regionCode}")
    public ResponseEntity<List<GwrCoefficientDto>> getGwrCoefficientsByRegion(
            @PathVariable Long regionCode) {

        List<GwrCoefficientDto> coefficients = gwrService.getCoefficientsByRegion(regionCode);
        return ResponseEntity.ok(coefficients);
    }

    /**
     * 지도 시각화를 위한 전체 지역 계수 조회
     */
    @GetMapping("/coefficients/all")
    public ResponseEntity<List<MapCoefficientDto>> getAllCoefficients(
            @RequestParam String variable,
            @RequestParam String dependentVar) {

        List<MapCoefficientDto> dtos = gwrService.getAllCoefficients(variable, dependentVar);
        return ResponseEntity.ok(dtos);
    }
}
