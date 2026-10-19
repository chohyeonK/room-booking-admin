import React, { useState } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, MapPin, User, Trash2 } from 'lucide-react';

export default function ReservationDetailModal({
                                                   isOpen,
                                                   onClose,
                                                   reservation,
                                                   onSuccess
                                               }) {
    if (!isOpen || !reservation) return null;

    const [isDeleting, setIsDeleting] = useState(false);

    const handleCancel = async () => {
        if (!window.confirm('정말 이 예약을 취소하시겠습니까?')) return;

        try {
            setIsDeleting(true);
            await axios.delete(`http://localhost:8080/api/reservations/${reservation.id}`);
            onSuccess();
            onClose();
        } catch (err) {
            alert('예약 취소 처리에 실패했습니다.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">예약 상세 정보</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 text-sm">
                    <div>
                        <div className="text-xs font-semibold text-slate-400">회의 목적</div>
                        <div className="text-base font-bold text-slate-800 mt-0.5">{reservation.purpose}</div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-slate-600">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-500" />
                            <span>{reservation.roomName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-500" />
                            <span>{reservation.reservationDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-500" />
                            <span>{reservation.startTime.slice(0, 5)} ~ {reservation.endTime.slice(0, 5)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-indigo-500" />
                            <span>{reservation.memberName} ({reservation.department})</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition"
                        >
                            닫기
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isDeleting}
                            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            {isDeleting ? '취소 중...' : '예약 취소'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}