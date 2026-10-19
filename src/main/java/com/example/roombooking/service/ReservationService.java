package com.example.roombooking.service;

import com.example.roombooking.dto.ReservationResponseDto;
import com.example.roombooking.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public List<ReservationResponseDto> getReservationsByDate(LocalDate date) {
        return reservationRepository.findByReservationDateWithDetails(date)
                .stream()
                .map(ReservationResponseDto::new)
                .toList();
    }
}