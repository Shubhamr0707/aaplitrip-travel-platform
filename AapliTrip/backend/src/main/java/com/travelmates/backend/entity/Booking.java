package com.travelmates.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private String source;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer noOfPersons;

    private String mode;

    private Double budget;

    private String identityProof;

    private String transactionId;

    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "dest_id")
    private Destination destination;

    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CONFIRMED, CANCELLED
    }
}
