import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, RefreshCw } from 'lucide-react';
import { useBookingStore } from './store/useBookingStore';
import TimelineGrid from './components/TimelineGrid';

export default function App() {
  const { selectedDate, setSelectedDate } = useBookingStore();
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. 회의실 전체 목록 조회 (GET /api/rooms)
  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('회의실 목록 조회 실패:', err);
    }
  };

  // 2. 특정 날짜 예약 현황 조회 (GET /api/reservations?date=...)
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/reservations?date=${selectedDate}`);
      setReservations(res.data);
    } catch (err) {
      console.error('예약 현황 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [selectedDate]);

  return (
      <div className="min-h-screen p-8 max-w-7xl mx-auto">
        {/* 헤더 및 컨트롤러 영역 */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              회의실 예약 관리 대시보드
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              09:00 ~ 18:00 회의실별 실시간 타임라인 현황
            </p>
          </div>

          {/* 날짜 선택 피커 및 새로고침 버튼 */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <Calendar className="text-slate-400 ml-2" size={18} />
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-none bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
            />
            <button
                onClick={fetchReservations}
                disabled={loading}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition disabled:opacity-50"
                title="새로고침"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* 타임라인 메인 그리드 */}
        <main>
          {rooms.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm">
                회의실 정보를 불러오는 중입니다...
              </div>
          ) : (
              <TimelineGrid rooms={rooms} reservations={reservations} />
          )}
        </main>
      </div>
  );
}