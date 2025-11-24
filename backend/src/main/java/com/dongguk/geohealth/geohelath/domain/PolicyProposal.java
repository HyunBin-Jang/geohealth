package com.dongguk.geohealth.geohelath.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "policy_proposal")
public class PolicyProposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // "exercise", "environment" 등

    // 💡 추가된 필드들
    @Column(nullable = false)
    private String region; // 예: "서울특별시 종로구"

    @Column(nullable = false)
    private String proposer; // 예: "김건강"

    @Column(nullable = false)
    private String status; // "active", "completed" 등

    @Column(nullable = false)
    private LocalDate createdAt; // 생성일

    @Column(nullable = false)
    private Long targetPopulation; // 대상 인구 수

    @Column(nullable = false)
    private String expectedImpact; // 예: "비만율 2.3% 감소 예상"

    // 투표 집계 (프론트엔드의 votes는 이 둘의 합으로 계산 가능)
    private Long agreeCount = 0L;
    private Long disagreeCount = 0L;

    // 생성자
    public PolicyProposal(String title, String description, String category, String region, String proposer, Long targetPopulation, String expectedImpact) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.region = region;
        this.proposer = proposer;
        this.targetPopulation = targetPopulation;
        this.expectedImpact = expectedImpact;
        this.status = "active";
        this.createdAt = LocalDate.now();
        this.agreeCount = 0L;
        this.disagreeCount = 0L;
    }
}