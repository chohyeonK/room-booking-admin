package com.example.roombooking.dto;

import com.example.roombooking.entity.Reservation;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class ReservationResponseDto {

    private final Long id;
    private final Long roomId;
    private final String roomName;
    private final Long memberId;
    private final String memberName;
    private final String department;
    private final LocalDate reservationDate;
    private final LocalTime startTime;
    private final LocalTime endTime;
    private final String purpose;
    private final String status;

    public ReservationResponseDto(Reservation reservation) {
        this.id = reservation.getId();
        this.roomId = reservation.getRoom().getId();
        this.roomName = reservation.getRoom().getName();
        this.memberId = reservation.getMember().getId();
        this.memberName = reservation.getMember().getName();
        this.department = reservation.getMember().getDepartment();
        this.reservationDate = reservation.getReservationDate();
        this.startTime = reservation.getStartTime();
        this.endTime = reservation.getEndTime();
        this.purpose = reservation.getPurpose();
        this.status = reservation.getStatus();
    }
}