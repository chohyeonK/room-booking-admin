import React, { useState } from 'react';
import axios from 'axios';
import { X, Clock, Calendar, User, AlignLeft } from 'lucide-react';
import { TIME_SLOTS } from '../utils/timeUtils';

export default function ReservationCreateModal({
                                                   isOpen,
                                                   onClose,
                                                   room,
                                                   initialTime,
                                                   selectedDate,
                                                   onSuccess
                                               }) {
    if (!isOpen || !room) return null;

    const [memberId, setMemberId] = useState(1); // 1: 김초현, 2: 이영희, 3: 박민수
    const [startTime, setStartTime] = useState(initialTime || '09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [purpose, setPurpose] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // 시작/종료 시간 정합성 체크
        if (startTime >= endTime) {
            setErrorMessage('종료 시간은 시작 시간보다 이후여야 합니다.');
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.post('http://localhost:8080/api/reservations', {
                roomId: room.id,
                memberId: Number(memberId),
                reservationDate: selectedDate,
                startTime: `${startTime}:00`,
                endTime: `${endTime}:00`,
                purpose: purpose.trim() || '회의'
            });

            onSuccess(); // 목록 새로고침 및 닫기
            onClose();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage('해당 시간대에 이미 예약된 회의실이거나 등록에 실패했습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">회의실 예약하기</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errorMessage && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">회의실</label>
                        <input
                            type="text"
                            readOnly
                            value={`${room.name} (${room.capacity}인실 / ${room.location})`}
                            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">예약 일자</label>
                        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600">
                            <Calendar size={16} className="text-slate-400" />
                            <span>{selectedDate}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">예약자 (사원)</label>
                        <div className="relative">
                            <select
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={1}>김초현 (개발팀)</option>
                                <option value={2}>이영희 (기획팀)</option>
                                <option value={3}>박민수 (인사팀)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">시작 시간</label>
                            <select
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {TIME_SLOTS.slice(0, -1).map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">종료 시간</label>
                            <select
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {TIME_SLOTS.slice(1).map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">회의 목적</label>
                        <input
                            type="text"
                            required
                            placeholder="예: 백엔드 스프린트 리뷰"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                        >
                            {isSubmitting ? '예약 중...' : '예약 완료'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}