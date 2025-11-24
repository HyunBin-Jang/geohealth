package com.dongguk.geohealth.geohelath.service;

import com.dongguk.geohealth.geohelath.domain.GwrResult;
import com.dongguk.geohealth.geohelath.dto.GwrCoefficientDto;
import com.dongguk.geohealth.geohelath.dto.MapCoefficientDto; // Import 추가
import com.dongguk.geohealth.geohelath.repository.GwrResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GwrService {

    private final GwrResultRepository gwrResultRepository;

    // 프론트엔드 변수명 -> DB 컬럼 매핑 (역방향 매핑 필요)
    // 예: "주점업 수" -> "jujum"
    private static final Map<String, String> variableToDbFieldMap = Map.of(
            "Intercept", "intercept",
            "주점업 수", "jujum",
            "패스트푸드점 수", "pappu",
            "공원 수", "gongwonSu",
            "공원 면적", "gongwonMyeonjeok",
            "대중교통 만족도", "traffic"
    );

    // DB 컬럼 -> 프론트엔드 변수명 매핑 (기존)
    private static final Map<String, String> friendlyNameMap = Map.of(
            "intercept", "Intercept",
            "jujum", "주점업 수",
            "pappu", "패스트푸드점 수",
            "gongwonSu", "공원 수",
            "gongwonMyeonjeok", "공원 면적",
            "traffic", "대중교통 만족도"
    );

    // ... (기존 getCoefficientsByRegion 메서드 유지) ...
    public List<GwrCoefficientDto> getCoefficientsByRegion(Long regionCode) {
        // (기존 코드 생략 - 동일함)
        List<GwrResult> results = gwrResultRepository.findByRegionRegionCode(regionCode);
        if (results.isEmpty()) {
            throw new RuntimeException("Region not found: " + regionCode);
        }
        List<GwrCoefficientDto> dtos = new ArrayList<>();
        String regionCodeStr = regionCode.toString();

        for (GwrResult res : results) {
            String dependentVar = res.getIndicator().equalsIgnoreCase("OBESITY") ? "obesity" : "depression";
            dtos.add(createDto(regionCodeStr, friendlyNameMap.get("intercept"), dependentVar, res.getInterceptCoef(), res.getInterceptTValue(), res.getLocalR2()));
            dtos.add(createDto(regionCodeStr, friendlyNameMap.get("jujum"), dependentVar, res.getJujumCoef(), res.getJujumTValue(), res.getLocalR2()));
            dtos.add(createDto(regionCodeStr, friendlyNameMap.get("pappu"), dependentVar, res.getPappuCoef(), res.getPappuTValue(), res.getLocalR2()));
            dtos.add(createDto(regionCodeStr, friendlyNameMap.get("gongwonSu"), dependentVar, res.getGongwonSuCoef(), res.getGongwonSuTValue(), res.getLocalR2()));
            dtos.add(createDto(regionCodeStr, friendlyNameMap.get("gongwonMyeonjeok"), dependentVar, res.getGongwonMyeonjeokCoef(), res.getGongwonMyeonjeokTValue(), res.getLocalR2()));
            dtos.add(createDto(regionCodeStr, friendlyNameMap.get("traffic"), dependentVar, res.getTrafficCoef(), res.getTrafficTValue(), res.getLocalR2()));
        }
        return dtos;
    }

    // 💡 추가된 메서드: 지도 시각화를 위한 전체 데이터 조회
    public List<MapCoefficientDto> getAllCoefficients(String variableName, String dependentVar) {
        // 1. 요청된 종속변수(indicator)에 맞는 데이터만 DB에서 전체 조회
        String indicator = dependentVar.equalsIgnoreCase("obesity") ? "OBESITY" : "DEPRESSION";
        List<GwrResult> results = gwrResultRepository.findAllByIndicator(indicator);

        // 2. 요청된 독립변수(variableName)에 해당하는 필드명 찾기
        String dbField = variableToDbFieldMap.get(variableName);
        if (dbField == null) {
            throw new IllegalArgumentException("Unknown variable name: " + variableName);
        }

        // 3. 각 지역 결과에서 해당 변수의 계수와 T-Value 추출하여 DTO 변환
        return results.stream()
                .map(res -> {
                    Double coef = 0.0;
                    Double tVal = 0.0;

                    // 변수명에 따라 getter 메서드 선택 (Switch문 활용)
                    switch (dbField) {
                        case "intercept":
                            coef = res.getInterceptCoef();
                            tVal = res.getInterceptTValue();
                            break;
                        case "jujum":
                            coef = res.getJujumCoef();
                            tVal = res.getJujumTValue();
                            break;
                        case "pappu":
                            coef = res.getPappuCoef();
                            tVal = res.getPappuTValue();
                            break;
                        case "gongwonSu":
                            coef = res.getGongwonSuCoef();
                            tVal = res.getGongwonSuTValue();
                            break;
                        case "gongwonMyeonjeok":
                            coef = res.getGongwonMyeonjeokCoef();
                            tVal = res.getGongwonMyeonjeokTValue();
                            break;
                        case "traffic":
                            coef = res.getTrafficCoef();
                            tVal = res.getTrafficTValue();
                            break;
                    }

                    // null 처리 (데이터가 없는 경우 0)
                    if (coef == null) coef = 0.0;
                    if (tVal == null) tVal = 0.0;

                    return MapCoefficientDto.builder()
                            .regionCode(String.valueOf(res.getRegion().getRegionCode()))
                            .coefficient(coef)
                            .tValue(tVal)
                            .localR2(res.getLocalR2())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private GwrCoefficientDto createDto(String regionCode, String variable, String dependentVar,
                                        Double coef, Double tValue, Double localR2) {
        return GwrCoefficientDto.builder()
                .regionCode(regionCode)
                .variable(variable)
                .dependentVar(dependentVar)
                .coefficient(coef)
                .tValue(tValue)
                .localR2(localR2)
                .build();
    }
}