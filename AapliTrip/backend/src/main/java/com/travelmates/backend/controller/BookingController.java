package com.travelmates.backend.controller;

import com.travelmates.backend.dto.BookingDTO;
import com.travelmates.backend.entity.Booking;
import com.travelmates.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping(value = "/bookMyTrip/{userId}", consumes = { "multipart/form-data" })
    public ResponseEntity<Map<String, String>> bookTrip(
            @PathVariable Long userId,
            @ModelAttribute BookingDTO bookingDTO,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        String message = bookingService.bookTrip(userId, bookingDTO, file);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/MyTrip/{userId}")
    public ResponseEntity<List<com.travelmates.backend.dto.BookingResponseDTO>> getUserBookings(
            @PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<List<com.travelmates.backend.dto.BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/admin/bookings/{bookingId}/{status}")
    public ResponseEntity<Map<String, String>> updateBookingStatus(
            @PathVariable Long bookingId,
            @PathVariable String status) {
        String message = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PutMapping("/bookings/{bookingId}/pay")
    public ResponseEntity<String> confirmPayment(@PathVariable Long bookingId,
            @RequestBody Map<String, String> payload) {
        String transactionId = payload.get("transactionId");
        return ResponseEntity.ok(bookingService.confirmBookingPayment(bookingId, transactionId));
    }
}
