package com.travelmates.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingResponseDTO {

    @JsonProperty("trip_id")
    private Long bookingId;

    @JsonProperty("destination")
    private String destinationName;

    @JsonProperty("Imgpath")
    private String imgPath;

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

    @JsonProperty("user_name")
    private String userName;

    private String status;

    @JsonProperty("identity_proof")
    private String identityProof;

    @JsonProperty("transaction_id")
    private String transactionId;
}
