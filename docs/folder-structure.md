# 📁 프로젝트 폴더 구조 정리

```
frontend/
│
├─ eslint.config.js            # ESLint 설정 파일
├─ index.html                  # 앱 진입점 HTML
├─ package.json                # 프로젝트 메타/의존성
├─ README.md                   # 프로젝트 설명
├─ vite.config.js              # Vite 빌드 설정
│
├─ public/                     # 정적 파일(파비콘, 로고 등)
│   ├─ favicon.ico
│   └─ logo.png
│
├─ src/                        # 소스 코드 루트
│   │
│   ├─ api/                    # API 통신 모듈
│   │   ├─ admin.js
│   │   ├─ auth.js
│   │   ├─ axios.js
│   │   ├─ course.js
│   │   ├─ dashboard.js
│   │   ├─ enrollment.js
│   │   ├─ exam.js
│   │   ├─ lecture.js
│   │   ├─ lectureHistory.js
│   │   └─ question.js
│   │
│   ├─ assets/                 # 정적 에셋(이미지, 아이콘 등)
│   │   └─ react.svg
│   │
│   ├─ components/             # 재사용 UI 컴포넌트
│   │   ├─ admin/              # 관리자 관련 컴포넌트
│   │   │   ├─ common/
│   │   │   ├─ course/
│   │   │   ├─ dashboard/
│   │   │   └─ user/
│   │   ├─ attendance/         # 출석 관련
│   │   ├─ class_dashboard/    # 강의 대시보드
│   │   ├─ common/             # 공통 UI
│   │   ├─ course/             # 강의 생성/수정 폼
│   │   ├─ course_detail/      # 강의 상세
│   │   ├─ course_list/        # 강의 목록
│   │   ├─ curriculum/         # 커리큘럼 관리
│   │   ├─ dashboard/          # 대시보드
│   │   ├─ edu_course_my/      # 내 강의(교수자)
│   │   ├─ exam/               # 시험 목록/행
│   │   ├─ exam_form/          # 시험 생성/수정 폼
│   │   ├─ exam_score/         # 시험 점수/요약
│   │   ├─ exam_take/          # 시험 응시
│   │   ├─ question/           # 문제 관련
│   │   ├─ stu_course_my/      # 내 강의(학생)
│   │   ├─ video/              # 강의 영상 목록/아이템
│   │   └─ video_watch/        # 영상 시청
│   │
│   ├─ constants/              # 상수 정의
│   │   ├─ courseOptions.js
│   │   └─ userRoles.js
│   │
│   ├─ hooks/                  # 커스텀 훅
│   │   └─ auth/
│   │       ├─ AuthProvider.jsx
│   │       └─ useAuth.js
│   │
│   ├─ pages/                  # 라우트별 페이지 컴포넌트
│   │   ├─ admin/
│   │   ├─ auth/
│   │   ├─ classroom/
│   │   ├─ common/
│   │   ├─ main/
│   │   ├─ MainPage.jsx
│   │   └─ NotAuthorizedPage.jsx
│   │
│   ├─ routes/                 # 라우터/보호 라우트
│   │   ├─ AdminRoutes.jsx
│   │   ├─ CourseRoutes.jsx
│   │   ├─ DashboardClassRedirect.jsx
│   │   ├─ EducatorClassRoutes.jsx
│   │   ├─ EducatorRoutes.jsx
│   │   ├─ MainDashboardRedirect.jsx
│   │   ├─ ProtectedRoute.jsx
│   │   ├─ RoleProtectedRoute.jsx
│   │   ├─ StudentClassRoutes.jsx
│   │   └─ StudentRoutes.jsx
│   │
│   ├─ theme/                  # 테마/스타일
│   │   └─ theme.js
│   │
│   ├─ utils/                  # 유틸리티 함수
│   │   └─ videoUtils.js
│   │
│   ├─ App.css                 # 전체 앱 스타일
│   ├─ App.jsx                 # 앱 루트 컴포넌트
│   ├─ ColorModeContext.jsx    # 다크/라이트 모드 컨텍스트
│   ├─ index.css               # 전역 스타일
│   ├─ main.jsx                # 앱 진입점
│   └─ roles.js                # 역할 상수
│
└─ docs/                      # 프로젝트 문서화 및 스크린샷 폴더
    ├─ api-spec.md            # API 명세서
    ├─ folder-structure.md    # 폴더 구조 정리
    ├─ screenshot-dashboard.png # 대시보드(학생) 스크린샷
    ├─ screenshot-exam.png      # 시험 응시 화면 스크린샷
    └─ screenshot-videos.png    # 강의 영상 목록 스크린샷
```

---

## 폴더별 주요 용도 요약

- **public/**: 정적 파일(파비콘, 이미지 등)
- **src/api/**: 백엔드 API와 통신하는 함수들
- **src/assets/**: 이미지, 아이콘 등 정적 리소스
- **src/components/**: 재사용 가능한 UI 컴포넌트(역할별, 기능별로 세분화)
- **src/constants/**: 상수값 모음
- **src/hooks/**: 커스텀 React 훅
- **src/pages/**: 라우트별 페이지 컴포넌트
- **src/routes/**: 라우팅 및 보호 라우트
- **src/theme/**: 테마, 스타일 관련
- **src/utils/**: 유틸리티 함수
- **src/App.jsx, main.jsx 등**: 앱 진입점 및 루트 컴포넌트

---
