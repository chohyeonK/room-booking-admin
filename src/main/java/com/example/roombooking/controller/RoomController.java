package com.example.roombooking.controller;

import com.example.roombooking.entity.Room;
import com.example.roombooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 프론트엔드 로컬 연동 대비 CORS 허용
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public List<Room> getRooms() {
        return roomService.getAllRooms();
    }
}