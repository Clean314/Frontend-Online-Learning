# frontend

## 최초 실행

1. `npm install` : 라이브러리 설치
2. `npm run dev` : 개발 모드로 실행

## YouTube Data API v3

API 키 적용을 위해 Notion에서 .env.local 파일 다운받아서 루트 폴더에 놓기

## URL

### Public

- `/login`
- `/signup`
- `/role-select`
- `/not-authorized`

### Protected (로그인 필요)

- `/` → DashboardHomeRedirect

### Admin (ADMIN 전용)

- `/admin/dashboard`
- `/admin/users`
- `/admin/courses`

### Educator (EDUCATOR 전용)

- `/teach/dashboard`
- `/teach/courses/my`
- `/teach/courses/new`
- `/teach/courses/new/:courseId/curriculum`

### Student (STUDENT 전용)

- `/learn/dashboard`
- `/learn/courses/my/total`
- `/learn/courses/my/:enrolledStatus`

### Courses (EDUCATOR, STUDENT)

- `/courses`
- `/courses/:courseId`

### Courses (EDUCATOR)

- `/courses/:courseId/classroom/teach/dashboard`
- `/courses/:courseId/classroom/teach/videos`
- `/courses/:courseId/classroom/teach/videos/edit`
- `/courses/:courseId/classroom/teach/attendance`
- `/courses/:courseId/classroom/teach/exams`
- `/courses/:courseId/classroom/teach/exams/new`
- `/courses/:courseId/classroom/teach/exams/:examId/edit`
- `/courses/:courseId/classroom/teach/exams/:examId/scores`
- `/courses/:courseId/classroom/teach/exams/:examId/questions`
- `/courses/:courseId/classroom/teach/exams/:examId/questions/new`
- `/courses/:courseId/classroom/teach/exams/:examId/questions/:questionId/edit`
- `/courses/:courseId/classroom/teach/exams/:examId/questions/:questionId/detail`

### Courses (STUDENT)

- `/courses/:courseId/classroom/learn/dashboard`
- `/courses/:courseId/classroom/learn/videos`
- `/courses/:courseId/classroom/learn/videos/:videoId`
- `/courses/:courseId/classroom/learn/exams`
