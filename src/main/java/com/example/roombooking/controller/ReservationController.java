package com.example.roombooking.controller;

import com.example.roombooking.dto.ReservationResponseDto;
import com.example.roombooking.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public List<ReservationResponseDto> getReservations(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return reservationService.getReservationsByDate(date);
    }
}