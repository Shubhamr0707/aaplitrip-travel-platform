package com.travelmates.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TripVariantDTO {
    private Long id;

    @JsonProperty("source_city")
    private String sourceCity;

    @JsonProperty("travel_mode")
    private String travelMode;

    @JsonProperty("route_description")
    private String routeDescription;

    private Double price;

    private String duration;
}
