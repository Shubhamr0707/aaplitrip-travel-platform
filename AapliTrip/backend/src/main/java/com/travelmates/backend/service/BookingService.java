package com.travelmates.backend.service;

import com.travelmates.backend.dto.BookingDTO;
import com.travelmates.backend.entity.Booking;
import com.travelmates.backend.entity.Destination;
import com.travelmates.backend.entity.User;
import com.travelmates.backend.repository.BookingRepository;
import com.travelmates.backend.repository.DestinationRepository;
import com.travelmates.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    private final java.nio.file.Path rootLocation = java.nio.file.Paths.get("uploads");

    public String bookTrip(Long userId, BookingDTO bookingDTO, org.springframework.web.multipart.MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Destination destination = destinationRepository.findById(bookingDTO.getDestId())
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setDestination(destination);
        booking.setSource(bookingDTO.getSource());
        booking.setStartDate(bookingDTO.getStartDate());
        booking.setEndDate(bookingDTO.getEndDate());
        booking.setNoOfPersons(bookingDTO.getNoOfPersons());
        booking.setMode(bookingDTO.getMode());
        booking.setBudget(bookingDTO.getBudget());
        booking.setBookingStatus(Booking.BookingStatus.PENDING);

        // Handle File Upload
        if (file != null && !file.isEmpty()) {
            try {
                java.nio.file.Files.createDirectories(rootLocation);
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                java.nio.file.Files.copy(file.getInputStream(), rootLocation.resolve(fileName));
                booking.setIdentityProof(fileName);
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
            }
        }

        bookingRepository.save(booking);
        return "Enquiry Sent Successfully. We will verify your details.";
    }

    public List<com.travelmates.backend.dto.BookingResponseDTO> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUser(user).stream().map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<com.travelmates.backend.dto.BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingIdDesc().stream().map(this::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    public String updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        try {
            booking.setBookingStatus(Booking.BookingStatus.valueOf(status.toUpperCase()));
            bookingRepository.save(booking);
            return "Booking status updated to " + status;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    public String confirmBookingPayment(Long bookingId, String transactionId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getBookingStatus() == Booking.BookingStatus.APPROVED) {
            booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);
            booking.setTransactionId(transactionId);
            bookingRepository.save(booking);
            return "Payment Successful! Booking Confirmed.";
        } else {
            throw new RuntimeException("Booking is not approved for payment.");
        }
    }

    private com.travelmates.backend.dto.BookingResponseDTO convertToDTO(Booking booking) {
        com.travelmates.backend.dto.BookingResponseDTO dto = new com.travelmates.backend.dto.BookingResponseDTO();
        dto.setBookingId(booking.getBookingId());
        if (booking.getDestination() != null) {
            dto.setDestinationName(booking.getDestination().getDestination_name());
            dto.setImgPath(booking.getDestination().getImgPath());
        }
        dto.setSource(booking.getSource());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setNoOfPersons(booking.getNoOfPersons());
        dto.setMode(booking.getMode());
        dto.setBudget(booking.getBudget());
        dto.setStatus(booking.getBookingStatus() != null ? booking.getBookingStatus().name() : "PENDING");
        if (booking.getUser() != null) {
            dto.setUserName(booking.getUser().getName());
        }
        dto.setIdentityProof(booking.getIdentityProof());
        dto.setTransactionId(booking.getTransactionId());
        return dto;
    }
}
