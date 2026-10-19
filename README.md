# 🏢 Room Booking System (회의실 실시간 예약 시스템)

> 회의실별 실시간 타임라인 매트릭스를 제공하고, JPQL 기반 시간 교차 검증을 통해 예약 중복을 방지하는 풀스택 사내 회의실 예약 관리 웹 서비스입니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### Backend
- **Framework**: Java 17, Spring Boot 3.x
- **Data & ORM**: Spring Data JPA, H2 Database (In-Memory)
- **Validation & Query**: JPQL (Custom Overlapping Validation)
- **Test**: IntelliJ HTTP Client (test.http)

### Frontend
- **Framework & Build**: React 18, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client & Icons**: Axios, Lucide-React

---

## 📐 시스템 아키텍처 및 핵심 비즈니스 로직

### 1. 시간 중복 예약 방지 알고리즘 (JPQL Overlap Validation)
동일한 회의실에 대해 기존 예약 시간대와 신규 요청 시간대가 1분이라도 겹치는 경우 예약을 차단합니다.  
경계 시간대(예: 기존 11:30 종료 후 신규 11:30 시작)는 정상 허용되도록 등호(=)를 제외한 교차 검증식을 적용했습니다.

- **검증 조건**: `Existing.StartTime < New.EndTime AND Existing.EndTime > New.StartTime`

```java
@Query("SELECT COUNT(r) > 0 FROM Reservation r " +
       "WHERE r.room.id = :roomId " +
       "AND r.reservationDate = :reservationDate " +
       "AND r.status = 'CONFIRMED' " +
       "AND r.startTime < :endTime " +
       "AND r.endTime > :startTime")
boolean existsOverlappingReservation(
    @Param("roomId") Long roomId,
    @Param("reservationDate") LocalDate reservationDate,
    @Param("startTime") LocalTime startTime,
    @Param("endTime") LocalTime endTime
);
```

### 2. 이력 보존을 위한 소프트 딜리트 (Soft Delete)
예약 취소 시 DB 레코드를 물리적으로 삭제(`DELETE`)하지 않고, 엔티티의 상태 값을 `CANCELLED`로 변경하여 데이터 추적성을 보존합니다. 프론트엔드 조회 쿼리 시에는 `CONFIRMED` 상태의 데이터만 선별하여 그리드에 렌더링합니다.

---

## 🚀 구현 단계별 세부 사항 (Implementation Steps)

### Step 1. 도메인 모델링 및 기반 인프라 구축
- 회의실(`Room`), 사원(`Member`), 예약(`Reservation`) 간의 JPA 연관관계 매핑 (다대일 단방향/양방향 설계)
- 예약 상태 열거형(`ReservationStatus`: `CONFIRMED`, `CANCELLED`) 정의
- 애플리케이션 시작 시 초기 회의실 및 부서/사원 기초 데이터를 적재하는 `data.sql` 구성

### Step 2. 예약 코어 비즈니스 로직 및 REST API 구현
- 신규 예약 등록 API (`POST /api/reservations`)
  - 시작/종료 시간 역전 검증 및 JPQL 교차 검증을 통한 중복 예약 방지
- 예약 취소 API (`DELETE /api/reservations/{id}`)
  - 도메인 엔티티 내 `cancel()` 비즈니스 메서드를 통한 상태 전이(`CANCELLED`)
- IntelliJ HTTP Client(`test.http`)를 활용한 5단계 시나리오(조회, 등록, 중복 차단, 경계 시간 맞물림, 취소) 검증

### Step 3. 2차원 타임라인 그리드 UI 및 데이터 연동
- Vite + React + Tailwind CSS 기반 프론트엔드 아키텍처 셋업
- Zustand 기반 전역 상태 스토어(`useBookingStore`: `selectedDate`, `selectedRoomId`) 구축
- 09:00 ~ 18:00 (30분 단위) 2차원 매트릭스 타임라인 그리드 컴포넌트(`TimelineGrid`) 렌더링
- 가로 스크롤 시에도 회의실 메타정보(정원, 위치)를 식별할 수 있도록 좌측 열 고정(`sticky`) 적용
- Axios를 통한 회의실 목록 및 특정 일자 예약 현황 비동기 수신 및 인디고 블록 시각화

### Step 4. 모달 기반 예약 CRUD 완성 및 예외 피드백 처리
- 타임라인 내 빈 슬롯(`+`) 클릭 시 회의실 정보 및 시작/종료 시간이 자동 보정되는 예약 등록 모달 연동
- 백엔드 중복 검증 실패 시 사용자 친화적인 에러 배너 피드백 제공
- 등록된 블록 클릭 시 상세 팝업 오픈 및 예약 취소(`DELETE`) 연동
- `@CrossOrigin(origins = "http://localhost:5173")` 화이트리스트 지정을 통한 브라우저 보안 표준 준수

---

## 🔌 API 명세서 (API Specification)

| Method | Endpoint | Description | Request Body / Query | Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/rooms` | 전체 회의실 목록 조회 | None | `200 OK` |
| **GET** | `/api/reservations` | 특정 날짜 예약 현황 조회 | `?date=YYYY-MM-DD` | `200 OK` |
| **POST** | `/api/reservations` | 신규 회의실 예약 등록 | `roomId`, `memberId`, `reservationDate`, `startTime`, `endTime`, `purpose` | `201 Created` |
| **DELETE** | `/api/reservations/{id}` | 예약 취소 (소프트 딜리트) | None | `204 No Content` |

---

## 🖥️ 실행 가이드 (Getting Started)

### Backend (Spring Boot)
```bash
# 백엔드 루트 디렉터리
./gradlew bootRun
# 서버 구동: http://localhost:8080
# H2 콘솔 접근: http://localhost:8080/h2-console
```

### Frontend (React + Vite)
```bash
# frontend 디렉터리 이동
cd frontend

# 의존성 설치 및 개발 서버 실행
npm install
npm run dev
# 웹 접속: http://localhost:5173
```
