package com.dongguk.geohealth.geohelath.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PolicyProposalRequestDto {
    private String title;
    private String description;
    private String category; // "exercise", "environment", "diet"
    private String region;
    private String proposer;
    private Long targetPopulation;
    private String expectedImpact;
}