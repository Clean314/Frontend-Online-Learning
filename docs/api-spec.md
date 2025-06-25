# 📚 API 명세서

본 문서는 `src/api` 하위의 모든 API 함수와 엔드포인트, 파라미터, 응답, 타입, 설명을 정리한 명세서입니다.  
(각 API의 파라미터/응답 타입은 실제 코드의 JSDoc 타입 정의를 참고하세요.)

---

## 공통 설정

- **Base URL**: `http://localhost:8989`
- **인증**: `/auth/*`를 제외한 모든 요청에 `Authorization: Bearer <token>` 헤더 자동 첨부 (src/api/axios.js 참고)
- **Content-Type**: `application/json`

---

## 목차

1. [auth.js (인증/회원)](#authjs)
2. [admin.js (관리자)](#adminjs)
3. [course.js (강의)](#coursejs)
4. [dashboard.js (대시보드)](#dashboardjs)
5. [enrollment.js (수강/신청)](#enrollmentjs)
6. [exam.js (시험)](#examjs)
7. [lecture.js (강의영상)](#lecturejs)
8. [lectureHistory.js (시청/출석)](#lecturehistoryjs)
9. [question.js (문제)](#questionjs)

---

## <a name="authjs"></a>1. auth.js (인증/회원)

### 로그인

- **POST** `/auth/login`
- **파라미터**: `{ username: string, password: string }`
- **응답**: `{ accessToken: string }` (헤더에서 추출)

### 회원가입

- **POST** `/auth/register`
- **파라미터**: `{ name, email, password, role, description? }`
- **응답**: `string` (결과 메시지)

### 내 프로필 조회

- **GET** `/member/profile`
- **응답**: `{ id, name, email, role, description }`

### 회원 정보 수정

- **PUT** `/member/{memberId}`
- **파라미터**: `{ name, description }`
- **응답**: 없음

---

## <a name="adminjs"></a>2. admin.js (관리자)

### 관리자 대시보드 통계

- **GET** `/admin/list`
- **응답**: `{ members: [...], courses: [...], totalMember, totalCourses }`

### 전체 회원 목록 조회

- **GET** `/admin/list/member-update`
- **응답**: `[ { id, name, email, role, createdAt, updateAt } ]`

### 회원 정보 수정

- **PATCH** `/admin/list/member-update/{id}`
- **파라미터**: `{ name, role }`
- **응답**: 없음

### 회원 삭제

- **DELETE** `/admin/list/member-delete/{id}`
- **응답**: `string` (결과 메시지)

### 전체 강의 목록 조회

- **GET** `/admin/list/course-update`
- **응답**: `[ { course_id, course_name, educator_name, ... } ]`

### 강의 정보 수정

- **PATCH** `/admin/list/course-update/{id}`
- **파라미터**: `AdminCourseDetailDTO`
- **응답**: 없음

### 강의 삭제

- **DELETE** `/admin/list/course-delete/{id}`
- **응답**: `string` (결과 메시지)

### 회원 검색

- **GET** `/admin/list/find-member?name={name}`
- **응답**: `[ { ... } ]`

### 강의 검색

- **GET** `/admin/list/find-course?courseName={courseName}`
- **응답**: `[ { ... } ]`

---

## <a name="coursejs"></a>3. course.js (강의)

### 전체 강의 목록 조회 (교수자)

- **GET** `/educators/courses`
- **응답**: `[ { id, course_name, ... } ]`

### 내 개설 강의 목록 조회

- **GET** `/educators/courses/my`
- **응답**: `[ { ... } ]`

### 강의 상세 조회

- **GET** `/educators/courses/course-id/{courseId}`
- **응답**: `{ ... }`

### 강의 생성

- **POST** `/educators/courses`
- **파라미터**: `{ course_name, category, difficulty, point, description, max_enrollment }`
- **응답**: `number` (생성된 강의 ID)

### 강의 정보 수정

- **PATCH** `/educators/courses/course-id/{courseId}`
- **파라미터**: `{ ... }`
- **응답**: 없음

### 강의 삭제

- **DELETE** `/educators/courses/course-id/{courseId}`
- **응답**: `number` (삭제된 강의 ID)

---

## <a name="dashboardjs"></a>4. dashboard.js (대시보드)

### 최근 수강 강의 목록 (학생)

- **GET** `/main_dashboard/students/recent-enrolled`
- **응답**: `[ { course_id, course_name, educator_name } ]`

### 최근 완료 강의 목록 (학생)

- **GET** `/main_dashboard/students/recent-completed`
- **응답**: `[ { ... } ]`

### 최근 개설 강의 목록 (교수자)

- **GET** `/main_dashboard/educators/recent-created`
- **응답**: `[ { ... } ]`

### 최근 수정 강의 목록 (교수자)

- **GET** `/main_dashboard/educators/recent-updated`
- **응답**: `[ { ... } ]`

---

## <a name="enrollmentjs"></a>5. enrollment.js (수강/신청)

### 전체 강의+수강상태 목록 (학생)

- **GET** `/students/enrollments`
- **응답**: `[ { course_id, course_name, educator_name, ... } ]`

### 내 수강 강의 상세

- **GET** `/students/enrollments/course-id/{courseId}`
- **응답**: `{ ... }`

### 내 수강 목록

- **GET** `/students/enrollments/my`
- **응답**: `[ { ... } ]`

### 수강 신청

- **POST** `/students/enrollments/course-id/{courseId}`
- **응답**: 없음

### 수강 취소

- **DELETE** `/students/enrollments/course-id/{courseId}`
- **응답**: 없음

---

## <a name="examjs"></a>6. exam.js (시험)

### 시험 목록 조회 (교수자)

- **GET** `/educator/exam?courseId={courseId}`
- **응답**: `[ { ... } ]`

### 시험 상세 조회 (교수자)

- **GET** `/educator/exam/{examId}?courseId={courseId}`
- **응답**: `{ ... }`

### 시험 생성 (교수자)

- **POST** `/educator/exam?courseId={courseId}`
- **파라미터**: `{ title, description, start_time, end_time, questions }`
- **응답**: `{ ... }`

### 시험 수정 (교수자)

- **PUT** `/educator/exam/{examId}?courseId={courseId}`
- **파라미터**: `{ ... }`
- **응답**: `{ ... }`

### 시험 삭제 (교수자)

- **DELETE** `/educator/exam/{examId}?courseId={courseId}`
- **응답**: 없음

### 학생 시험 목록

- **GET** `/student/exam/{courseId}`
- **응답**: `[ { ... } ]`

### 학생 시험 상세

- **GET** `/student/exam/{courseId}/{examId}`
- **응답**: `{ ... }`

### 학생 시험 시작

- **POST** `/student/exam/{courseId}/{examId}/start`
- **응답**: 없음

### 임시 저장

- **POST** `/student/exam/{courseId}/{examId}/save`
- **파라미터**: `{ [questionId]: string }`
- **응답**: 없음

### 임시 저장 불러오기

- **GET** `/student/exam/{courseId}/{examId}/answers`
- **응답**: `{ [questionId]: string }`

### 시험 제출

- **POST** `/student/exam/{courseId}/{examId}/submit`
- **파라미터**: `{ ... }`
- **응답**: 없음

### 학생 시험 점수 조회

- **GET** `/student/exam/{courseId}/{examId}/score`
- **응답**: `{ score, totalScore }` 또는 404/null

---

## <a name="lecturejs"></a>7. lecture.js (강의영상)

### 강의 영상 목록 (교수자)

- **GET** `/lecture/list/{courseId}`
- **응답**: `[ { lecture_id, title, video_url, ... } ]`

### 강의 영상 생성

- **POST** `/lecture/create/url/{courseId}`
- **파라미터**: `[ { title, video_url } ]`
- **응답**: `string`

### 강의 영상 수정

- **PATCH** `/lecture/list/{courseId}/lecture`
- **파라미터**: `[ { lecture_id, title, video_url } ]`
- **응답**: `string`

### 강의 영상 삭제

- **DELETE** `/lecture/list/{courseId}/{lectureId}`
- **응답**: `string`

### 강의 영상 목록 (학생)

- **GET** `/student/lecture/list/{courseId}`
- **응답**: `[ { ... } ]`

### 강의 영상 상세 (학생)

- **GET** `/student/lecture/view/{courseId}/{lectureId}`
- **응답**: `{ ... }`

---

## <a name="lecturehistoryjs"></a>8. lectureHistory.js (시청/출석)

### 특정 강의 영상 시청 시간 조회

- **GET** `/history/watched-time/{lectureId}`
- **응답**: `number` (초 단위)

### 강의 시청 이력 저장

- **POST** `/history/time-line`
- **파라미터**: `{ lectureId, watchedTime, attendance }`
- **응답**: `string`

### 강의 평균 출석률 요청 (학생)

- **GET** `/history/attendance-avg/{courseId}`
- **응답**: `string`

### 강의별 전체 학생 출석 목록

- **GET** `/history/attendance/{courseId}/list`
- **응답**: `[ { studentName, totalCourse, attendanceTrue, ... } ]`

### 강의별 전체 평균 출석률

- **GET** `/history/attendance/{courseId}`
- **응답**: `number`

---

## <a name="questionjs"></a>9. question.js (문제)

### 시험 문제 목록 조회 (교수자)

- **GET** `/educator/question?courseId={courseId}&examId={examId}`
- **응답**: `[ { id, number, content, answer, score, ... } ]`

### 시험 문제 생성 (교수자)

- **POST** `/educator/question?courseId={courseId}&examId={examId}`
- **파라미터**: `{ number, content, answer, score, type, multipleChoices }`
- **응답**: `{ ... }`

### 시험 문제 수정 (교수자)

- **PUT** `/educator/question?courseId={courseId}&examId={examId}&questionId={questionId}`
- **파라미터**: `{ ... }`
- **응답**: `{ ... }`

### 시험 문제 삭제 (교수자)

- **DELETE** `/educator/question?courseId={courseId}&examId={examId}&questionId={questionId}`
- **응답**: 없음

### 시험 문제 목록 조회 (학생)

- **GET** `/student/question?courseId={courseId}&examId={examId}`
- **응답**: `[ { ... } ]`

---
