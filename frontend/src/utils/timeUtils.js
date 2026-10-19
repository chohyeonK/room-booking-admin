// 09:00 부터 18:00 까지 30분 단위 슬롯 목록
export const TIME_SLOTS = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
];

// "HH:mm:ss" 또는 "HH:mm" -> 분 단위 숫자로 변환 (예: "09:30" -> 570)
export const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

// 특정 예약이 해당 회의실의 30분 슬롯 구간에 걸쳐 있는지 체크
export const isSlotReserved = (reservation, slotTime) => {
    if (reservation.status === 'CANCELLED') return false;

    const slotStart = timeToMinutes(slotTime);
    const slotEnd = slotStart + 30;
    const resStart = timeToMinutes(reservation.startTime);
    const resEnd = timeToMinutes(reservation.endTime);

    // 슬롯 구간과 예약 시간이 겹치는지 판단
    return resStart < slotEnd && resEnd > slotStart;
};