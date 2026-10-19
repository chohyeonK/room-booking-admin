package com.example.roombooking.repository;

import com.example.roombooking.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r " +
            "JOIN FETCH r.room " +
            "JOIN FETCH r.member " +
            "WHERE r.reservationDate = :date " +
            "ORDER BY r.startTime ASC")
    List<Reservation> findByReservationDateWithDetails(@Param("date") LocalDate date);
}