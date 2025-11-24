package com.dongguk.geohealth.geohelath.controller;

import com.dongguk.geohealth.geohelath.dto.PolicyProposalDto;
import com.dongguk.geohealth.geohelath.dto.PolicyProposalRequestDto; // Import 추가
import com.dongguk.geohealth.geohelath.dto.VoteRequestDto;
import com.dongguk.geohealth.geohelath.service.PolicyProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/proposals")
public class PolicyProposalController {

    private final PolicyProposalService policyProposalService;

    @GetMapping
    public ResponseEntity<List<PolicyProposalDto>> getAllProposals() {
        return ResponseEntity.ok(policyProposalService.getAllProposals());
    }

    @PostMapping
    public ResponseEntity<PolicyProposalDto> createProposal(@RequestBody PolicyProposalRequestDto requestDto) {
        PolicyProposalDto createdProposal = policyProposalService.createProposal(requestDto);
        return ResponseEntity.ok(createdProposal);
    }

    @PostMapping("/{proposalId}/vote")
    public ResponseEntity<PolicyProposalDto> vote(
            @PathVariable Long proposalId,
            @RequestBody VoteRequestDto voteRequest) {

        PolicyProposalDto updatedProposal = policyProposalService.voteOnProposal(
                proposalId,
                voteRequest.getVoteType()
        );
        return ResponseEntity.ok(updatedProposal);
    }
}