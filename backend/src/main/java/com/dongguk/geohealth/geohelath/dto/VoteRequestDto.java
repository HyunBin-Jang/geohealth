package com.dongguk.geohealth.geohelath.dto;

import lombok.Data;

@Data
public class VoteRequestDto {
    // "AGREE" 또는 "DISAGREE"
    private String voteType;
}
