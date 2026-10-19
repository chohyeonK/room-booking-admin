package com.example.roombooking.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false, length = 100)
    private String location;

    public Room(String name, Integer capacity, String location) {
        this.name = name;
        this.capacity = capacity;
        this.location = location;
    }
}