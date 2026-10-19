package com.example.roombooking.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@NoArgsConstructor
public class ReservationCreateRequestDto {

    private Long roomId;
    private Long memberId;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;

    public ReservationCreateRequestDto(Long roomId, Long memberId, LocalDate reservationDate,
                                       LocalTime startTime, LocalTime endTime, String purpose) {
        this.roomId = roomId;
        this.memberId = memberId;
        this.reservationDate = reservationDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
    }
}