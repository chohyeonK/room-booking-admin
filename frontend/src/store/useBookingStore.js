import { create } from 'zustand';

export const useBookingStore = create((set) => ({
    // 기본 날짜: 2026-10-19 (테스트 데이터가 있는 날짜)
    selectedDate: '2026-10-19',
    selectedRoomId: null,

    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedRoomId: (roomId) => set({ selectedRoomId: roomId }),
}));