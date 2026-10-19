package com.example.roombooking.repository;

import com.example.roombooking.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r " +
            "JOIN FETCH r.room " +
            "JOIN FETCH r.member " +
            "WHERE r.reservationDate = :date " +
            "ORDER BY r.startTime ASC")
    List<Reservation> findByReservationDateWithDetails(@Param("date") LocalDate date);

    // 같은 방, 같은 날짜에 취소되지 않은 예약 중 시간이 겹치는지 체크
    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
            "WHERE r.room.id = :roomId " +
            "AND r.reservationDate = :date " +
            "AND r.status = 'CONFIRMED' " +
            "AND r.startTime < :endTime " +
            "AND r.endTime > :startTime")
    boolean existsOverlappingReservation(
            @Param("roomId") Long roomId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}