package com.example.roombooking.service;

import com.example.roombooking.dto.ReservationCreateRequestDto;
import com.example.roombooking.dto.ReservationResponseDto;
import com.example.roombooking.entity.Member;
import com.example.roombooking.entity.Reservation;
import com.example.roombooking.entity.Room;
import com.example.roombooking.repository.MemberRepository;
import com.example.roombooking.repository.ReservationRepository;
import com.example.roombooking.repository.RoomRepository;
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
    private final RoomRepository roomRepository;
    private final MemberRepository memberRepository;

    // 1. 특정 일자 예약 목록 조회
    public List<ReservationResponseDto> getReservationsByDate(LocalDate date) {
        return reservationRepository.findByReservationDateWithDetails(date)
                .stream()
                .map(ReservationResponseDto::new)
                .toList();
    }

    // 2. 신규 예약 등록 (중복 검증 포함)
    @Transactional
    public Long createReservation(ReservationCreateRequestDto requestDto) {
        // 기본 시작/종료 시간 검증
        if (!requestDto.getStartTime().isBefore(requestDto.getEndTime())) {
            throw new IllegalArgumentException("종료 시간은 시작 시간보다 뒤여야 합니다.");
        }

        // 중복 예약 여부 검증
        boolean isOverlapped = reservationRepository.existsOverlappingReservation(
                requestDto.getRoomId(),
                requestDto.getReservationDate(),
                requestDto.getStartTime(),
                requestDto.getEndTime()
        );

        if (isOverlapped) {
            throw new IllegalStateException("해당 시간대에 이미 예약된 회의실입니다.");
        }

        Room room = roomRepository.findById(requestDto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회의실입니다."));

        Member member = memberRepository.findById(requestDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사원입니다."));

        Reservation reservation = new Reservation(
                room,
                member,
                requestDto.getReservationDate(),
                requestDto.getStartTime(),
                requestDto.getEndTime(),
                requestDto.getPurpose()
        );

        return reservationRepository.save(reservation).getId();
    }

    // 3. 예약 취소
    @Transactional
    public void cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));
        reservation.cancel();
    }
}