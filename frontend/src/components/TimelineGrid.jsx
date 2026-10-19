import React from 'react';
import { TIME_SLOTS, isSlotReserved } from '../utils/timeUtils';
import { Users, MapPin } from 'lucide-react';

export default function TimelineGrid({
                                         rooms,
                                         reservations,
                                         onOpenCreate,
                                         onOpenDetail
                                     }) {
    const displaySlots = TIME_SLOTS.slice(0, -1);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                        <th className="p-4 text-left min-w-[200px] w-60 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                            회의실
                        </th>
                        {displaySlots.map((slot) => (
                            <th key={slot} className="py-3 px-2 text-center min-w-[72px] border-r border-slate-100 font-medium">
                                {slot}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {rooms.map((room) => {
                        const roomReservations = reservations.filter(
                            (r) => r.roomId === room.id && r.status === 'CONFIRMED'
                        );

                        return (
                            <tr key={room.id} className="hover:bg-slate-50/50 transition">
                                <td className="p-4 sticky left-0 bg-white z-10 border-r border-slate-200 shadow-sm whitespace-nowrap">
                                    <div className="font-semibold text-slate-800 text-sm">{room.name}</div>
                                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Users size={13} /> {room.capacity}인실
                      </span>
                                        <span className="flex items-center gap-1">
                        <MapPin size={13} /> {room.location}
                      </span>
                                    </div>
                                </td>

                                {displaySlots.map((slot) => {
                                    const activeReservation = roomReservations.find((r) =>
                                        isSlotReserved(r, slot)
                                    );

                                    return (
                                        <td
                                            key={slot}
                                            className={`p-1 border-r border-slate-100 text-center relative h-16 ${
                                                activeReservation ? 'bg-indigo-50/60' : 'bg-transparent'
                                            }`}
                                        >
                                            {activeReservation ? (
                                                <div
                                                    onClick={() => onOpenDetail(activeReservation)}
                                                    className="h-full w-full rounded bg-indigo-600 text-white flex flex-col justify-center items-center px-1 text-[11px] shadow-sm leading-tight transition hover:bg-indigo-700 cursor-pointer"
                                                    title="클릭하여 상세 조회 및 취소"
                                                >
                            <span className="font-medium truncate w-full">
                              {activeReservation.purpose}
                            </span>
                                                    <span className="text-[10px] text-indigo-200 truncate w-full">
                              {activeReservation.memberName}
                            </span>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => onOpenCreate(room, slot)}
                                                    className="h-full w-full rounded hover:bg-slate-100/70 transition cursor-pointer flex items-center justify-center text-xs text-slate-300 hover:text-indigo-600"
                                                    title={`${room.name} ${slot} 예약하기`}
                                                >
                                                    +
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}