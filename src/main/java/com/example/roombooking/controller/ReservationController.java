package com.example.roombooking.controller;

import com.example.roombooking.dto.ReservationCreateRequestDto;
import com.example.roombooking.dto.ReservationResponseDto;
import com.example.roombooking.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 브라우저 CORS 허용
public class ReservationController {

    private final ReservationService reservationService;

    // 1. 특정 날짜 예약 목록 조회
    @GetMapping
    public List<ReservationResponseDto> getReservations(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return reservationService.getReservationsByDate(date);
    }

    // 2. 예약 등록 (POST)
    @PostMapping
    public ResponseEntity<Long> createReservation(@RequestBody ReservationCreateRequestDto requestDto) {
        Long createdId = reservationService.createReservation(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdId);
    }

    // 3. 예약 취소 (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable("id") Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }
}