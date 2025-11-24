package com.dongguk.geohealth.geohelath.dto;

import com.dongguk.geohealth.geohelath.domain.PolicyProposal;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PolicyProposalDto {
    private Long id;
    private String title;
    private String description;
    private String category;

    // 추가된 필드
    private String region;
    private String proposer;
    private String status;
    private LocalDate createdAt;
    private Long targetPopulation;
    private String expectedImpact;
    private Long votes; // 총 투표 수 (agree + disagree)

    private Long agreeCount;
    private Long disagreeCount;

    public PolicyProposalDto(PolicyProposal entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.category = entity.getCategory();
        this.region = entity.getRegion();
        this.proposer = entity.getProposer();
        this.status = entity.getStatus();
        this.createdAt = entity.getCreatedAt();
        this.targetPopulation = entity.getTargetPopulation();
        this.expectedImpact = entity.getExpectedImpact();
        this.agreeCount = entity.getAgreeCount();
        this.disagreeCount = entity.getDisagreeCount();
        this.votes = entity.getAgreeCount() + entity.getDisagreeCount();
    }
}