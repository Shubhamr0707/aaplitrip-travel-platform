package com.travelmates.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "trip_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TripVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonProperty("source_city")
    private String sourceCity;

    @com.fasterxml.jackson.annotation.JsonProperty("travel_mode")
    private String travelMode; // e.g., "Flight", "Train", "Bus"

    @Column(length = 1000)
    @com.fasterxml.jackson.annotation.JsonProperty("route_description")
    private String routeDescription;

    private Double price;

    private String duration; // e.g., "5 Days / 4 Nights"

    @ManyToOne
    @JoinColumn(name = "dest_id")
    @JsonBackReference
    private Destination destination;
}
