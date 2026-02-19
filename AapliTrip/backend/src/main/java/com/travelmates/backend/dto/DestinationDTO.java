package com.travelmates.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DestinationDTO {

    private Long dest_id;

    private String destination_name;

    private String description;

    @JsonProperty("Price")
    private String price;

    @JsonProperty("Imgpath")
    private String imgPath;

    @JsonProperty("country")
    private String country;

    @JsonProperty("start_date")
    private LocalDate startDate;

    @JsonProperty("end_date")
    private LocalDate endDate;

    @JsonProperty("route")
    private String route;

    @JsonProperty("exposure")
    private String exposure;

    @JsonProperty("variants")
    private List<TripVariantDTO> variants;

    @JsonProperty("Country")
    public String getCountryCapitalized() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
