package com.dongguk.geohealth.geohelath.service;

import com.dongguk.geohealth.geohelath.domain.PolicyProposal;
import com.dongguk.geohealth.geohelath.dto.PolicyProposalDto;
import com.dongguk.geohealth.geohelath.dto.PolicyProposalRequestDto; // Import 추가
import com.dongguk.geohealth.geohelath.repository.PolicyProposalRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PolicyProposalService {

    private final PolicyProposalRepository policyProposalRepository;

    public List<PolicyProposalDto> getAllProposals() {
        return policyProposalRepository.findAll().stream()
                .map(PolicyProposalDto::new)
                .collect(Collectors.toList());
    }

    // 💡 추가된 메서드: 정책 제안 생성
    @Transactional
    public PolicyProposalDto createProposal(PolicyProposalRequestDto requestDto) {
        PolicyProposal proposal = new PolicyProposal(
                requestDto.getTitle(),
                requestDto.getDescription(),
                requestDto.getCategory(),
                requestDto.getRegion(),
                requestDto.getProposer(),
                requestDto.getTargetPopulation(),
                requestDto.getExpectedImpact()
        );

        PolicyProposal savedProposal = policyProposalRepository.save(proposal);
        return new PolicyProposalDto(savedProposal);
    }

    @Transactional
    public PolicyProposalDto voteOnProposal(Long proposalId, String voteType) {
        PolicyProposal proposal = policyProposalRepository.findById(proposalId)
                .orElseThrow(() -> new EntityNotFoundException("Proposal not found"));

        if ("AGREE".equalsIgnoreCase(voteType)) {
            proposal.setAgreeCount(proposal.getAgreeCount() + 1);
        } else if ("DISAGREE".equalsIgnoreCase(voteType)) {
            proposal.setDisagreeCount(proposal.getDisagreeCount() + 1);
        } else {
            throw new IllegalArgumentException("Invalid vote type");
        }

        return new PolicyProposalDto(proposal);
    }

    @Transactional
    public void addSampleProposals() {
        if (policyProposalRepository.count() == 0) {
            // (기존 샘플 데이터 로직 유지)
            PolicyProposal p1 = new PolicyProposal(
                    "동네 곳곳에 무료 야외 운동기구 설치",
                    "공원과 아파트 단지 내 무료로 이용할 수 있는 야외 운동기구를 설치하여 주민들의 운동 접근성을 높이고 비만율을 감소시키는 정책입니다.",
                    "exercise",
                    "서울특별시 종로구",
                    "김건강",
                    15000L,
                    "비만율 2.3% 감소 예상"
            );
            p1.setAgreeCount(120L);
            p1.setDisagreeCount(127L);
            policyProposalRepository.save(p1);

            PolicyProposal p2 = new PolicyProposal(
                    "심야 시간 주점업 영업 제한 및 가로등 확충",
                    "주거 지역 내 주점업 영업 시간을 조정하고 가로등을 확충하여 음주로 인한 소란을 줄이고 시민들의 심리적 안정감을 높입니다.",
                    "environment",
                    "강원도 강릉시",
                    "박안심",
                    8500L,
                    "우울감 경험률 1.5% 감소 예상"
            );
            p2.setAgreeCount(85L);
            p2.setDisagreeCount(15L);
            policyProposalRepository.save(p2);
        }
    }
}