package com.travelmates.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dest_id;

    private String destination_name;

    @Column(length = 1000)
    private String description;

    @com.fasterxml.jackson.annotation.JsonProperty("Price")
    private String price;

    @com.fasterxml.jackson.annotation.JsonProperty("Imgpath")
    private String imgPath;

    @com.fasterxml.jackson.annotation.JsonProperty("Country")
    private String country;

    // New fields for hardcoded trip details
    private LocalDate startDate;
    private LocalDate endDate;
    private String route;
    private String exposure;

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private java.util.List<TripVariant> variants = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.util.List<Booking> bookings = new java.util.ArrayList<>();
}
