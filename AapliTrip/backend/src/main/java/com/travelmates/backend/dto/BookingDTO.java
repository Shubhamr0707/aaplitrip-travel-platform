package com.travelmates.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingDTO {

    private String source;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("No_of_Person")
    private Integer noOfPersons;

    @JsonProperty("Mode")
    private String mode;

    @JsonProperty("Budget")
    private Double budget;

    @JsonProperty("dest_id")
    private Long destId;

    @JsonProperty("identity_proof")
    private String identityProof;
}
