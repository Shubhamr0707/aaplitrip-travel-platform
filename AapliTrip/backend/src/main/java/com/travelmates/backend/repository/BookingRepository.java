package com.travelmates.backend.repository;

import com.travelmates.backend.entity.Booking;
import com.travelmates.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);

    List<Booking> findAllByOrderByBookingIdDesc();
}
